$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.hosting"
$vars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { $vars[$Matches[1].Trim()] = $Matches[2].Trim().Trim('"') }
}
$base = "http://www.instagram-recover.com:2082"
$user = $vars["HOST_USERNAME"]
$pass = $vars["HOST_PASSWORD"]
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$login = Invoke-RestMethod -Uri "$base/login/?login_only=1" -Method POST -Body @{ user = $user; pass = $pass } -WebSession $session
$tok = $login.security_token
Write-Output "token_prefix=$($tok.Substring(0,[Math]::Min(20,$tok.Length)))"

function Raw([string]$path) {
  $resp = Invoke-WebRequest -Uri "$base$tok$path" -WebSession $session -TimeoutSec 60
  Write-Output "==== $path status=$($resp.StatusCode) len=$($resp.RawContentLength)"
  $text = $resp.Content
  if ($text.Length -gt 1500) { Write-Output ($text.Substring(0,1500) + "...TRUNC") } else { Write-Output $text }
}

Raw "/execute/Fileman/list_files?dir=/home/$user&include_mime=0&show_hidden=1"
Raw "/execute/DomainInfo/list_domains"
Raw "/execute/VersionControl/list"
Raw "/execute/Mysql/list_databases"
