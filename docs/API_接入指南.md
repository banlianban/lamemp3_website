# LAMEConverter API 接入指南

## 🎯 快速开始

### API 地址
```
https://v5.chorusclip.com/convert
```

### 请求方式
- **方法**：`POST`
- **内容类型**：`multipart/form-data`

### 支持格式
WAV、FLAC、APE、MP3、M4A、AAC、OGG、OPUS、WMA 等

---

## 📋 接口参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `audio_file` | File | ✅ 是 | 要转换的音频文件 | - |
| `mode` | String | ❌ 否 | 编码模式：`vbr` 或 `cbr` | `vbr` |
| `quality` | String | ❌ 否 | VBR 质量，0-9（0 最高） | `2` |
| `bitrate` | String | ❌ 否 | CBR 比特率 | `192` |
| `force_convert` | Checkbox | ❌ 否 | 强制重新编码 | `on` |

---

## 💻 Python 调用示例

### 最简单的方式

```python
import requests

def convert_to_mp3(input_file, output_file):
    """将音频转换为 MP3"""
    url = "https://v5.chorusclip.com/convert"
    
    with open(input_file, 'rb') as f:
        files = {'audio_file': f}
        data = {'mode': 'vbr', 'quality': '2'}
        
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            with open(output_file, 'wb') as out:
                out.write(response.content)
            print(f"✅ 转换成功：{output_file}")
            return True
        else:
            print(f"❌ 转换失败")
            return False

# 使用
convert_to_mp3("song.flac", "song.mp3")
```

### 高质量转换

```python
# 使用最高质量（VBR 0）
files = {'audio_file': open('input.flac', 'rb')}
data = {'mode': 'vbr', 'quality': '0'}
response = requests.post("https://v5.chorusclip.com/convert", files=files, data=data)
```

### CBR 固定比特率

```python
# 使用 320kbps CBR
files = {'audio_file': open('input.wav', 'rb')}
data = {'mode': 'cbr', 'bitrate': '320'}
response = requests.post("https://v5.chorusclip.com/convert", files=files, data=data)
```

### 批量转换

```python
import requests
from pathlib import Path

def batch_convert(files, output_dir):
    url = "https://v5.chorusclip.com/convert"
    Path(output_dir).mkdir(exist_ok=True)
    
    for file_path in files:
        with open(file_path, 'rb') as f:
            files_data = {'audio_file': f}
            data = {'mode': 'vbr', 'quality': '2'}
            response = requests.post(url, files=files_data, data=data)
            
            if response.status_code == 200:
                output = f"{output_dir}/{Path(file_path).stem}.mp3"
                with open(output, 'wb') as out:
                    out.write(response.content)
                print(f"✅ {file_path} -> {output}")

# 使用
batch_convert(['song1.flac', 'song2.wav'], 'output')
```

---

## 🌐 其他语言示例

### JavaScript/Node.js

```javascript
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function convertToMP3(inputPath, outputPath) {
    const form = new FormData();
    form.append('audio_file', fs.createReadStream(inputPath));
    form.append('mode', 'vbr');
    form.append('quality', '2');

    const response = await axios.post(
        'https://v5.chorusclip.com/convert',
        form,
        { 
            headers: form.getHeaders(),
            responseType: 'stream'
        }
    );

    response.data.pipe(fs.createWriteStream(outputPath));
    console.log('✅ 转换成功');
}

convertToMP3('input.flac', 'output.mp3');
```

### curl 命令

```bash
# VBR 模式（默认质量 2）
curl -X POST https://v5.chorusclip.com/convert \
  -F "audio_file=@input.flac" \
  -F "mode=vbr" \
  -F "quality=2" \
  -o output.mp3

# CBR 320kbps
curl -X POST https://v5.chorusclip.com/convert \
  -F "audio_file=@input.wav" \
  -F "mode=cbr" \
  -F "bitrate=320" \
  -o output.mp3

# 最高质量
curl -X POST https://v5.chorusclip.com/convert \
  -F "audio_file=@input.m4a" \
  -F "mode=vbr" \
  -F "quality=0" \
  -o output.mp3
```

### PHP

