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
$pub = "/home/$user/public_html"
$app = "/home/$user/instagram-recovery"

$htaccess = @"
# Route all traffic to the Node/Passenger app (document root stays public_html).
PassengerEnabled On
PassengerAppRoot $app
PassengerAppType node
PassengerStartupFile server.js
PassengerNodejs /usr/bin/node

# Avoid directory-listing 403 that rewrites every URL to /403.shtml.
Options -Indexes
DirectoryIndex disabled

RewriteEngine On
RewriteCond %{REQUEST_URI} !^/403\.shtml$
RewriteRule ^(.*)$ - [E=PASSENGER_APPLICATION:1]
"@

# Also fix server.js: decode passenger-envvars for REDIRECT_URL if present; keep /403.shtml -> / fallback only for /
$serverJsPath = Join-Path $PSScriptRoot "..\server.js"
# Deploy stable server.js with 403 workaround + envvars decode for original URI

$serverContent = @'
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

function decodePassengerEnv(header) {
  if (!header) return {};
  try {
    const text = Buffer.from(String(header), "base64").toString("utf8");
    const parts = text.split("\0");
    const out = {};
    for (let i = 0; i + 1 < parts.length; i += 2) {
      if (parts[i]) out[parts[i]] = parts[i + 1];
    }
    return out;
  } catch (_) {
    return {};
  }
}

function resolveUrl(req) {
  const raw = req.url || "/";
  const pathOnly = raw.split("?")[0];
  if (pathOnly !== "/403.shtml" && pathOnly !== "/404.shtml") return raw;

  const env = decodePassengerEnv(req.headers["!~passenger-envvars"]);
  const candidates = [
    env.REDIRECT_URL,
    env.REDIRECT_SCRIPT_URL,
    env.REQUEST_URI,
    env.REDIRECT_REQUEST_URI,
    req.headers["x-original-uri"],
    req.headers["x-rewrite-url"],
  ].filter(Boolean);

  for (const c of candidates) {
    try {
      const s = String(c);
      if (s.startsWith("http")) {
        const u = new URL(s);
        if (u.pathname && u.pathname !== "/403.shtml" && u.pathname !== "/404.shtml") {
          return u.pathname + u.search;
        }
      } else if (s.startsWith("/") && s !== "/403.shtml" && s !== "/404.shtml") {
        return s;
      }
    } catch (_) {}
  }
  // Last resort: serve homepage rather than Next 404 for the error document.
  return "/";
}

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const url = resolveUrl(req);
    req.url = url;
    handle(req, res, parse(url, true));
  });
  if (typeof PhusionPassenger !== "undefined") {
    server.listen("passenger");
  } else {
    server.listen(port);
  }
});
'@

function Save-File([string]$dir, [string]$file, [string]$content) {
  $body = "dir={0}&file={1}&content={2}" -f `
    [uri]::EscapeDataString($dir), `
    [uri]::EscapeDataString($file), `
    [uri]::EscapeDataString($content)
  $bodyFile = Join-Path $env:TEMP "cpanel-body-$file.txt"
  [IO.File]::WriteAllText($bodyFile, $body)
  return curl.exe -s -c $cookieJar -b $cookieJar -X POST `
    -H "Content-Type: application/x-www-form-urlencoded" `
    --data-binary "@$bodyFile" `
    "$base$tok/execute/Fileman/save_file_content"
}

Write-Output "SAVE_HTACCESS=$(Save-File $pub '.htaccess' $htaccess)"
Write-Output "SAVE_SERVER=$(Save-File $app 'server.js' $serverContent)"

# Also write local server.js to match
[IO.File]::WriteAllText((Join-Path $PSScriptRoot "..\server.js"), $serverContent)

curl.exe -s -c $cookieJar -b $cookieJar -X POST --data-urlencode "dir=$app/tmp" --data-urlencode "file=restart.txt" --data-urlencode "content=htaccess-$(Get-Date -Format o)" "$base$tok/execute/Fileman/save_file_content" | Out-Null
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/disable_application?name=instagram-recovery" | Out-Null
Start-Sleep 2
curl.exe -s -c $cookieJar -b $cookieJar "$base$tok/execute/PassengerApps/enable_application?name=instagram-recovery" | Out-Null
Start-Sleep 8

Write-Output "=== live checks ==="
foreach ($p in "/","/about","/robots.txt","/sitemap.xml","/services","/_next/static/chunks/1uo6c5a4x1rlr.css") {
  $tmp = Join-Path $env:TEMP "ir-check.bin"
  $code = curl.exe -s -o $tmp -w "%{http_code}" "https://instagram-recover.com$p"
  $len = (Get-Item $tmp).Length
  Write-Output "$p -> $code $len"
}
$about = curl.exe -s "https://instagram-recover.com/about"
Write-Output ("about_has_title=" + ($about -match "من نحن|عن"))
$robots = curl.exe -s "https://instagram-recover.com/robots.txt"
Write-Output ("robots_head=" + ($robots.Substring(0, [Math]::Min(80, $robots.Length))))
