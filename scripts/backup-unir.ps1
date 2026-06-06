#Requires -Version 5.1
<#
.SYNOPSIS
    Copia de seguridad de carpetas académicas importantes.
    Crea un ZIP con fecha/hora en la carpeta de destino.

.DESCRIPTION
    Hace un ZIP comprimido de cada carpeta fuente indicada y lo guarda en
    BackupDestination. El nombre del archivo incluye la fecha para poder
    conservar versiones históricas.

    Diseñado para ejecutarse manualmente o en el Programador de tareas de
    Windows una vez por semana.

.PARAMETER BackupDestination
    Carpeta donde se guardan los ZIPs. Debe existir o se creará.
    Por defecto: D:\Backups\UNIR  (ajusta a tu disco externo o carpeta de OneDrive)

.PARAMETER SourceFolders
    Array de rutas absolutas que se van a respaldar.

.PARAMETER MaxBackupsPerSource
    Cuántas versiones históricas conservar por cada carpeta.
    Las más antiguas se eliminan automáticamente. Por defecto: 5.

.EXAMPLE
    .\backup-unir.ps1
    .\backup-unir.ps1 -BackupDestination "D:\Backups\UNIR"
#>

param(
    [string]$BackupDestination = "$env:USERPROFILE\OneDrive\Backups\UNIR",

    [string[]]$SourceFolders = @(
        "C:\Users\carlo\Desktop\UNIR\2do Cuatrimestre",
        "C:\Users\carlo\Desktop\UNIR\studyhub_clean"
        # Añade aquí más carpetas si las recuperas:
        # "C:\Users\carlo\Desktop\UNIR\TFG",
        # "C:\Users\carlo\Desktop\UNIR\1er Cuatrimestre"
    ),

    [int]$MaxBackupsPerSource = 5
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Step { param($msg) Write-Host "`n[>] $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    [!]  $msg" -ForegroundColor Yellow }
function Write-Fail { param($msg) Write-Host "    [!!] $msg" -ForegroundColor Red; exit 1 }

# ─────────────────────────────────────────────
# Crear carpeta de destino si no existe
# ─────────────────────────────────────────────
Write-Step "Preparando destino de backup: $BackupDestination"

if (-not (Test-Path $BackupDestination)) {
    New-Item -ItemType Directory -Path $BackupDestination -Force | Out-Null
    Write-Ok "Carpeta creada: $BackupDestination"
} else {
    Write-Ok "Carpeta ya existe: $BackupDestination"
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$results   = @()

# ─────────────────────────────────────────────
# Hacer ZIP de cada carpeta fuente
# ─────────────────────────────────────────────
foreach ($source in $SourceFolders) {
    Write-Step "Procesando: $source"

    if (-not (Test-Path $source -PathType Container)) {
        Write-Warn "La carpeta '$source' no existe, se omite."
        $results += [PSCustomObject]@{ Fuente = $source; Estado = "OMITIDA (no existe)" }
        continue
    }

    # Nombre seguro para el archivo ZIP (sin caracteres especiales)
    $safeName = (Split-Path $source -Leaf) -replace '[^\w\-]', '_'
    $zipName  = "${safeName}_${timestamp}.zip"
    $zipPath  = Join-Path $BackupDestination $zipName

    try {
        Compress-Archive -Path $source -DestinationPath $zipPath -CompressionLevel Optimal
        $sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
        Write-Ok "ZIP creado: $zipName ($sizeMB MB)"
        $results += [PSCustomObject]@{ Fuente = $source; Estado = "OK — $zipName ($sizeMB MB)" }
    } catch {
        Write-Warn "Error al comprimir '$source': $_"
        $results += [PSCustomObject]@{ Fuente = $source; Estado = "ERROR: $_" }
        continue
    }

    # ─────────────────────────────────────────
    # Rotación: eliminar backups antiguos
    # ─────────────────────────────────────────
    $oldBackups = Get-ChildItem $BackupDestination -Filter "${safeName}_*.zip" |
                  Sort-Object LastWriteTime -Descending |
                  Select-Object -Skip $MaxBackupsPerSource

    foreach ($old in $oldBackups) {
        Remove-Item $old.FullName -Force
        Write-Warn "Backup antiguo eliminado: $($old.Name)"
    }
}

# ─────────────────────────────────────────────
# Resumen final
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host "  RESUMEN DEL BACKUP — $timestamp" -ForegroundColor Magenta
Write-Host "=========================================================" -ForegroundColor Magenta
$results | Format-Table -AutoSize
Write-Host "Backups guardados en: $BackupDestination" -ForegroundColor Green
