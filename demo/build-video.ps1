$ErrorActionPreference = 'Stop'

$ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffmpegCommand) {
  $ffmpegExe = $ffmpegCommand.Source
} else {
  $wingetPackages = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
  $ffmpegExe = Get-ChildItem -LiteralPath $wingetPackages -Filter ffmpeg.exe -File -Recurse -ErrorAction Stop |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $ffmpegExe) { throw 'ffmpeg_not_found' }
$ffprobeExe = Join-Path (Split-Path -Parent $ffmpegExe) 'ffprobe.exe'
$demoDir = Split-Path -Parent $MyInvocation.MyCommand.Path

& $ffmpegExe -y `
  -f concat -safe 0 -i (Join-Path $demoDir 'video.ffconcat') `
  -i (Join-Path $demoDir 'narration.wav') `
  -vf 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x120c24,format=yuv420p' `
  -r 30 -c:v libx264 -preset medium -crf 20 `
  -c:a aac -b:a 192k -shortest -movflags +faststart `
  (Join-Path $demoDir 'webmcp-demo.mp4')

if ($LASTEXITCODE -ne 0) { throw 'ffmpeg_failed' }

& $ffprobeExe -v error `
  -show_entries 'format=duration,size:stream=index,codec_name,codec_type,width,height' `
  -of json (Join-Path $demoDir 'webmcp-demo.mp4')

if ($LASTEXITCODE -ne 0) { throw 'ffprobe_failed' }
