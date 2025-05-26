/**
 * GameManager - Zentrale Verwaltung aller Spiele
 */
class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameInstances = {};
        this.gameContainer = null;
        this.gameResults = {};
        
        this.init();
    }

    init() {
        this.registerGames();
        this.setupEventListeners();
    }

    registerGames() {
        // Verfügbare Spiele registrieren
        this.availableGames = {
            alphabetIntroduction: Game_AlphabetIntroduction,
            letterBingo: Game_LetterBingo,
            memory: Game_Memory,
            wordPuzzle: Game_WordPuzzle,
            storyReading: Game_StoryReading,
            mathBasics: Game_MathBasics
        };

        console.log('Registrierte Spiele:', Object.keys(this.availableGames));
    }

    setupEventListeners() {
        // Global Game Events
        document.addEventListener('gameComplete', (event) => {
            this.handleGameComplete(event.detail);
        });

        document.addEventListener('gameError', (event) => {
            this.handleGameError(event.detail);
        });
    }

    // Spiel initialisieren
    initializeGame(gameId, container) {
        if (!this.availableGames[gameId]) {
            console.error('Spiel nicht gefunden:', gameId);
            return false;
        }

        if (!container) {
            console.error('Container nicht gefunden');
            return false;
        }

        try {
            // Vorheriges Spiel cleanup
            this.cleanupCurrentGame();

            // Neues Spiel erstellen
            const GameClass = this.availableGames[gameId];
            const gameInstance = new GameClass();
            
            // Spiel-Kontext setzen
            const gameContext = this.createGameContext(gameId);
            
            // Spiel initialisieren
            gameInstance.init(container, gameContext);
            
            // Aktuelles Spiel setzen
            this.currentGame = gameInstance;
            this.gameContainer = container;
            this.gameInstances[gameId] = gameInstance;

            // Spiel ankündigen
            if (window.audioManager) {
                const gameInfo = window.contentData?.getGameInfo(gameId);
                if (gameInfo) {
                    window.audioManager.announceGameStart(gameInfo.name);
                }
            }

            console.log('Spiel initialisiert:', gameId);
            return true;

        } catch (error) {
            console.error('Fehler bei Spiel-Initialisierung:', error);
            this.handleGameError({
                gameId: gameId,
                error: error.message,
                type: 'initialization'
            });
            return false;
        }
    }

    createGameContext(gameId) {
        const currentDay = window.gameState?.getCurrentDay() || 1;
        const difficulty = window.gameState?.difficulty || 'anfaenger';
        const selectedPlayer = window.gameState?.selectedPlayer || 'both';
        
        return {
            gameId: gameId,
            day: currentDay,
            difficulty: difficulty,
            player: selectedPlayer,
            dayContent: window.contentData?.getDayContent(currentDay),
            gameInfo: window.contentData?.getGameInfo(gameId),
            letterProgress: window.gameState?.letterProgress || { learned: [], practicing: [], mastered: [] },
            onComplete: (result) => this.handleGameComplete({ gameId, ...result }),
            onError: (error) => this.handleGameError({ gameId, ...error }),
            onProgress: (progress) => this.handleGameProgress({ gameId, ...progress }),
            onFeedback: (feedback) => this.showGameFeedback(feedback),
            audioManager: window.audioManager,
            uiManager: window.uiManager
        };
    }

    // Spiel-Event-Handler
    handleGameComplete(result) {
        console.log('Spiel abgeschlossen:', result);

        const { gameId, score = 0, timeElapsed = 0, achievements = [], data = {} } = result;

        // Ergebnis speichern
        this.gameResults[gameId] = {
            score: score,
            timeElapsed: timeElapsed,
            achievements: achievements,
            completedAt: new Date().toISOString(),
            data: data
        };

        // GameState aktualisieren
        if (window.gameState) {
            window.gameState.markGameCompleted(gameId, score);
            
            // Buchstaben-Fortschritt aktualisieren
            if (data.learnedLetters) {
                data.learnedLetters.forEach(letter => {
                    window.gameState.addLearnedLetter(letter);
                });
            }
            
            if (data.masteredLetters) {
                data.masteredLetters.forEach(letter => {
                    window.gameState.masterLetter(letter);
                });
            }
        }

        // Audio-Feedback
        if (window.audioManager) {
            window.audioManager.announceGameEnd(score);
        }

        // UI-Feedback
        this.showGameCompletionDialog(result);

        // Achievements anzeigen
        if (achievements.length > 0) {
            setTimeout(() => {
                this.showAchievements(achievements);
            }, 2000);
        }
    }

    handleGameError(error) {
        console.error('Spiel-Fehler:', error);

        const { gameId, message = 'Unbekannter Fehler', type = 'general' } = error;

        // Fehler-Feedback
        if (window.uiManager) {
            window.uiManager.showNotification(
                `Fehler im Spiel: ${message}`, 
                'error', 
                5000
            );
        }

        // Audio-Feedback
        if (window.audioManager) {
            window.audioManager.indicateError();
        }

        // Bei kritischen Fehlern zurück zum Hub
        if (type === 'critical') {
            setTimeout(() => {
                if (window.uiManager) {
                    window.uiManager.showDailyHub();
                }
            }, 2000);
        }
    }

    handleGameProgress(progress) {
        const { gameId, percentage = 0, message = '', currentStep = 0, totalSteps = 0 } = progress;

        // Fortschritt in UI anzeigen
        if (window.uiManager && message) {
            window.uiManager.showGameFeedback(message, 'info');
        }

        // Fortschritts-Events für spezielle Behandlung
        if (percentage >= 100) {
            // Spiel fast abgeschlossen
            if (window.audioManager) {
                window.audioManager.playSound('success');
            }
        } else if (percentage >= 50) {
            // Halbzeit erreicht
            if (window.audioManager) {
                window.audioManager.speakEncouragement('success');
            }
        }
    }

    showGameFeedback(feedback) {
        const { message, type = 'info', speak = false, sound = null } = feedback;

        // UI-Feedback
        if (window.uiManager) {
            window.uiManager.showGameFeedback(message, type);
        }

        // Audio-Feedback
        if (window.audioManager) {
            if (sound) {
                window.audioManager.playSound(sound);
            }
            
            if (speak) {
                window.audioManager.speak(message);
            }
        }
    }

    showGameCompletionDialog(result) {
        const { gameId, score, timeElapsed, achievements } = result;
        const gameInfo = window.contentData?.getGameInfo(gameId);
        
        if (!gameInfo || !this.gameContainer) return;

        // Erfolgs-Dialog erstellen
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        dialog.innerHTML = `
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
                <div class="text-6xl mb-4">${score >= 80 ? '🎉' : score >= 60 ? '😊' : '👍'}</div>
                <h2 class="text-2xl font-bold text-purple-700 mb-4">Spiel abgeschlossen!</h2>
                <h3 class="text-lg font-semibold mb-4">${gameInfo.name}</h3>
                
                <div class="space-y-3 mb-6">
                    <div class="flex justify-between">
                        <span>Punkte:</span>
                        <span class="font-bold text-purple-600">${score}/100</span>
                    </div>
                    ${timeElapsed ? `
                        <div class="flex justify-between">
                            <span>Zeit:</span>
                            <span class="font-bold text-purple-600">${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}</span>
                        </div>
                    ` : ''}
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000" 
                             style="width: ${score}%"></div>
                    </div>
                </div>

                ${achievements.length > 0 ? `
                    <div class="mb-6">
                        <h4 class="font-bold mb-2">Neue Erfolge:</h4>
                        ${achievements.map(a => `
                            <div class="achievement-badge mb-1">
                                ${a.icon} ${a.title}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="space-y-3">
                    <button id="continueBtn" class="game-button bg-green-500 hover:bg-green-600 focus:ring-green-400 w-full">
                        Weiter spielen
                    </button>
                    <button id="backToHubBtn" class="game-button bg-purple-500 hover:bg-purple-600 focus:ring-purple-400 w-full">
                        Zurück zur Spielauswahl
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Event-Listener
        dialog.querySelector('#continueBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
            this.startNextGame();
        });

        dialog.querySelector('#backToHubBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
            if (window.uiManager) {
                window.uiManager.showDailyHub();
            }
        });

        // Dialog nach 10 Sekunden automatisch schließen
        setTimeout(() => {
            if (document.body.contains(dialog)) {
                document.body.removeChild(dialog);
                if (window.uiManager) {
                    window.uiManager.showDailyHub();
                }
            }
        }, 10000);
    }

    showAchievements(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                if (window.uiManager) {
                    window.uiManager.showNotification(
                        `🏆 ${achievement.title}: ${achievement.description}`,
                        'success',
                        4000
                    );
                }
                
                if (window.audioManager) {
                    window.audioManager.celebrateSuccess();
                }
            }, index * 1500);
        });
    }

    startNextGame() {
        if (!window.gameState || !window.contentData) {
            if (window.uiManager) {
                window.uiManager.showDailyHub();
            }
            return;
        }

        const currentDay = window.gameState.getCurrentDay();
        const dayContent = window.contentData.getDayContent(currentDay);
        const completedGames = window.gameState.getAllCompletedGames(currentDay);
        
        if (!dayContent) {
            if (window.uiManager) {
                window.uiManager.showDailyHub();
            }
            return;
        }

        // Nächstes unvollendetes Spiel finden
        const nextGame = dayContent.games.find(gameId => 
            !completedGames[gameId] || !completedGames[gameId].completed
        );

        if (nextGame) {
            // Nächstes Spiel starten
            this.initializeGame(nextGame, this.gameContainer);
        } else {
            // Alle Spiele des Tages abgeschlossen
            if (window.uiManager) {
                window.uiManager.showNotification(
                    'Alle Spiele des Tages abgeschlossen! 🎉',
                    'success',
                    3000
                );
                
                setTimeout(() => {
                    window.uiManager.showDailyHub();
                }, 2000);
            }
        }
    }

    // Spiel pausieren/fortsetzen
    pauseGame() {
        if (this.currentGame && typeof this.currentGame.pause === 'function') {
            this.currentGame.pause();
            
            if (window.audioManager) {
                window.audioManager.stopAllAudio();
            }
        }
    }

    resumeGame() {
        if (this.currentGame && typeof this.currentGame.resume === 'function') {
            this.currentGame.resume();
        }
    }

    // Spiel beenden
    endGame(reason = 'user') {
        if (this.currentGame && typeof this.currentGame.end === 'function') {
            this.currentGame.end(reason);
        }
        
        this.cleanupCurrentGame();
        
        if (window.uiManager) {
            window.uiManager.showDailyHub();
        }
    }

    cleanupCurrentGame() {
        if (this.currentGame) {
            // Cleanup-Methode aufrufen falls vorhanden
            if (typeof this.currentGame.cleanup === 'function') {
                this.currentGame.cleanup();
            }
            
            // Timer stoppen
            if (window.uiManager) {
                window.uiManager.stopGameTimer();
            }
            
            // Audio stoppen
            if (window.audioManager) {
                window.audioManager.stopAllAudio();
            }
            
            this.currentGame = null;
        }
        
        // Container leeren
        if (this.gameContainer) {
            this.gameContainer.innerHTML = '';
            this.gameContainer = null;
        }
    }

    // Hilfsmethoden
    getGameResult(gameId) {
        return this.gameResults[gameId] || null;
    }

    getAllGameResults() {
        return { ...this.gameResults };
    }

    isGameAvailable(gameId) {
        return !!this.availableGames[gameId];
    }

    getAvailableGames() {
        return Object.keys(this.availableGames);
    }

    // Debug-Methoden
    listActiveGames() {
        return Object.keys(this.gameInstances);
    }

    getCurrentGameInfo() {
        if (!this.currentGame) return null;
        
        return {
            gameId: this.currentGame.gameId || 'unknown',
            isActive: !!this.currentGame,
            hasContainer: !!this.gameContainer,
            startTime: this.currentGame.startTime || null
        };
    }

    // Spiel-spezifische Hilfsmethoden
    adaptToPlayer(gameConfig) {
        if (!window.gameState) return gameConfig;
        
        const selectedPlayer = window.gameState.selectedPlayer;
        const adaptedConfig = { ...gameConfig };
        
        // Spieler-spezifische Anpassungen
        switch (selectedPlayer) {
            case 'maja':
                adaptedConfig.playerName = 'Maja';
                adaptedConfig.playerAvatar = '👧';
                adaptedConfig.encouragementStyle = 'energetic';
                break;
            case 'sophie':
                adaptedConfig.playerName = 'Sophie';
                adaptedConfig.playerAvatar = '🧒';
                adaptedConfig.encouragementStyle = 'gentle';
                break;
            case 'both':
                adaptedConfig.playerName = 'Maja und Sophie';
                adaptedConfig.playerAvatar = '👧🧒';
                adaptedConfig.encouragementStyle = 'collaborative';
                break;
        }
        
        return adaptedConfig;
    }

    adaptToDifficulty(gameConfig) {
        if (!window.gameState) return gameConfig;
        
        const difficulty = window.gameState.difficulty;
        const adaptedConfig = { ...gameConfig };
        
        // Schwierigkeits-spezifische Anpassungen
        switch (difficulty) {
            case 'entdecker':
                adaptedConfig.timeLimit = null; // Keine Zeitbegrenzung
                adaptedConfig.hintsEnabled = true;
                adaptedConfig.maxAttempts = null; // Unbegrenzte Versuche
                adaptedConfig.itemCount = Math.min(adaptedConfig.itemCount || 5, 3);
                break;
            case 'anfaenger':
                adaptedConfig.timeLimit = (adaptedConfig.timeLimit || 120) * 1.5; // 50% mehr Zeit
                adaptedConfig.hintsEnabled = true;
                adaptedConfig.maxAttempts = 5;
                break;
            case 'hase':
                adaptedConfig.timeLimit = (adaptedConfig.timeLimit || 120) * 0.8; // 20% weniger Zeit
                adaptedConfig.hintsEnabled = false;
                adaptedConfig.maxAttempts = 3;
                adaptedConfig.itemCount = Math.max(adaptedConfig.itemCount || 5, 8);
                break;
        }
        
        return adaptedConfig;
    }

    // Performance-Monitoring
    trackGamePerformance(gameId, action, data = {}) {
        const timestamp = Date.now();
        const performanceData = {
            gameId: gameId,
            action: action, // 'start', 'interaction', 'complete', 'error'
            timestamp: timestamp,
            data: data
        };
        
        // Performance-Daten könnten hier an Analytics gesendet werden
        console.log('Game Performance:', performanceData);
        
        // Lokale Performance-Analyse
        if (action === 'complete') {
            this.analyzeGamePerformance(gameId, data);
        }
    }

    analyzeGamePerformance(gameId, completionData) {
        const { score, timeElapsed, attempts = 1, hintsUsed = 0 } = completionData;
        
        // Performance-Metriken berechnen
        const efficiency = score / Math.max(timeElapsed / 60, 1); // Punkte pro Minute
        const accuracy = score / (attempts * 100); // Genauigkeit
        const independence = Math.max(0, 1 - (hintsUsed / 10)); // Selbstständigkeit
        
        // Empfehlungen generieren
        const recommendations = [];
        
        if (efficiency < 30) {
            recommendations.push('Mehr Zeit zum Nachdenken lassen');
        }
        
        if (accuracy < 0.7) {
            recommendations.push('Schwierigkeit reduzieren');
        }
        
        if (independence < 0.5) {
            recommendations.push('Mehr Ermutigung, weniger Hilfen');
        }
        
        console.log(`Performance-Analyse für ${gameId}:`, {
            efficiency,
            accuracy,
            independence,
            recommendations
        });
        
        return {
            efficiency,
            accuracy,
            independence,
            recommendations
        };
    }
}

// Globale Instanz erstellen
window.gameManager = new GameManager();