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

Write-Output "=== .next ==="
$next = U "/execute/Fileman/list_files?dir=$app/.next&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($next.data) | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }

Write-Output "=== try read BUILD_ID ==="
$bid = U "/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"
Write-Output $bid.Substring(0, [Math]::Min(400, $bid.Length))

Write-Output "=== git config ==="
$gc = U "/execute/Fileman/get_file_content?dir=$app/.git&file=config"
Write-Output $gc.Substring(0, [Math]::Min(800, $gc.Length))

Write-Output "=== probe modules ==="
foreach ($p in @(
  "/execute/PassengerApps/list_applications",
  "/execute/PassengerPhusionPassengerApps/list_applications",
  "/execute/Cron/list_cron_jobs",
  "/execute/SiteScripts/list",
  "/execute/SiteScripts/list_scripts",
  "/execute/Terminal/get_session",
  "/execute/Variables/get_user_information"
)) {
  $o = U $p
  Write-Output "---- $p"
  Write-Output $o.Substring(0, [Math]::Min(500, $o.Length))
}
