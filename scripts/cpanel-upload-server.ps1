$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-cookies.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/instagram-recovery"
$src = Join-Path $PSScriptRoot "server.debug.js"

# Upload via Fileman upload_files if available
Write-Output "=== try upload_files ==="
$up = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  -F "dir=$app" `
  -F "file-1=@$src;filename=server.js" `
  "$base$tok/execute/Fileman/upload_files"
Write-Output $up.Substring(0, [Math]::Min(800, $up.Length))

# Fallback save_file_content with UTF8 bytes file
Write-Output "=== save_file_content ==="
$tmpContent = Join-Path $env:TEMP "server-upload.js"
Copy-Item $src $tmpContent -Force
$save = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$app" `
  --data-urlencode "file=server.js" `
  --data-urlencode "content@$tmpContent" `
  "$base$tok/execute/Fileman/save_file_content"
Write-Output "SAVE_LEN=$($save.Length)"
Write-Output $save.Substring(0, [Math]::Min(500, [Math]::Max(0,$save.Length)))

Write-Output "=== verify server.js ==="
$v = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app&file=server.js" | ConvertFrom-Json
Write-Output ("LEN=" + $v.data.content.Length)
Write-Output $v.data.content.Substring(0, [Math]::Min(400, $v.data.content.Length))
