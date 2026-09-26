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

# Ensure passenger on
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null

# List /home with API2 to see nicemode of instagra
$ls = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=listfiles" `
  --data-urlencode "dir=/home" `
  --data-urlencode "showdotfiles=1" `
  "$base$tok/json-api/cpanel"
Write-Output $ls

# Also try chmod via different metadata formats
foreach ($meta in @("0711","711","511")) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    --data-urlencode "cpanel_jsonapi_user=$user" `
    --data-urlencode "cpanel_jsonapi_apiversion=2" `
    --data-urlencode "cpanel_jsonapi_module=Fileman" `
    --data-urlencode "cpanel_jsonapi_func=fileop" `
    --data-urlencode "op=chmod" `
    --data-urlencode "sourcefiles=/home/$user" `
    --data-urlencode "metadata=$meta" `
    "$base$tok/json-api/cpanel"
  Write-Output "chmod $meta -> $r"
}

Write-Output ("home_now=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/"))
