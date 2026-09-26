$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-paths-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME

Write-Output "=== old app BUILD_ID ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user/instagram-recovery/.next&file=BUILD_ID"
Write-Output ""
Write-Output "=== which node paths exist ==="
foreach ($p in @(
  "/opt/cpanel/ea-nodejs22/bin/node",
  "/opt/cpanel/ea-nodejs20/bin/node",
  "/opt/cpanel/ea-nodejs18/bin/node",
  "/usr/bin/node"
)) {
  $dir = Split-Path $p -Parent
  $file = Split-Path $p -Leaf
  $r = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$dir&file=$file"
  $ok = ($r -match '"status":1' -and $r -notmatch '"errors"')
  Write-Output "$p exists=$ok"
}
Write-Output ""
Write-Output "=== Cron list ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Cron/fetch_cron"
Write-Output ""
Write-Output "=== Passenger ensure_dependencies API help? ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/ensure_dependencies?name=instagram-recovery" | ForEach-Object { $_.Substring(0, [Math]::Min(1500, $_.Length)) }
Write-Output ""
Write-Output "=== live status ==="
curl.exe -s -o NUL -w "HOME=%{http_code}`n" --max-time 15 "https://instagram-recover.com/"
Write-Output "=== BUILD_ID now ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user/public_html/.next&file=BUILD_ID"
Write-Output ""
Write-Output "=== .next/lock still? ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user/public_html/.next&file=lock"
