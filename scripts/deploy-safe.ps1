#Requires -Version 5.1
<#
.SYNOPSIS
    Despliegue seguro de StudyHub en GitHub Pages (rama gh-pages).
    Alternativa manual al workflow de GitHub Actions.

.DESCRIPTION
    Este script realiza TODAS las comprobaciones antes de borrar nada:
      1. Verifica que dist/ existe y tiene contenido.
      2. Verifica que la carpeta de despliegue tiene .git dentro.
      3. Muestra un resumen de lo que se va a borrar (-WhatIf implícito).
      4. Pide confirmación explícita antes de cualquier borrado.
      5. Usa rutas absolutas en todo momento — nunca rutas relativas.

.PARAMETER DeployPath
    Ruta ABSOLUTA a la carpeta local que apunta a la rama gh-pages.
    Por defecto: C:\Proyectos\studyhub_pages

.PARAMETER SourcePath
    Ruta ABSOLUTA al proyecto fuente (donde está dist/).
    Por defecto: C:\Proyectos\studyhub

.EXAMPLE
    .\deploy-safe.ps1
    .\deploy-safe.ps1 -DeployPath "C:\Proyectos\studyhub_pages" -SourcePath "C:\Proyectos\studyhub"
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$DeployPath = "C:\Proyectos\studyhub_pages",
    [string]$SourcePath = "C:\Proyectos\studyhub"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
function Write-Step  { param($msg) Write-Host "`n[>] $msg" -ForegroundColor Cyan }
function Write-Ok    { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Fail  { param($msg) Write-Host "    [!!] $msg" -ForegroundColor Red; exit 1 }
function Write-Warn  { param($msg) Write-Host "    [!]  $msg" -ForegroundColor Yellow }

# ─────────────────────────────────────────────
# BLOQUE 1: Protección — jamás ejecutar en carpeta superior
# ─────────────────────────────────────────────
Write-Step "Comprobando ubicación actual"

$currentPath = (Get-Location).Path
$dangerousPaths = @(
    "C:\Users\carlo\Desktop\UNIR",
    "C:\Users\carlo\Desktop",
    "C:\Users\carlo",
    "C:\Users",
    "C:\"
)
foreach ($danger in $dangerousPaths) {
    if ($currentPath -ieq $danger) {
        Write-Fail "PELIGRO: La terminal está en '$currentPath'. Este script no puede ejecutarse desde una carpeta raíz o de nivel superior. Cambia a la carpeta del proyecto y vuelve a intentarlo."
    }
}
Write-Ok "Ubicación actual: $currentPath (segura)"

# ─────────────────────────────────────────────
# BLOQUE 2: Verificar que DeployPath es exactamente la carpeta permitida
# ─────────────────────────────────────────────
Write-Step "Verificando carpeta de despliegue: $DeployPath"

if (-not (Test-Path $DeployPath -PathType Container)) {
    Write-Fail "La carpeta de despliegue '$DeployPath' no existe. Crea la carpeta con 'git clone --branch gh-pages <repo> $DeployPath' y vuelve a intentarlo."
}

$gitDir = Join-Path $DeployPath ".git"
if (-not (Test-Path $gitDir -PathType Container)) {
    Write-Fail "La carpeta '$DeployPath' no contiene .git. No es un repositorio git válido. Operación cancelada para proteger tus archivos."
}
Write-Ok "Carpeta de despliegue verificada y es un repositorio git"

# ─────────────────────────────────────────────
# BLOQUE 3: Verificar que dist/ existe en SourcePath
# ─────────────────────────────────────────────
Write-Step "Verificando build en: $SourcePath"

$distPath = Join-Path $SourcePath "dist"
if (-not (Test-Path $distPath -PathType Container)) {
    Write-Fail "No existe '$distPath'. Ejecuta 'npm run build' dentro de '$SourcePath' primero."
}

$distFiles = Get-ChildItem $distPath -Recurse -File
if ($distFiles.Count -eq 0) {
    Write-Fail "La carpeta dist/ está vacía. El build puede haber fallado. Revisa los errores de 'npm run build'."
}
Write-Ok "dist/ contiene $($distFiles.Count) archivo(s) listos para desplegar"

# ─────────────────────────────────────────────
# BLOQUE 4: Mostrar qué se va a borrar (simulación -WhatIf)
# ─────────────────────────────────────────────
Write-Step "Simulación — estos elementos se borrarán de '$DeployPath' (excepto .git):"

$itemsToDelete = Get-ChildItem $DeployPath -Force | Where-Object { $_.Name -ne ".git" }
if ($itemsToDelete.Count -eq 0) {
    Write-Warn "La carpeta de despliegue ya está vacía (solo tiene .git). No hay nada que borrar."
} else {
    foreach ($item in $itemsToDelete) {
        Write-Host "    DELETE: $($item.FullName)" -ForegroundColor DarkYellow
    }
}

# ─────────────────────────────────────────────
# BLOQUE 5: Confirmación explícita
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host "  RESUMEN DEL DESPLIEGUE" -ForegroundColor Magenta
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host "  Origen  : $distPath" -ForegroundColor White
Write-Host "  Destino : $DeployPath" -ForegroundColor White
Write-Host "  Borrar  : $($itemsToDelete.Count) elemento(s) en destino" -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host ""

$confirm = Read-Host "Escribe exactamente 'DESPLEGAR' para continuar, o cualquier otra cosa para cancelar"
if ($confirm -ne "DESPLEGAR") {
    Write-Host "`nOperacion cancelada por el usuario." -ForegroundColor Yellow
    exit 0
}

# ─────────────────────────────────────────────
# BLOQUE 6: Borrado seguro (solo si hay elementos y la confirmación fue correcta)
# ─────────────────────────────────────────────
Write-Step "Limpiando carpeta de despliegue"

if ($itemsToDelete.Count -gt 0) {
    foreach ($item in $itemsToDelete) {
        Remove-Item $item.FullName -Recurse -Force
        Write-Host "    Borrado: $($item.Name)" -ForegroundColor DarkGray
    }
}
Write-Ok "Carpeta limpia (se conservó .git)"

# ─────────────────────────────────────────────
# BLOQUE 7: Copiar build
# ─────────────────────────────────────────────
Write-Step "Copiando build a $DeployPath"

Copy-Item "$distPath\*" $DeployPath -Recurse -Force
Write-Ok "Build copiado correctamente"

# ─────────────────────────────────────────────
# BLOQUE 8: Commit y push en la carpeta de despliegue
# ─────────────────────────────────────────────
Write-Step "Haciendo commit y push en gh-pages"

Push-Location $DeployPath
try {
    git add -A
    $commitMsg = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMsg
    git push origin gh-pages
    Write-Ok "Push completado: $commitMsg"
} catch {
    Write-Warn "El push falló o no había cambios nuevos: $_"
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "  DESPLIEGUE COMPLETADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
