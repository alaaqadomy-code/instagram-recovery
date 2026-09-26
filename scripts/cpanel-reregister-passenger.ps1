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
  $a = @("-s","-c",$cookieJar,"-b",$cookieJar,"-X","POST","--max-time","180")
  foreach ($k in $f.Keys) { $a += @("--data-urlencode", "$k=$($f[$k])") }
  $a += "$base$tok$path"; & curl.exe @a
}

Write-Output "=== unregister ==="
$u = UP "/execute/PassengerApps/unregister_application" @{ name = "instagram-recovery" }
Write-Output $u

Start-Sleep 2
Write-Output "=== register ==="
$r = UP "/execute/PassengerApps/register_application" @{
  name = "instagram-recovery"
  path = $app
  domain = "instagram-recover.com"
  base_uri = "/"
  deployment_mode = "production"
  nodejs = "/usr/bin/node"
}
Write-Output $r

Start-Sleep 2
Write-Output "=== enable ==="
Write-Output (UP "/execute/PassengerApps/enable_application" @{ name = "instagram-recovery" })

Start-Sleep 8
Write-Output "=== list ==="
Write-Output (curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/list_applications")

Write-Output "=== live ==="
foreach ($p in "/","/about","/robots.txt","/sitemap.xml","/_next/static/chunks/1uo6c5a4x1rlr.css") {
  $tmp = Join-Path $env:TEMP "t.bin"
  $code = curl.exe -s -o $tmp -w "%{http_code}" "https://instagram-recover.com$p"
  $len = (Get-Item $tmp).Length
  Write-Output "$p -> $code bytes=$len"
}
$robots = curl.exe -s "https://instagram-recover.com/robots.txt"
Write-Output "ROBOTS_START=$($robots.Substring(0,[Math]::Min(60,$robots.Length)))"
$about = curl.exe -s "https://instagram-recover.com/about"
Write-Output ("ABOUT_CANON=" + [regex]::Match($about, 'rel="canonical" href="[^"]+"').Value)
$HOME_CANON = [regex]::Match((curl.exe -s "https://instagram-recover.com/"), 'rel="canonical" href="[^"]+"').Value
Write-Output "HOME_CANON=$HOME_CANON"
