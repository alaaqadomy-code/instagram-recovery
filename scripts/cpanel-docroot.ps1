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

Write-Output "=== docroots / domains ==="
foreach ($p in @(
  "/execute/DomainInfo/domains_data?format=hash",
  "/execute/DomainInfo/list_domains",
  "/execute/DomainInfo/single_domain_data?domain=instagram-recover.com"
)) {
  Write-Output "---- $p"
  $o = U $p
  Write-Output $o.Substring(0, [Math]::Min(1200, $o.Length))
}

Write-Output "=== permissions home + app ==="
$stat = U "/execute/Fileman/get_file_information?path=/home/$user"
Write-Output $stat.Substring(0, [Math]::Min(800, $stat.Length))
$stat2 = U "/execute/Fileman/get_file_information?path=$app"
Write-Output $stat2.Substring(0, [Math]::Min(800, $stat2.Length))

Write-Output "=== edit_application full ==="
$ed = U "/execute/PassengerApps/edit_application?name=instagram-recovery"
Write-Output $ed
