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

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }

Write-Output "=== index files ==="
foreach ($f in @("index.html","index.meta","index.rsc","page.js","page_client-reference-manifest.js")) {
  $o = U "/execute/Fileman/get_file_content?dir=$app/.next/server/app&file=$f"
  $j = $o | ConvertFrom-Json
  if ($j.status -eq 1) { Write-Output "OK $f len=$($j.data.content.Length)" }
  else { Write-Output "MISS $f err=$($j.errors | ConvertTo-Json -Compress)" }
}

Write-Output "=== page dir ==="
$pd = U "/execute/Fileman/list_files?dir=$app/.next/server/app/page&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($pd.data) | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }

Write-Output "=== server.js head ==="
$sj = U "/execute/Fileman/get_file_content?dir=$app&file=server.js" | ConvertFrom-Json
Write-Output $sj.data.content

Write-Output "=== package.json scripts ==="
$pj = U "/execute/Fileman/get_file_content?dir=$app&file=package.json" | ConvertFrom-Json
Write-Output $pj.data.content.Substring(0, [Math]::Min(800, $pj.data.content.Length))

Write-Output "=== PassengerApps functions probe ==="
foreach ($fn in @("edit_application","set_env_vars","enable_application","disable_application","uninstall_application","get_application")) {
  $o = U "/execute/PassengerApps/${fn}?name=instagram-recovery&application=instagram-recovery"
  Write-Output ("$fn -> " + $o.Substring(0, [Math]::Min(200, $o.Length)))
}
