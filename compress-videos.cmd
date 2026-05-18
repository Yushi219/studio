@echo off
REM ===================================================================
REM  compress-videos.cmd  —  shrink every assets\*.mp4 for the CDN
REM  Output goes to  _video_dist\  mirroring the path AFTER "assets\"
REM  (because the site requests  <CDN base> + <path without assets/>).
REM  Upload the WHOLE _video_dist\ folder to your Blob container root.
REM
REM  Needs FFmpeg.  If you don't have it:
REM      winget install --id Gyan.FFmpeg -e
REM  then open a NEW terminal and run this file again.
REM ===================================================================
setlocal enabledelayedexpansion
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo [!] FFmpeg not found. Install it first:
  echo     winget install --id Gyan.FFmpeg -e
  pause
  exit /b 1
)

set "SRC=%~dp0assets"
set "OUT=%~dp0_video_dist"
if not exist "%OUT%" mkdir "%OUT%"

for /r "%SRC%" %%F in (*.mp4) do (
  set "FULL=%%F"
  set "REL=!FULL:%SRC%\=!"
  set "DST=%OUT%\!REL!"
  for %%D in ("!DST!") do if not exist "%%~dpD" mkdir "%%~dpD"
  echo.
  echo ==== !REL!
  ffmpeg -y -i "%%F" -vf "scale='trunc(min(1920,iw)/2)*2':-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "!DST!"
  REM optional poster (first good frame):
  ffmpeg -y -ss 00:00:01 -i "%%F" -frames:v 1 -q:v 4 "!DST:.mp4=.jpg!"
)

echo.
echo Done. Compressed videos + posters are in:  %OUT%
echo Upload the CONTENTS of that folder to your Blob/CDN container root.
pause
