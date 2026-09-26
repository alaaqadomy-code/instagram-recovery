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
Write-Output ("LOGIN_HEAD=" + $login.Substring(0, [Math]::Min(220, $login.Length)))
$tok = ($login | ConvertFrom-Json).security_token
if (-not $tok) { exit 1 }
Write-Output "TOK=$tok"
$user = $vars.HOST_USERNAME

$urls = @(
  "$base$tok/execute/Fileman/list_files?dir=/home/$user&include_mime=0&show_hidden=1",
  "$base$tok/execute/Fileman/list_files?dir=/home/$user/instagram-recovery&include_mime=0&show_hidden=1",
  "$base$tok/execute/DomainInfo/list_domains",
  "$base$tok/execute/VersionControl/list",
  "$base$tok/execute/VersionControlDeployment/list"
)
foreach ($u in $urls) {
  $out = curl.exe -s -c $cookieJar -b $cookieJar $u
  Write-Output "===="
  Write-Output $out.Substring(0, [Math]::Min(1200, $out.Length))
}
