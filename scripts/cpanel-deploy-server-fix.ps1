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

# Build application/x-www-form-urlencoded body via .NET to avoid curl arg splitting
Add-Type -AssemblyName System.Web
$body = "dir={0}&file={1}&content={2}" -f `
  [uri]::EscapeDataString($app), `
  [uri]::EscapeDataString("server.js"), `
  [uri]::EscapeDataString((Get-Content -Raw -Path $src))

$bodyFile = Join-Path $env:TEMP "cpanel-save-body.txt"
[IO.File]::WriteAllText($bodyFile, $body)
$save = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  -H "Content-Type: application/x-www-form-urlencoded" `
  --data-binary "@$bodyFile" `
  "$base$tok/execute/Fileman/save_file_content"
Write-Output "SAVE=$save"

$verify = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app&file=server.js" | ConvertFrom-Json
Write-Output ("HAS_RESOLVE=" + ($verify.data.content -match "resolveUrl"))
Write-Output ("HAS_RAWLOG=" + ($verify.data.content -match "raw="))

curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=req-debug.log" --data-urlencode "content=" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=fix-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

curl.exe -s -o NUL -w "HOME=%{http_code} %{size_download}`n" "https://instagram-recover.com/"
curl.exe -s -o NUL -w "ABOUT=%{http_code} %{size_download}`n" "https://instagram-recover.com/about"
curl.exe -s -D - -o NUL "https://instagram-recover.com/" | Select-String -Pattern "HTTP|x-next|Status|Content-Length"
Start-Sleep 2
$log = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=req-debug.log" | ConvertFrom-Json
Write-Output "===LOG==="
Write-Output $log.data.content
