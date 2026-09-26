$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-fix-deploy-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

function Save-Remote([string]$remoteDir, [string]$remoteFile, [string]$content) {
  $body = "dir={0}&file={1}&content={2}" -f `
    [uri]::EscapeDataString($remoteDir), `
    [uri]::EscapeDataString($remoteFile), `
    [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP ("fix-" + ($remoteFile -replace '[\\/\[\] ]', '_'))
  [IO.File]::WriteAllText($bf, $body)
  $r = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    -H "Content-Type: application/x-www-form-urlencoded" `
    --data-binary "@$bf" `
    "$base$tok/execute/Fileman/save_file_content"
  $ok = $r -match '"status":1'
  Write-Output ("SAVE {0}/{1} ok={2}" -f $remoteDir.Replace($app, ''), $remoteFile, $ok)
  if (-not $ok) { Write-Output $r.Substring(0, [Math]::Min(400, $r.Length)) }
}

function Del-Remote([string]$dir, [string]$file) {
  $r = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    --data-urlencode "dir=$dir" `
    --data-urlencode "file=$file" `
    "$base$tok/execute/Fileman/trash"
  Write-Output ("TRASH $dir/$file -> " + ($r -match '"status":1'))
}

# 1) Stop build-on-boot loop
Del-Remote "$app/tmp" "needs-build"
Del-Remote "$app/.next" "lock"

# 2) Restore clean server.js (cookie workaround, no sync build)
$serverJs = [IO.File]::ReadAllText((Join-Path $root "server.js"))
Save-Remote $app "server.js" $serverJs

# 3) Queue marker
Save-Remote "/home/$user" "build-status.txt" ("ensure_deps queued " + (Get-Date).ToString("o") + "`n")

# 4) Passenger recycle so broken process dies
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Write-Output "Passenger recycled"

# 5) ensure_deps = npm install (+ postinstall next build). Long timeout.
Write-Output "=== ensure_deps start (up to 15 min) ==="
$r = curl.exe -s -c $cookieJar -b $cookieJar -X POST --max-time 900 `
  --data-urlencode "name=instagram-recovery" `
  --data-urlencode "type=nodejs" `
  --data-urlencode "app_path=$app" `
  "$base$tok/execute/PassengerApps/ensure_deps"
Write-Output $r.Substring(0, [Math]::Min(2000, $r.Length))

Write-Output "=== build-status ==="
$bs = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user&file=build-status.txt"
Write-Output $bs.Substring(0, [Math]::Min(2500, $bs.Length))

Write-Output "=== BUILD_ID ==="
$bid = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"
Write-Output $bid.Substring(0, [Math]::Min(500, $bid.Length))

# 6) Restart again after build
curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "dir=$app/tmp" `
  --data-urlencode "file=restart.txt" `
  --data-urlencode "content=after-ensure-$(Get-Date -Format o)" `
  "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

Write-Output "=== live verify ==="
$code = curl.exe -s -o (Join-Path $env:TEMP "live-home.html") -w "%{http_code}" --max-time 45 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
Write-Output "HOME=$code size=$((Get-Item (Join-Path $env:TEMP 'live-home.html')).Length)"
$article = curl.exe -s --max-time 45 -H "Cookie: ir_orig_path=/articles/istirja-hisab-instagram-muattal" "https://instagram-recover.com/articles/istirja-hisab-instagram-muattal"
Write-Output ("article_len=" + $article.Length)
Write-Output ("article_og=" + [regex]::Match($article, 'og:image" content="([^"]+)"').Groups[1].Value)
Write-Output ("wa_075E54=" + ($article -match '#075E54'))
$hdr = curl.exe -s -D - -o NUL --max-time 30 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
($hdr -split "`n" | Select-String -Pattern "HTTP/|strict-transport|Strict-Transport|x-powered" | ForEach-Object { $_.Line.Trim() })
