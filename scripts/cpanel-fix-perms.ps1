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
$app = "$userHome/public_html"

function U([string]$path) { curl.exe -s -c $cookieJar -b $cookieJar "$base$tok$path" }
function Api2([hashtable]$extra) {
  $args = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST",
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

Write-Output "=== perms before ==="
foreach ($p in @($userHome, $app, "$app/.next", "$app/server.js")) {
  $info = U "/execute/Fileman/get_file_information?path=$p"
  Write-Output "$p -> $($info.Substring(0,[Math]::Min(250,$info.Length)))"
}

# UAPI Fileman::set_permissions or API2 Fileman::fileop op=chmod
Write-Output "=== chmod home 711 ==="
Write-Output (Api2 @{ module="Fileman"; func="fileop"; op="chmod"; sourcefiles=$userHome; metadata="0711" })
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=chmod" `
  --data-urlencode "sourcefiles=$userHome" `
  --data-urlencode "metadata=711" `
  "$base$tok/json-api/cpanel")

Write-Output "=== chmod public_html 755 ==="
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "cpanel_jsonapi_user=$user" `
  --data-urlencode "cpanel_jsonapi_apiversion=2" `
  --data-urlencode "cpanel_jsonapi_module=Fileman" `
  --data-urlencode "cpanel_jsonapi_func=fileop" `
  --data-urlencode "op=chmod" `
  --data-urlencode "sourcefiles=$app" `
  --data-urlencode "metadata=755" `
  "$base$tok/json-api/cpanel")

# UAPI set_permissions
Write-Output "=== UAPI set_permissions ==="
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "path=$userHome" `
  --data-urlencode "permissions=711" `
  "$base$tok/execute/Fileman/set_permissions")
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "path=$app" `
  --data-urlencode "permissions=755" `
  "$base$tok/execute/Fileman/set_permissions")

Write-Output "=== listing modes ==="
$o = U "/execute/Fileman/list_files?dir=/home&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o.data) | Where-Object { $_.file -eq $user } | ForEach-Object { Write-Output ("home_entry {0} {1}" -f $_.nicemode, $_.file) }
$o2 = U "/execute/Fileman/list_files?dir=$userHome&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($o2.data) | Where-Object { $_.file -eq "public_html" } | ForEach-Object { Write-Output ("pub {0}" -f $_.nicemode) }

# Test with passenger disabled
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
Write-Output ("disabled_home=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/"))
Write-Output ("disabled_index=" + (curl.exe -s -o NUL -w "%{http_code}" "https://instagram-recover.com/index.html"))
$body = curl.exe -s "https://instagram-recover.com/index.html"
Write-Output ("index_body_has_TEST=" + ($body -match "DOCROOT_INDEX_TEST"))

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 5
Write-Output "=== after enable ==="
foreach ($p in "/","/about","/robots.txt","/sitemap.xml","/_next/static/chunks/1uo6c5a4x1rlr.css") {
  $tmp = Join-Path $env:TEMP "t.bin"
  $code = curl.exe -s -o $tmp -w "%{http_code}" "https://instagram-recover.com$p"
  $len = (Get-Item $tmp).Length
  Write-Output "$p -> $code $len"
}
$robots = curl.exe -s "https://instagram-recover.com/robots.txt"
Write-Output ("robots_ok=" + ($robots.StartsWith("User-Agent") -or $robots.StartsWith("User-agent")))
$about = curl.exe -s "https://instagram-recover.com/about"
# check without arabic encoding issues - look for /about canonical or unique string
Write-Output ("about_canonical=" + ($about -match "canonical.*about"))
Write-Output ("about_size_diff_from_home=" + ($about.Length -ne (curl.exe -s "https://instagram-recover.com/").Length))
