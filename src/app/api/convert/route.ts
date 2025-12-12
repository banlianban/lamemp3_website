import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5分钟超时

/**
 * 音频文件转换 API
 * 将用户上传的文件转发到 LAMEConverter API 进行转换
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

    // 验证文件类型
    const validTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/flac',
      'audio/x-flac',
      'audio/wav',
      'audio/x-wav',
      'audio/wave',
      'audio/ape',
      'audio/x-ape',
      'audio/m4a',
      'audio/x-m4a',
      'audio/m4b',
      'audio/x-m4b',
      'audio/mp4',
      'audio/aac',
      'audio/aacp',
      'audio/ogg',
      'audio/opus',
      'audio/x-ms-wma',
      'application/octet-stream', // 某些文件可能识别为此类型
    ];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['mp3', 'flac', 'wav', 'wave', 'ape', 'm4a', 'm4b', 'mp4', 'aac', 'ogg', 'opus', 'wma'];

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: '不支持的文件格式，请上传 WAV、FLAC、APE、MP3、M4A、AAC、OGG、OPUS、WMA 等格式' },
        { status: 400 }
      );
    }

    // 验证文件大小（100MB 限制）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制（最大 100MB）' },
        { status: 400 }
      );
    }

    // 准备转发到 LAMEConverter API
    const apiFormData = new FormData();
    apiFormData.append('audio_file', file);
    
    // 获取转换参数（如果有）
    const mode = formData.get('mode') || 'cbr';
    const quality = formData.get('quality') || '2';
    const bitrate = formData.get('bitrate') || '128';
    const forceConvert = formData.get('force_convert');

    apiFormData.append('mode', mode as string);
    apiFormData.append('quality', quality as string);
    apiFormData.append('bitrate', bitrate as string);
    
    if (forceConvert === 'on' || forceConvert === 'true') {
      apiFormData.append('force_convert', 'on');
    }

    logger.log(`转换请求: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB), 模式: ${mode}, 质量: ${quality}`);

    // 调用外部 API
    const apiUrl = 'https://v5.chorusclip.com/convert';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000); // 5分钟超时

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: apiFormData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        logger.error(`API 返回错误: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        logger.error('错误详情:', errorText);
        
        return NextResponse.json(
          { error: '音频转换失败，请稍后重试' },
          { status: 500 }
        );
      }

      // 获取转换后的文件
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      logger.log(`转换成功: ${file.name} -> ${(buffer.length / 1024 / 1024).toFixed(2)}MB MP3`);

      // 返回 MP3 文件
      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const fileName = `${originalName}_converted.mp3`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        logger.error('请求超时');
        return NextResponse.json(
          { error: '转换超时，请尝试较小的文件或稍后重试' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    logger.error('转换过程出错:', error);
    
    return NextResponse.json(
      { error: error.message || '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

