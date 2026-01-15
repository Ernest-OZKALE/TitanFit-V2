# 1. Force le script à se placer dans le bon dossier (indispensable pour Git)
Set-Location "C:\Users\Starwek\Documents\MARVYN\TitanFit-V2\"

# 2. Rediriger les erreurs vers un fichier log (pour tes troubles de l'attention, c'est un pense-bête idéal)
$LogFile = "C:\Users\Starwek\Documents\MARVYN\TitanFit-V2\backup_log.txt"

$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Write-Host "Error: Not in a git repository or no branch selected." -ForegroundColor Red
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   TITANFIT V2 - AUTOMATIC BACKUP SYSTEM" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Target Branch: $currentBranch" -ForegroundColor Yellow
Write-Host "Interval: 1 Hour" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the script." -ForegroundColor White
Write-Host ""

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] status check..." -NoNewline

    # Check if there are changes to commit
    $status = git status --porcelain
    if ($status) {
        Write-Host " Changes detected." -ForegroundColor Green
        
        try {
            Write-Host "  -> Adding files..."
            git add .
            
            Write-Host "  -> Committing..."
            git commit -m "Auto-backup: $timestamp"
            
            Write-Host "  -> Pushing to GitHub..."
            git push origin $currentBranch
            
            Write-Host "[$timestamp] ✅ Backup SUCCESSFUL!" -ForegroundColor Green
        }
        catch {
            Write-Host "[$timestamp] ❌ Backup FAILED. details below:" -ForegroundColor Red
            Write-Error $_
        }
    } else {
        Write-Host " No changes found. Skipping." -ForegroundColor Gray
    }

    $nextRun = (Get-Date).AddHours(1).ToString("HH:mm:ss")
    Write-Host "Sleeping... Next check at $nextRun" -ForegroundColor DarkGray
    Write-Host ""
    
    # Wait 3600 seconds (1 hour)
    Start-Sleep -Seconds 3600
}
