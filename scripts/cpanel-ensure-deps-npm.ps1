$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-npm-build-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

# Clear build-status
$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString("/home/$user"), [uri]::EscapeDataString("build-status.txt"), [uri]::EscapeDataString(("npm ensure_deps " + (Get-Date).ToString("o") + "`n"))
$bf = Join-Path $env:TEMP "bs-body.txt"; [IO.File]::WriteAllText($bf, $body)
curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content" | Out-Null

Write-Output "=== 500 body snippet ==="
$errPage = Join-Path $env:TEMP "err500.html"
curl.exe -s --max-time 30 -o $errPage "https://instagram-recover.com/"
Get-Content $errPage -TotalCount 60

Write-Output ""
Write-Output "=== ensure_deps type=npm (up to 15 min) ==="
$r = curl.exe -s -c $cookieJar -b $cookieJar -X POST --max-time 900 `
  --data-urlencode "name=instagram-recovery" `
  --data-urlencode "type=npm" `
  --data-urlencode "app_path=$app" `
  "$base$tok/execute/PassengerApps/ensure_deps"
Write-Output $r.Substring(0, [Math]::Min(3000, $r.Length))

Write-Output ""
Write-Output "=== build-status after ==="
$bs = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=/home/$user&file=build-status.txt"
Write-Output $bs.Substring(0, [Math]::Min(4000, $bs.Length))

Write-Output ""
Write-Output "=== BUILD_ID ==="
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/.next&file=BUILD_ID"

# restart
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=post-npm-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 3
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 10

Write-Output ""
Write-Output "=== live ==="
$code = curl.exe -s -o (Join-Path $env:TEMP "live2.html") -w "%{http_code}" --max-time 45 -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/"
Write-Output "HOME=$code size=$((Get-Item (Join-Path $env:TEMP 'live2.html')).Length)"
$article = curl.exe -s --max-time 45 -H "Cookie: ir_orig_path=/articles/istirja-hisab-instagram-muattal" "https://instagram-recover.com/articles/istirja-hisab-instagram-muattal"
Write-Output ("article_len=" + $article.Length)
Write-Output ("og=" + [regex]::Match($article, 'og:image" content="([^"]+)"').Groups[1].Value)
Write-Output ("wa=" + ($article -match '#075E54'))
