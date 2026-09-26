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
$userHome = "/home/$user"
$app = "$userHome/instagram-recovery"
$bak = "public_html.bak-20260926"

function UP([string]$path, [hashtable]$fields) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","120")
  foreach ($k in $fields.Keys) { $args += @("--data-urlencode", "$k=$($fields[$k])") }
  $args += "$base$tok$path"
  & curl.exe @args
}
function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }

Write-Output "=== list Fileman function by trying rename ==="
# API2 Fileman::fileop with op=rename
$r1 = UP "/execute/Fileman/fileop" @{
  op = "rename"
  sourcefiles = "$userHome/public_html"
  destfiles = "$userHome/$bak"
}
Write-Output "rename1=$($r1.Substring(0,[Math]::Min(400,$r1.Length)))"

$r2 = UP "/execute/Fileman/fileop" @{
  op = "rename"
  sourcefiles = "public_html"
  destfiles = $bak
  dir = $userHome
}
Write-Output "rename2=$($r2.Substring(0,[Math]::Min(400,$r2.Length)))"

# Try doublecall / json-api
Write-Output "=== API2 fileop ==="
$api2 = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=rename" `
  --data-urlencode "sourcefiles=$userHome/public_html" `
  --data-urlencode "destfiles=$userHome/$bak" `
  "$base$tok/json-api/cpanel"
Write-Output $api2.Substring(0, [Math]::Min(600, $api2.Length))

Write-Output "=== home listing ==="
$o = U "/execute/Fileman/list_files?dir=$userHome&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o.data) | Where-Object { $_.file -match 'public|instagram|bak' } | ForEach-Object {
  Write-Output ("{0} mode={1} {2}" -f $_.type, $_.nicemode, $_.file)
}
