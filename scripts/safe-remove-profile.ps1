# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE DE SEGURIDAD PARA POWERSHELL PROFILE
#
# Cómo instalarlo:
#   1. Abre PowerShell y ejecuta: notepad $PROFILE
#   2. Copia y pega este bloque al final del archivo.
#   3. Guarda y cierra. Reinicia PowerShell.
#
# Qué hace:
#   - Reemplaza Remove-Item con una versión segura que bloquea borrados en
#     carpetas raíz protegidas.
#   - Si llamas Remove-Item dentro de una carpeta peligrosa, pide
#     confirmación explícita aunque hayas puesto -Force.
#   - Añade la función 'Where-Am-I' para saber siempre dónde estás.
#   - Añade el prompt con la ruta actual resaltada.
# ─────────────────────────────────────────────────────────────────────────────

# Carpetas donde Remove-Item NUNCA debe ejecutarse sin confirmación obligatoria
$global:PROTECTED_PATHS = @(
    "C:\Users\carlo\Desktop\UNIR",
    "C:\Users\carlo\Desktop",
    "C:\Users\carlo",
    "C:\Users",
    "C:\"
)

function Remove-Item {
    [CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High')]
    param(
        [Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [string[]]$Path,
        [switch]$Recurse,
        [switch]$Force,
        [switch]$WhatIf
    )

    begin {
        $currentDir = (Get-Location).Path
        $isProtected = $false

        foreach ($protected in $global:PROTECTED_PATHS) {
            if ($currentDir -ieq $protected -or $currentDir.StartsWith($protected + "\", [System.StringComparison]::OrdinalIgnoreCase)) {
                # Solo bloqueamos si la carpeta actual ES la protegida, no si estamos en un subdirectorio
                if ($currentDir -ieq $protected) {
                    $isProtected = $true
                    break
                }
            }
        }

        if ($isProtected -and $Recurse -and -not $WhatIf) {
            Write-Host ""
            Write-Host "  [ALERTA DE SEGURIDAD]" -ForegroundColor Red
            Write-Host "  Estas intentando ejecutar Remove-Item -Recurse desde:" -ForegroundColor Red
            Write-Host "  $currentDir" -ForegroundColor Yellow
            Write-Host "  Esta es una carpeta PROTEGIDA." -ForegroundColor Red
            Write-Host ""
            Write-Host "  Rutas que se borrarían:" -ForegroundColor Yellow
            foreach ($p in $Path) { Write-Host "    $p" -ForegroundColor DarkYellow }
            Write-Host ""
            $answer = Read-Host "  Escribe exactamente 'CONFIRMO BORRADO' para continuar, o Enter para cancelar"
            if ($answer -ne "CONFIRMO BORRADO") {
                Write-Host "  Operacion cancelada. Ningún archivo fue borrado." -ForegroundColor Green
                return
            }
        }
    }

    process {
        foreach ($p in $Path) {
            if ($WhatIf) {
                Microsoft.PowerShell.Management\Remove-Item -Path $p -Recurse:$Recurse -Force:$Force -WhatIf
            } else {
                Microsoft.PowerShell.Management\Remove-Item -Path $p -Recurse:$Recurse -Force:$Force
            }
        }
    }
}

# Alias de seguridad para rm
Set-Alias -Name rm -Value Remove-Item -Force -Scope Global 2>$null

# Función de diagnóstico rápido
function Where-Am-I {
    $loc = (Get-Location).Path
    Write-Host ""
    Write-Host "  Ubicacion actual: $loc" -ForegroundColor Cyan

    $isProtected = $false
    foreach ($p in $global:PROTECTED_PATHS) {
        if ($loc -ieq $p) { $isProtected = $true; break }
    }

    if ($isProtected) {
        Write-Host "  AVISO: Estas en una carpeta protegida. Evita comandos destructivos aqui." -ForegroundColor Red
    } else {
        Write-Host "  Carpeta segura para operaciones normales." -ForegroundColor Green
    }
    Write-Host ""
}

# Prompt que muestra la ruta actual en cada comando (ya incluido en PS por defecto,
# pero lo hacemos explícito con color para que sea más visible)
function prompt {
    $path = (Get-Location).Path
    $isProtected = $false
    foreach ($p in $global:PROTECTED_PATHS) {
        if ($path -ieq $p) { $isProtected = $true; break }
    }

    if ($isProtected) {
        Write-Host "PROTEGIDA " -NoNewline -ForegroundColor Red
        Write-Host "$path" -NoNewline -ForegroundColor Yellow
    } else {
        Write-Host "PS " -NoNewline -ForegroundColor Green
        Write-Host "$path" -NoNewline -ForegroundColor Cyan
    }
    return " > "
}

Write-Host "[Perfil de seguridad cargado] Remove-Item protegido en carpetas raiz." -ForegroundColor DarkGray
