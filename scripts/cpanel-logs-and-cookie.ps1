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

# Ensure passenger enabled + deploy cookie fix for browsers for now
$app = "/home/$user/public_html"
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null

# Read error logs (uncompressed if any)
$logs = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/list_files?dir=/home/$user/logs&include_mime=0&show_hidden=1" | ConvertFrom-Json
@($logs.data) | ForEach-Object { Write-Output ("{0} {1} {2}" -f $_.type, $_.size, $_.file) }

# Try latest error via get_file_content on non-gz
foreach ($f in @("instagram-recover.com-ssl_log","instagram-recover.com","error_log","stderr.log")) {
  $o = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user/logs&file=$f"
  if ($o -match '"status":1') {
    Write-Output "==== $f"
    $j = $o | ConvertFrom-Json
    $c = $j.data.content
    Write-Output $c.Substring([Math]::Max(0, $c.Length - 1500))
  }
}

# Deploy cookie-based server (browser fix) while we report host issue
$src = Join-Path $PSScriptRoot "..\server.js"
$content = Get-Content -Raw $src
$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString($app), [uri]::EscapeDataString("server.js"), [uri]::EscapeDataString($content)
$bf = Join-Path $env:TEMP "srv.txt"; [IO.File]::WriteAllText($bf, $body)
curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=x" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 6

# Manual cookie simulation (as browser JS would)
$cj = Join-Path $env:TEMP "br.txt"; Remove-Item $cj -EA SilentlyContinue
curl.exe -s -c $cj -b $cj "https://instagram-recover.com/about" | Out-Null
# Inject cookie like the bootstrap JS would
curl.exe -s -c $cj -b "ir_orig_path=/about" -w "about2=%{http_code}:%{size_download}:%{content_type}`n" -o (Join-Path $env:TEMP "about2.html") "https://instagram-recover.com/about"
$about = Get-Content -Raw (Join-Path $env:TEMP "about2.html")
Write-Output ("about_canon=" + [regex]::Match($about, 'rel="canonical" href="[^"]+"').Value)

curl.exe -s -c $cj -b "ir_orig_path=/robots.txt" -o (Join-Path $env:TEMP "robots2.txt") -w "robots=%{http_code}:%{content_type}:%{size_download}`n" "https://instagram-recover.com/robots.txt"
Write-Output ((Get-Content -Raw (Join-Path $env:TEMP "robots2.txt")).Substring(0, [Math]::Min(100, 500)))
