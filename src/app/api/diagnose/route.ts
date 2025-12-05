import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * 音频文件诊断 API
 * 分析音频文件的兼容性并返回评分
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio_file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '请上传音频文件' },
        { status: 400 }
      );
    }

    // 基本文件信息
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    // 读取文件的前几个字节来分析格式
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // 诊断结果
    const diagnosis = analyzeAudioFile(bytes, fileInfo);
    
    logger.log(`诊断完成: ${file.name}, 评分: ${diagnosis.score}`);

    return NextResponse.json(diagnosis);
  } catch (error: any) {
    logger.error('诊断过程出错:', error);
    
    return NextResponse.json(
      { error: error.message || '诊断失败，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * 分析音频文件并计算兼容性评分
 */
function analyzeAudioFile(bytes: Uint8Array, fileInfo: any) {
  let score = 100;
  const issues: string[] = [];
  const details: any = {
    format: 'Unknown',
    bitrate: 'Unknown',
    bitrateType: 'Unknown',
    sampleRate: 'Unknown',
    channels: 'Unknown',
    encoder: 'Unknown',
    id3Version: 'Unknown',
    coverSize: 0,
  };

  // 检测文件格式
  const format = detectFormat(bytes);
  details.format = format;

  // MP3 文件特殊分析
  if (format === 'MP3' || fileInfo.name.toLowerCase().endsWith('.mp3')) {
    const mp3Analysis = analyzeMp3(bytes);
    Object.assign(details, mp3Analysis);

    // 评分规则
    // 1. 比特率模式 (VBR vs CBR)
    if (details.bitrateType === 'VBR' || details.bitrateType.includes('可变') || details.bitrateType.includes('Variable')) {
      score -= 25;
      issues.push('Diagnosis.issues.vbr');
    }

    // 2. 编码器检测
    if (details.encoder && !details.encoder.includes('LAME')) {
      score -= 20;
      issues.push('Diagnosis.issues.codec');
    }

    // 3. 封面大小
    if (details.coverSize > 1024 * 1024) { // > 1MB
      score -= 15;
      issues.push('Diagnosis.issues.cover');
    }

    // 4. ID3 版本
    if (details.id3Version === 'v2.4') {
      score -= 10;
      issues.push('Diagnosis.issues.id3v24');
    }

    // 5. 采样率
    if (details.sampleRate && details.sampleRate !== '44.1kHz' && details.sampleRate !== '44100 Hz') {
      score -= 10;
      issues.push('Diagnosis.issues.nonStandardSampleRate');
    }
  } else {
    // 非 MP3 格式，默认需要转换
    score = 40;
    issues.push('Diagnosis.issues.nonMp3Format');
    
    if (format === 'FLAC') {
      issues.push('Diagnosis.issues.flacFormat');
    } else if (format === 'WAV') {
      issues.push('Diagnosis.issues.wavFormat');
    }
  }

  // 确保分数在 0-100 之间
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    issues,
    details,
    needsConversion: score < 90,
    riskLevel: score >= 90 ? 'low' : score >= 70 ? 'medium' : 'high',
  };
}

/**
 * 检测音频文件格式
 */
function detectFormat(bytes: Uint8Array): string {
  // MP3: FF FB 或 FF F3 或 FF F2 或包含 ID3
  if (bytes.length > 3) {
    // ID3v2 标签
    if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) { // "ID3"
      return 'MP3';
    }
    // MP3 同步字
    if (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) {
      return 'MP3';
    }
  }

  // FLAC: fLaC
  if (bytes.length > 4 && 
      bytes[0] === 0x66 && bytes[1] === 0x4C && 
      bytes[2] === 0x61 && bytes[3] === 0x43) {
    return 'FLAC';
  }

  // WAV: RIFF....WAVE
  if (bytes.length > 12 && 
      bytes[0] === 0x52 && bytes[1] === 0x49 && 
      bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x41 && 
      bytes[10] === 0x56 && bytes[11] === 0x45) {
    return 'WAV';
  }

  // M4A/AAC: ftyp
  if (bytes.length > 8 && 
      bytes[4] === 0x66 && bytes[5] === 0x74 && 
      bytes[6] === 0x79 && bytes[7] === 0x70) {
    return 'M4A/AAC';
  }

  // OGG: OggS
  if (bytes.length > 4 && 
      bytes[0] === 0x4F && bytes[1] === 0x67 && 
      bytes[2] === 0x67 && bytes[3] === 0x53) {
    return 'OGG';
  }

  return 'Unknown';
}

/**
 * 分析 MP3 文件详情
 */
function analyzeMp3(bytes: Uint8Array) {
  const result: any = {
    bitrateType: 'Unknown',
    bitrate: 'Unknown',
    sampleRate: 'Unknown',
    channels: 'Unknown',
    encoder: 'Unknown',
    id3Version: 'None',
    coverSize: 0,
  };

  try {
    // 检测 ID3v2 标签
    if (bytes.length > 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
      const majorVersion = bytes[3];
      const minorVersion = bytes[4];
      result.id3Version = `v2.${majorVersion}`;

      // 获取 ID3 标签大小
      const tagSize = ((bytes[6] & 0x7F) << 21) | 
                     ((bytes[7] & 0x7F) << 14) | 
                     ((bytes[8] & 0x7F) << 7) | 
                     (bytes[9] & 0x7F);

      // 尝试检测封面大小（简化版，只是估算）
      // 在实际的 ID3v2 中，APIC 帧包含图片数据
      const id3Data = bytes.slice(10, Math.min(10 + tagSize, bytes.length));
      const apicIndex = findAPICFrame(id3Data);
      if (apicIndex > 0) {
        // 估算封面大小（实际实现需要解析帧头）
        result.coverSize = Math.min(tagSize / 2, 2 * 1024 * 1024); // 粗略估计
      }
    }

    // 查找第一个 MP3 帧来分析音频属性
    let frameStart = findMp3FrameSync(bytes);
    
    if (frameStart >= 0 && frameStart + 4 < bytes.length) {
      const header = (bytes[frameStart] << 24) | 
                    (bytes[frameStart + 1] << 16) | 
                    (bytes[frameStart + 2] << 8) | 
                    bytes[frameStart + 3];

      // 解析 MPEG 版本
      const version = (header >> 19) & 0x3;
      
      // 解析层
      const layer = (header >> 17) & 0x3;
      
      // 解析比特率索引
      const bitrateIndex = (header >> 12) & 0xF;
      
      // 解析采样率索引
      const samplerateIndex = (header >> 10) & 0x3;
      
      // 解析声道模式
      const channelMode = (header >> 6) & 0x3;

      // 采样率表
      const sampleRates = [
        [44100, 48000, 32000], // MPEG 1
        [22050, 24000, 16000], // MPEG 2
        [11025, 12000, 8000],  // MPEG 2.5
      ];

      if (samplerateIndex < 3) {
        const versionIndex = version === 3 ? 0 : version === 2 ? 1 : 2;
        const sampleRate = sampleRates[versionIndex]?.[samplerateIndex];
        if (sampleRate) {
          result.sampleRate = `${sampleRate} Hz`;
        }
      }

      // 声道
      const channelModes = ['Stereo', 'Joint Stereo', 'Dual Channel', 'Mono'];
      result.channels = channelModes[channelMode] || 'Unknown';

      // 比特率（简化版，实际需要完整的查找表）
      if (bitrateIndex > 0 && bitrateIndex < 15) {
        const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
        result.bitrate = `${bitrates[bitrateIndex]} kbps`;
      }

      // 检测 VBR（查找 Xing 或 VBRI 头）
      // Calculate VBR header offset based on MPEG version and channel mode
      // MPEG 1: Mono (+21), Stereo/Joint/Dual (+36)
      // MPEG 2/2.5: Mono (+13), Stereo/Joint/Dual (+21)
      let offset = 36;
      if (version === 3) { // MPEG 1
        offset = channelMode === 3 ? 21 : 36;
      } else { // MPEG 2/2.5
        offset = channelMode === 3 ? 13 : 21;
      }

      const vbrHeaderOffset = frameStart + offset;
      if (vbrHeaderOffset + 4 < bytes.length) {
        const vbrBytes = bytes.slice(vbrHeaderOffset, vbrHeaderOffset + 4);
        const vbrTag = String.fromCharCode(vbrBytes[0], vbrBytes[1], vbrBytes[2], vbrBytes[3]);
        
        // Xing or VBRI indicates VBR
        // Info indicates CBR (LAME writes Info tag for CBR files)
        if (vbrTag === 'Xing' || vbrTag === 'VBRI') {
          result.bitrateType = 'VBR';
        } else if (vbrTag === 'Info') {
          result.bitrateType = 'CBR';
        } else {
          result.bitrateType = 'CBR';
        }
      }

      // 尝试检测编码器（查找 LAME 标签）
      const lameOffset = frameStart + 156; // LAME 标签通常在这个位置
      if (lameOffset + 4 < bytes.length) {
        const lameBytes = bytes.slice(lameOffset, lameOffset + 4);
        const lameTag = String.fromCharCode(lameBytes[0], lameBytes[1], lameBytes[2], lameBytes[3]);
        if (lameTag.includes('LAME')) {
          result.encoder = 'LAME';
        } else {
          result.encoder = 'Other';
        }
      }
    }
  } catch (error) {
    logger.error('MP3 分析出错:', error);
  }

  return result;
}

/**
 * 查找 MP3 帧同步字
 */
function findMp3FrameSync(bytes: Uint8Array): number {
  for (let i = 0; i < Math.min(bytes.length - 1, 8192); i++) {
    if (bytes[i] === 0xFF && (bytes[i + 1] & 0xE0) === 0xE0) {
      return i;
    }
  }
  return -1;
}

/**
 * 查找 APIC 帧（封面图片）
 */
function findAPICFrame(bytes: Uint8Array): number {
  const apicStr = 'APIC';
  for (let i = 0; i < bytes.length - 4; i++) {
    if (String.fromCharCode(bytes[i], bytes[i+1], bytes[i+2], bytes[i+3]) === apicStr) {
      return i;
    }
  }
  return -1;
}

