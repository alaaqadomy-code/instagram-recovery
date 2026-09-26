# Trigger cPanel Git deploy / pull for instagram-recovery.
$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
# Prefer HTTPS panel when available
$baseCandidates = @(
  ($vars["HOST_PANEL_URL_DOMAIN"] | ForEach-Object { if ($_) { $_.TrimEnd('/') } }),
  ($vars["HOST_PANEL_URL"].TrimEnd('/') -replace '^http://','https://' -replace ':2082',':2083'),
  $vars["HOST_PANEL_URL"].TrimEnd('/')
) | Where-Object { $_ } | Select-Object -Unique

$user = $vars["HOST_USERNAME"]
$pass = $vars["HOST_PASSWORD"]
$appHome = "/home/$user/instagram-recovery"

$session = $null
$tok = $null
$base = $null
foreach ($b in $baseCandidates) {
  try {
    $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $login = Invoke-RestMethod -Uri "$b/login/?login_only=1" -Method POST -Body @{ user = $user; pass = $pass } -WebSession $s -TimeoutSec 30
    if ($login.security_token) {
      $session = $s; $tok = $login.security_token; $base = $b
      Write-Output "LOGIN_OK base=$b"
      break
    }
    Write-Output "LOGIN_NO_TOKEN base=$b status=$($login.status)"
  } catch {
    Write-Output "LOGIN_ERR base=$b err=$($_.Exception.Message)"
  }
}
if (-not $tok) { exit 1 }

function Invoke-Uapi([string]$mod, [string]$fn, [hashtable]$params, [string]$method = "GET") {
  if ($method -eq "POST") {
    return Invoke-RestMethod -Uri "$base$tok/execute/$mod/$fn" -Method POST -Body $params -WebSession $session -TimeoutSec 900
  }
  $q = ($params.GetEnumerator() | ForEach-Object {
    "{0}={1}" -f [uri]::EscapeDataString($_.Key), [uri]::EscapeDataString([string]$_.Value)
  }) -join "&"
  return Invoke-RestMethod -Uri "$base$tok/execute/$mod/$fn?$q" -WebSession $session -TimeoutSec 900
}

# Dump .next listing raw fields
$next = Invoke-Uapi Fileman list_files @{ dir = "$appHome/.next"; include_mime = "0"; show_hidden = "1" }
Write-Output ("NEXT_RAW_COUNT=" + @($next.data).Count)
@($next.data) | ForEach-Object {
  Write-Output ("ENTRY type=$($_.type) file=$($_.file) size=$($_.size) mtime=$($_.mtime) humanname=$($_.humanname)")
}

$root = Invoke-Uapi Fileman list_files @{ dir = $appHome; include_mime = "0"; show_hidden = "1" }
Write-Output "ROOT_FILES:"
@($root.data) | ForEach-Object { Write-Output ("  $($_.type) $($_.file) $($_.size)") }

# List VersionControl repos
foreach ($modFn in @(
  @{ m = "VersionControl"; f = "list"; p = @{} },
  @{ m = "VersionControlDeployment"; f = "list"; p = @{} },
  @{ m = "VersionControl"; f = "retrieve"; p = @{ repository_root = $appHome } }
)) {
  try {
    $r = Invoke-Uapi $modFn.m $modFn.f $modFn.p
    Write-Output ("API $($modFn.m)::$($modFn.f) status=$($r.status) errors=$($r.errors | ConvertTo-Json -Compress)")
    if ($r.data) { Write-Output ("DATA=" + ($r.data | ConvertTo-Json -Depth 5 -Compress).Substring(0, [Math]::Min(2000, (($r.data | ConvertTo-Json -Depth 5 -Compress).Length)))) }
  } catch {
    Write-Output "API_FAIL $($modFn.m)::$($modFn.f) $($_.Exception.Message)"
  }
}
