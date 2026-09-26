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
$app = "/home/$user/public_html"

function UP([string]$path, [hashtable]$f) {
  $a = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","120")
  foreach ($k in $f.Keys) { $a += @("--data-urlencode", "$k=$($f[$k])") }
  $a += "$base$tok$path"; & curl.exe @a
}
function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }

Write-Output "=== probe PassengerApps funcs ==="
foreach ($fn in @(
  "register_application","create_application","add_application","install_application",
  "unregister_application","delete_application","remove_application",
  "ensure_deps","list_applications","edit_application","enable_application","disable_application"
)) {
  $r = U "/execute/PassengerApps/${fn}"
  $short = $r.Substring(0, [Math]::Min(180, $r.Length))
  Write-Output "$fn -> $short"
}

Write-Output "=== try create/register ==="
foreach ($attempt in @(
  @{ path="/execute/PassengerApps/register_application"; f=@{ name="instagram-recovery"; path=$app; domain="instagram-recover.com"; base_uri="/"; deployment_mode="production"; nodejs="/usr/bin/node" } },
  @{ path="/execute/PassengerApps/create_application"; f=@{ name="instagram-recovery2"; path=$app; domain="instagram-recover.com"; base_uri="/"; deployment_mode="production"; nodejs="/usr/bin/node" } },
  @{ path="/execute/PassengerApps/add_application"; f=@{ name="instagram-recovery2"; path=$app; domain="instagram-recover.com"; base_uri="/"; deployment_mode="production"; nodejs="/usr/bin/node" } }
)) {
  Write-Output "---- $($attempt.path)"
  Write-Output (UP $attempt.path $attempt.f).Substring(0, [Math]::Min(400, 9999))
}
