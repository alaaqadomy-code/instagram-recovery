# Diagnose / rebuild Next.js on sunyhost via cPanel UAPI.
# Credentials: projects/instagram-recovery/.env.hosting (never printed).
$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = $vars["HOST_PANEL_URL"].TrimEnd("/")
$user = $vars["HOST_USERNAME"]
$pass = $vars["HOST_PASSWORD"]
$appHome = "/home/$user/instagram-recovery"
$action = if ($args[0]) { $args[0] } else { "diagnose" }

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$login = Invoke-RestMethod -Uri "$base/login/?login_only=1" -Method POST -Body @{ user = $user; pass = $pass } -WebSession $session
if (-not $login.security_token) {
  Write-Output "LOGIN_FAIL status=$($login.status) message=$($login.message)"
  exit 1
}
$tok = $login.security_token
Write-Output "LOGIN_OK"

function Invoke-Uapi([string]$mod, [string]$fn, [hashtable]$params) {
  $q = ($params.GetEnumerator() | ForEach-Object {
    "{0}={1}" -f [uri]::EscapeDataString($_.Key), [uri]::EscapeDataString([string]$_.Value)
  }) -join "&"
  return Invoke-RestMethod -Uri "$base$tok/execute/$mod/$fn?$q" -WebSession $session -TimeoutSec 600
}

function Invoke-UapiPost([string]$mod, [string]$fn, [hashtable]$params) {
  return Invoke-RestMethod -Uri "$base$tok/execute/$mod/$fn" -Method POST -Body $params -WebSession $session -TimeoutSec 600
}

$list = Invoke-Uapi "Fileman" "list_files" @{ dir = "$appHome/.next"; include_mime = "0"; show_hidden = "1" }
if ($list.status -eq 0 -and $list.errors) {
  Write-Output "LIST_NEXT_ERR=$($list.errors | ConvertTo-Json -Compress)"
} else {
  $names = @($list.data | ForEach-Object { $_.file })
  Write-Output "NEXT_COUNT=$($names.Count) BUILD_ID=$($names -contains 'BUILD_ID') static=$($names -contains 'static') server=$($names -contains 'server')"
  Write-Output ("NEXT_TOP=" + (($names | Select-Object -First 20) -join ","))
}

$static = Invoke-Uapi "Fileman" "list_files" @{ dir = "$appHome/.next/static"; include_mime = "0"; show_hidden = "1" }
if ($static.data) {
  Write-Output ("STATIC_TOP=" + (($static.data | ForEach-Object { $_.file } | Select-Object -First 15) -join ","))
} else {
  Write-Output "STATIC_ERR=$($static.errors | ConvertTo-Json -Compress)"
}

if ($action -eq "diagnose") {
  Write-Output "DIAGNOSE_DONE"
  exit 0
}

$cmd = @"
cd $appHome && export NEXT_PUBLIC_SITE_URL=https://instagram-recover.com NEXT_PUBLIC_EMAIL=hello@instagram-recover.com NEXT_PUBLIC_WHATSAPP=962795827790 && export PATH=/opt/cpanel/ea-nodejs22/bin:/opt/cpanel/ea-nodejs20/bin:/opt/alt/alt-nodejs22/root/usr/bin:/usr/local/bin:`$PATH && npm run build && mkdir -p tmp && touch tmp/restart.txt && echo BUILD_OK && cat .next/BUILD_ID && ls .next/static | head
"@

Write-Output "REBUILD_START"
$ok = $false
foreach ($attempt in @(
  { Invoke-UapiPost "Shell" "exec" @{ command = $cmd } },
  { Invoke-Uapi "Shell" "exec" @{ command = $cmd } }
)) {
  try {
    $out = & $attempt
    Write-Output ("SHELL=" + ($out | ConvertTo-Json -Depth 6 -Compress))
    $ok = $true
    break
  } catch {
    Write-Output "SHELL_FAIL=$($_.Exception.Message)"
  }
}

if (-not $ok) {
  # Touch restart.txt via file write as last resort
  $content = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Date).ToString("o")))
  try {
    $w = Invoke-UapiPost "Fileman" "save_file_content" @{
      dir = "$appHome/tmp"
      file = "restart.txt"
      content = $content
    }
    Write-Output ("TOUCH_RESTART=" + ($w | ConvertTo-Json -Compress))
  } catch {
    Write-Output "TOUCH_FAIL=$($_.Exception.Message)"
  }
}

Write-Output "REBUILD_DONE"
