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

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$app/tmp" `
  --data-urlencode "file=req-debug.log" `
  --data-urlencode "content=" `
  "$base$tok/execute/Fileman/save_file_content" | Out-Null

curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$app/tmp" `
  --data-urlencode "file=restart.txt" `
  --data-urlencode "content=debug2-$(Get-Date -Format o)" `
  "$base$tok/execute/Fileman/save_file_content" | Out-Null

# Also toggle disable/enable to force passenger recycle
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep -Seconds 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep -Seconds 8

curl.exe -s -o NUL -w "HOME=%{http_code}`n" "https://instagram-recover.com/"
curl.exe -s -o NUL -w "ABOUT=%{http_code}`n" "https://instagram-recover.com/about"
curl.exe -s -o NUL -w "CSS=%{http_code}`n" "https://instagram-recover.com/_next/static/chunks/1uo6c5a4x1rlr.css"
Start-Sleep -Seconds 2

$log = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=req-debug.log" | ConvertFrom-Json
Write-Output "=== LOG ==="
Write-Output $log.data.content
Write-Output "=== enabled ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/list_applications"
