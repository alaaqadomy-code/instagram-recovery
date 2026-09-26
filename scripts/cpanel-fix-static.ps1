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

function U([string]$path) {
  curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path"
}

Write-Output "=== static ==="
$st = U "/execute/Fileman/list_files?dir=$app/.next/static&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($st.data) | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }

Write-Output "=== static/chunks (first 30) ==="
$ch = U "/execute/Fileman/list_files?dir=$app/.next/static/chunks&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($ch.data) | Select-Object -First 30 | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }
$css = @($ch.data) | Where-Object { $_.file -like "*1uo6c5a4x1rlr*" -or $_.file -like "*.css" }
Write-Output ("CSS_MATCHES=" + (($css | ForEach-Object { $_.file }) -join ","))

Write-Output "=== server/app top ==="
$sa = U "/execute/Fileman/list_files?dir=$app/.next/server/app&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($sa.data) | Select-Object -First 40 | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }

Write-Output "=== passenger restart / env ==="
foreach ($p in @(
  "/execute/PassengerApps/ensure_deps?name=instagram-recovery",
  "/execute/PassengerApps/restart_application?name=instagram-recovery",
  "/execute/PassengerApps/list_applications"
)) {
  Write-Output "---- $p"
  $o = U $p
  Write-Output $o.Substring(0, [Math]::Min(600, $o.Length))
}

# Touch restart.txt
Write-Output "=== touch restart ==="
$touch = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$app/tmp" `
  --data-urlencode "file=restart.txt" `
  --data-urlencode "content=restart-$(Get-Date -Format o)" `
  "$base$tok/execute/Fileman/save_file_content"
Write-Output $touch.Substring(0, [Math]::Min(400, $touch.Length))
