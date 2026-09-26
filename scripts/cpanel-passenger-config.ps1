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

foreach ($pair in @(
  @{ d = $app; f = "Passengerfile.json" },
  @{ d = $app; f = ".htaccess" },
  @{ d = "/home/$user/public_html"; f = ".htaccess" },
  @{ d = $app; f = "package.json" }
)) {
  Write-Output "==== $($pair.d)/$($pair.f)"
  $o = U "/execute/Fileman/get_file_content?dir=$($pair.d)&file=$($pair.f)" | ConvertFrom-Json
  if ($o.status -eq 1) { Write-Output $o.data.content }
  else { Write-Output ($o.errors | ConvertTo-Json -Compress) }
}

Write-Output "==== public_html listing ==="
$ph = U "/execute/Fileman/list_files?dir=/home/$user/public_html&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($ph.data) | Select-Object -First 30 | ForEach-Object { Write-Output ("{0,-6} {1}" -f $_.type, $_.file) }

Write-Output "==== stderr / logs under app ==="
foreach ($dir in @("$app/tmp", "$app/logs", "/home/$user/logs")) {
  $ls = U "/execute/Fileman/list_files?dir=$dir&include_mime=0&show_hidden=1" | ConvertFrom-Json
  Write-Output "-- $dir status=$($ls.status)"
  @($ls.data) | Select-Object -First 20 | ForEach-Object { Write-Output ("{0,-6} {1,10} {2}" -f $_.type, $_.size, $_.file) }
}
