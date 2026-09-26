$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-deploy-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

function Api2([hashtable]$extra) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","120",
    "--data-urlencode","cpanel_jsonapi_user=$user",
    "--data-urlencode","cpanel_jsonapi_apiversion=2",
    "--data-urlencode","cpanel_jsonapi_module=$($extra.module)",
    "--data-urlencode","cpanel_jsonapi_func=$($extra.func)")
  foreach ($k in $extra.Keys) {
    if ($k -in @("module","func")) { continue }
    $args += @("--data-urlencode", "$k=$($extra[$k])")
  }
  $args += "$base$tok/json-api/cpanel"
  & curl.exe @args
}
function UapiPost([string]$path, [hashtable]$f) {
  $a = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","900")
  foreach ($k in $f.Keys) { $a += @("--data-urlencode", "$k=$($f[$k])") }
  $a += "$base$tok$path"; & curl.exe @a
}

Write-Output "=== VersionControl API2 ==="
foreach ($fn in @("list","create","update","pull","deploy")) {
  $r = Api2 @{ module = "VersionControl"; func = $fn; repository_root = $app }
  Write-Output "$fn -> $($r.Substring(0,[Math]::Min(250,$r.Length)))"
}

Write-Output "=== ensure_deps variants ==="
foreach ($type in @("npm","node","nodejs","Node.js","js")) {
  $r = UapiPost "/execute/PassengerApps/ensure_deps" @{ name = "instagram-recovery"; type = $type; app_path = $app }
  Write-Output "type=$type -> $($r.Substring(0,[Math]::Min(200,$r.Length)))"
}

# Check HEAD on server
$head = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.git&file=HEAD" | ConvertFrom-Json
Write-Output "SERVER_HEAD=$($head.data.content)"
$ref = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.git/refs/heads&file=main" | ConvertFrom-Json
Write-Output "SERVER_MAIN_REF=$($ref.data.content)"
