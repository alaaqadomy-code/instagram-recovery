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

function UP([string]$path, [hashtable]$fields) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","900")
  foreach ($k in $fields.Keys) { $args += @("--data-urlencode", "$k=$($fields[$k])") }
  $args += "$base$tok$path"
  & curl.exe @args
}
function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar --max-time 120 "$base$tok$path" }

# Clear old build-status
UP "/execute/Fileman/save_file_content" @{
  dir = "/home/$user"
  file = "build-status.txt"
  content = "queued $(Get-Date -Format o)`n"
} | Out-Null

Write-Output "=== ensure_deps ==="
$r = UP "/execute/PassengerApps/ensure_deps" @{
  name = "instagram-recovery"
  type = "nodejs"
  app_path = $app
}
Write-Output $r.Substring(0, [Math]::Min(1500, $r.Length))

Start-Sleep -Seconds 5
Write-Output "=== build-status after ==="
$bs = U "/execute/Fileman/get_file_content?dir=/home/$user&file=build-status.txt" | ConvertFrom-Json
Write-Output $bs.data.content.Substring(0, [Math]::Min(3000, $bs.data.content.Length))

Write-Output "=== BUILD_ID after ==="
$bid = U "/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID" | ConvertFrom-Json
Write-Output $bid.data.content

UP "/execute/Fileman/save_file_content" @{
  dir = "$app/tmp"
  file = "restart.txt"
  content = "after-rebuild-$(Get-Date -Format o)"
} | Out-Null
Write-Output "restart touched"
Write-Output (U "/execute/PassengerApps/enable_application?name=instagram-recovery")
