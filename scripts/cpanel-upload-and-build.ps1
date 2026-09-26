$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$cookieJar = Join-Path $env:TEMP "cpanel-up-ck.txt"
Remove-Item $cookieJar -ErrorAction SilentlyContinue
$login = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
  --data-urlencode "user=$($vars.HOST_USERNAME)" `
  --data-urlencode "pass=$($vars.HOST_PASSWORD)" `
  "$base/login/?login_only=1"
$tok = ($login | ConvertFrom-Json).security_token
$user = $vars.HOST_USERNAME
$app = "/home/$user/public_html"

function Save-Remote([string]$remoteDir, [string]$remoteFile, [string]$localPath) {
  $content = [IO.File]::ReadAllText($localPath)
  $body = "dir={0}&file={1}&content={2}" -f `
    [uri]::EscapeDataString($remoteDir), `
    [uri]::EscapeDataString($remoteFile), `
    [uri]::EscapeDataString($content)
  $bf = Join-Path $env:TEMP ("up-" + ($remoteFile -replace '[\\/\[\] ]', '_'))
  [IO.File]::WriteAllText($bf, $body)
  $r = curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    -H "Content-Type: application/x-www-form-urlencoded" `
    --data-binary "@$bf" `
    "$base$tok/execute/Fileman/save_file_content"
  $ok = $r -match '"status":1'
  Write-Output ("UPLOAD {0}/{1} ok={2}" -f $remoteDir.Replace($app, ''), $remoteFile, $ok)
  if (-not $ok) { Write-Output $r.Substring(0, [Math]::Min(300, $r.Length)) }
}

$files = @(
  @{ local = "next.config.ts"; dir = $app; file = "next.config.ts" },
  @{ local = ".cpanel.yml"; dir = $app; file = ".cpanel.yml" },
  @{ local = "README.md"; dir = $app; file = "README.md" },
  @{ local = ".env.example"; dir = $app; file = ".env.example" },
  @{ local = "app/globals.css"; dir = "$app/app"; file = "globals.css" },
  @{ local = "app/articles/[slug]/page.tsx"; dir = "$app/app/articles/[slug]"; file = "page.tsx" },
  @{ local = "components/Cta.tsx"; dir = "$app/components"; file = "Cta.tsx" },
  @{ local = "components/Footer.tsx"; dir = "$app/components"; file = "Footer.tsx" },
  @{ local = "components/Header.tsx"; dir = "$app/components"; file = "Header.tsx" },
  @{ local = "components/JsonLd.tsx"; dir = "$app/components"; file = "JsonLd.tsx" },
  @{ local = "components/WhatsAppFloat.tsx"; dir = "$app/components"; file = "WhatsAppFloat.tsx" },
  @{ local = "lib/articles/types.ts"; dir = "$app/lib/articles"; file = "types.ts" },
  @{ local = "lib/site.ts"; dir = "$app/lib"; file = "site.ts" },
  @{ local = "scripts/server.deploy-build.js"; dir = $app; file = "server.js" }
)

foreach ($f in $files) {
  Save-Remote $f.dir $f.file (Join-Path $root $f.local)
}

$body = "dir={0}&file={1}&content={2}" -f [uri]::EscapeDataString("$app/tmp"), [uri]::EscapeDataString("needs-build"), [uri]::EscapeDataString((Get-Date).ToString("o"))
$bf = Join-Path $env:TEMP "needs-build-body.txt"; [IO.File]::WriteAllText($bf, $body)
curl.exe -s -c $cookieJar -b $cookieJar -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary "@$bf" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=deploy-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null

curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Write-Output "Passenger recycled; first request will run npm run build (up to ~10 min)..."
Start-Sleep 5

$code = curl.exe -s -o (Join-Path $env:TEMP "trigger-out.html") -w "%{http_code}" --max-time 700 "https://instagram-recover.com/"
Write-Output "TRIGGER_HOME=$code"

$flag = curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/Fileman/get_file_content?dir=$app/tmp&file=needs-build"
Write-Output ("needs-build_still_present=" + ($flag -match '"status":1' -and $flag -notmatch '"errors":\['))

# Verify after recycle again (build may have completed)
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

$hdr = curl.exe -s -D - -o NUL -H "Cookie: ir_orig_path=/" "https://instagram-recover.com/" 
Write-Output "=== response headers (home) ==="
($hdr -split "`n" | Select-String -Pattern "HTTP/|strict-transport|Strict-Transport|x-powered|content-type" | ForEach-Object { $_.Line.Trim() })

$article = curl.exe -s -H "Cookie: ir_orig_path=/articles/istirja-hisab-instagram-muattal" "https://instagram-recover.com/articles/istirja-hisab-instagram-muattal"
Write-Output ("article_og=" + [regex]::Match($article, 'property="og:image"[^>]*content="[^"]+"|content="[^"]+"[^>]*property="og:image"').Value)
Write-Output ("article_og_simple=" + [regex]::Match($article, 'og:image" content="([^"]+)"').Groups[1].Value)
Write-Output ("article_twitter=" + ($article -match 'name="twitter:image"'))
Write-Output ("wa_075E54=" + ($article -match '#075E54'))
$about = curl.exe -s -H "Cookie: ir_orig_path=/about" "https://instagram-recover.com/about"
Write-Output ("about_canon=" + [regex]::Match($about, 'rel="canonical" href="([^"]+)"').Groups[1].Value)
Write-Output ("about_size=" + $about.Length)
