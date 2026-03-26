# 🏛️ SYSTEME DE SAUVEGARDE AUTOMATIQUE - TITAN ARCHITECT
# 1. Configuration du dossier de travail
Set-Location "C:\Users\Ernest\Documents\MARVYN\site-clean\"

# 2. Configuration des logs
$LogFile = "C:\Users\Ernest\Documents\MARVYN\site-clean\backup_log.txt"

$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Write-Host "Erreur : Vous n'êtes pas dans un dépôt Git valide." -ForegroundColor Red
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   TITAN ARCHITECT - SAUVEGARDE AUTO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Branche cible   : $currentBranch" -ForegroundColor Yellow
Write-Host "Intervalle      : 1 Heure" -ForegroundColor Yellow
Write-Host "Appuyez sur Ctrl+C pour arrêter." -ForegroundColor White
Write-Host ""

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Vérification du statut..." -NoNewline

    # Vérification des changements
    $status = git status --porcelain
    if ($status) {
        Write-Host " Changements détectés." -ForegroundColor Green
        
        try {
            Write-Host "  -> Ajout des fichiers..."
            git add .
            
            Write-Host "  -> Création du commit..."
            git commit -m "Sauvegarde automatique : $timestamp"
            
            Write-Host "  -> Synchronisation GitHub..."
            git push origin $currentBranch
            
            Write-Host "[$timestamp] ✅ Sauvegarde RÉUSSIE !" -ForegroundColor Green
        }
        catch {
            Write-Host "[$timestamp] ❌ ÉCHEC de la sauvegarde. Détails ci-dessous :" -ForegroundColor Red
            Write-Error $_
        }
    } else {
        Write-Host " Aucun changement. En attente." -ForegroundColor Gray
    }

    $nextRun = (Get-Date).AddHours(1).ToString("HH:mm:ss")
    Write-Host "Veille... Prochaine vérification à $nextRun" -ForegroundColor DarkGray
    Write-Host ""
    
    # Attente d'une heure (3600 secondes)
    Start-Sleep -Seconds 3600
}