```php
<?php
$url = 'https://v5.chorusclip.com/convert';
$file = new CURLFile('input.flac');

$postData = [
    'audio_file' => $file,
    'mode' => 'vbr',
    'quality' => '2'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

file_put_contents('output.mp3', $response);
echo "✅ 转换成功\n";
?>
```

---

## 🔧 集成到项目中

### Django 项目集成

```python
# views.py
from django.http import HttpResponse, JsonResponse
import requests

def convert_audio(request):
    if request.method == 'POST' and request.FILES.get('audio_file'):
        audio_file = request.FILES['audio_file']
        
        # 转发到 LAMEConverter API
        files = {'audio_file': audio_file.read()}
        data = {
            'mode': request.POST.get('mode', 'vbr'),
            'quality': request.POST.get('quality', '2')
        }
        
        response = requests.post(
            'https://v5.chorusclip.com/convert',
            files={'audio_file': files['audio_file']},
            data=data
        )
        
        if response.status_code == 200:
            # 返回 MP3 文件给用户
            return HttpResponse(
                response.content,
                content_type='audio/mpeg',
                headers={'Content-Disposition': 'attachment; filename="converted.mp3"'}
            )
        else:
            return JsonResponse({'error': '转换失败'}, status=500)
```

### Flask 项目集成

```python
# app.py
from flask import Flask, request, send_file
import requests
import io

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert():
    if 'audio_file' not in request.files:
        return {'error': '请上传文件'}, 400
    
    audio_file = request.files['audio_file']
    
    # 调用 LAMEConverter API
    files = {'audio_file': audio_file.read()}
    data = {'mode': 'vbr', 'quality': '2'}
    
    response = requests.post(
        'https://v5.chorusclip.com/convert',
        files={'audio_file': files['audio_file']},
        data=data
    )
    
    if response.status_code == 200:
        return send_file(
            io.BytesIO(response.content),
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='converted.mp3'
        )
    
    return {'error': '转换失败'}, 500
```

### FastAPI 项目集成

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
import requests
import io

app = FastAPI()

@app.post("/convert")
async def convert_audio(file: UploadFile = File(...)):
    # 读取上传的文件
    content = await file.read()
    
    # 调用 LAMEConverter API
    files = {'audio_file': content}
    data = {'mode': 'vbr', 'quality': '2'}
    
    response = requests.post(
        'https://v5.chorusclip.com/convert',
        files={'audio_file': files['audio_file']},
        data=data
    )
    
    if response.status_code == 200:
        return StreamingResponse(
            io.BytesIO(response.content),
            media_type='audio/mpeg',
            headers={'Content-Disposition': 'attachment; filename="converted.mp3"'}
        )
    
    return {"error": "转换失败"}
```

---

## 📊 参数说明

### 编码模式 (mode)

- **`vbr`** (推荐)：可变比特率，根据音频复杂度调整，文件更小，质量更好
- **`cbr`**：固定比特率，文件大小可预测

### VBR 质量 (quality)

| 值 | 质量 | 适用场景 |
|----|------|----------|
| 0 | 最高 | 专业音乐制作 |
| 2 | 高 | 日常音乐收听（默认推荐） |
| 4 | 中 | 语音、播客 |
| 7 | 低 | 网络传输 |
| 9 | 最低 | 极限压缩 |

### CBR 比特率 (bitrate)

- `128`：标准质量
- `192`：高质量（默认）
- `256`：极高质量
- `320`：最高质量

---

## ⚠️ 注意事项

1. **超时设置**：大文件转换可能需要较长时间，建议设置适当的超时时间（如 5-10 分钟）
2. **文件大小**：建议单个文件不超过 100MB
3. **并发限制**：避免同时发起大量请求
4. **错误处理**：务必处理网络异常、超时等情况

---

## 🔍 返回说明

- **成功**：HTTP 200，响应体为 MP3 文件的二进制数据
- **失败**：非 200 状态码，可能返回 HTML 错误页面

---

## 📞 技术支持

- 在线演示：https://v5.chorusclip.com
- 项目源码：https://github.com/banlianban/lamemp3_api

---

## 📝 完整示例文件

本项目包含完整的调用示例代码：`client_examples.py`

运行示例：
```bash
python3 client_examples.py
```

---

最后更新：2025-11-25

