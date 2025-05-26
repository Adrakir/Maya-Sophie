/**
 * UIManager - Verwaltet die Benutzeroberfläche und Screen-Navigation
 */
class UIManager {
    constructor() {
        this.currentScreen = 'startScreen';
        this.previousScreen = null;
        this.screens = {};
        this.modals = {};
        this.notifications = [];
        this.gameTimer = null;
        this.gameStartTime = null;
        
        this.init();
    }

    init() {
        this.setupScreens();
        this.setupEventListeners();
        this.setupNotificationSystem();
        this.initializeInterface();
    }

    setupScreens() {
        // Alle verfügbaren Screens registrieren
        this.screens = {
            startScreen: document.getElementById('startScreen'),
            difficultyScreen: document.getElementById('difficultyScreen'),
            playerScreen: document.getElementById('playerScreen'),
            storyScreen: document.getElementById('storyScreen'),
            dailyHubScreen: document.getElementById('dailyHubScreen'),
            activeGameScreen: document.getElementById('activeGameScreen'),
            helpScreen: document.getElementById('helpScreen'),
            parentAreaScreen: document.getElementById('parentAreaScreen')
        };

        // UI-Elemente registrieren
        this.elements = {
            topBar: document.getElementById('topBar'),
            gameHeader: document.getElementById('gameHeader'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            globalNotification: document.getElementById('globalNotification'),
            notificationText: document.getElementById('notificationText'),
            
            // Header-Elemente
            dayCounter: document.getElementById('dayCounter'),
            progressFill: document.getElementById('progressFill'),
            chapterDisplay: document.getElementById('chapterDisplay'),
            
            // Navigation
            newGameBtn: document.getElementById('newGameBtn'),
            saveGameBtn: document.getElementById('saveGameBtn'),
            loadGameBtn: document.getElementById('loadGameBtn'),
            helpBtn: document.getElementById('helpBtn'),
            parentAreaBtn: document.getElementById('parentAreaBtn'),
            toggleAudioBtn: document.getElementById('toggleAudioBtn'),
            audioIcon: document.getElementById('audioIcon'),
            audioText: document.getElementById('audioText'),
            
            // Start Screen
            startGameBtn: document.getElementById('startGameBtn'),
            loadGameStartBtn: document.getElementById('loadGameStartBtn'),
            tutorialBtn: document.getElementById('tutorialBtn'),
            
            // Game Content
            dailyTitle: document.getElementById('dailyTitle'),
            dailyGamesMenu: document.getElementById('dailyGamesMenu'),
            nextDayBtn: document.getElementById('nextDayBtn'),
            activeGameTitle: document.getElementById('activeGameTitle'),
            activeGameContent: document.getElementById('activeGameContent'),
            gameFeedback: document.getElementById('gameFeedback'),
            gameTimer: document.getElementById('gameTimer'),
            backToHubBtn: document.getElementById('backToHubBtn'),
            
            // Story Elements
            storyTitle: document.getElementById('storyTitle'),
            storyImageContainer: document.getElementById('storyImageContainer'),
            storyImage: document.getElementById('storyImage'),
            storyTextArea: document.getElementById('storyTextArea'),
            crunellaReaction: document.getElementById('crunellaReaction'),
            crunellaText: document.getElementById('crunellaText'),
            continueStoryBtn: document.getElementById('continueStoryBtn'),
            
            // Help & Parent Area
            helpContent: document.getElementById('helpContent'),
            parentContent: document.getElementById('parentContent'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            closeParentAreaBtn: document.getElementById('closeParentAreaBtn')
        };
    }

    setupEventListeners() {
        // Navigation Events
        this.elements.newGameBtn?.addEventListener('click', () => this.startNewGame());
        this.elements.saveGameBtn?.addEventListener('click', () => this.saveGame());
        this.elements.loadGameBtn?.addEventListener('click', () => this.loadGame());
        this.elements.helpBtn?.addEventListener('click', () => this.showHelp());
        this.elements.parentAreaBtn?.addEventListener('click', () => this.showParentArea());
        this.elements.toggleAudioBtn?.addEventListener('click', () => this.toggleAudio());

        // Start Screen Events
        this.elements.startGameBtn?.addEventListener('click', () => this.showDifficultySelection());
        this.elements.loadGameStartBtn?.addEventListener('click', () => this.loadGame());
        this.elements.tutorialBtn?.addEventListener('click', () => this.showHelp());

        // Difficulty Selection
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.getAttribute('data-difficulty');
                this.selectDifficulty(difficulty);
            });
        });

        // Player Selection
        document.querySelectorAll('[data-player]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const player = e.currentTarget.getAttribute('data-player');
                this.selectPlayer(player);
            });
        });

        // Game Navigation
        this.elements.continueStoryBtn?.addEventListener('click', () => this.showDailyHub());
        this.elements.backToHubBtn?.addEventListener('click', () => this.showDailyHub());
        this.elements.nextDayBtn?.addEventListener('click', () => this.nextDay());

        // Modal Close Events
        this.elements.closeHelpBtn?.addEventListener('click', () => this.hideHelp());
        this.elements.closeParentAreaBtn?.addEventListener('click', () => this.hideParentArea());

        // Keyboard Events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Responsive Events
        window.addEventListener('resize', () => this.handleResize());
    }

    setupNotificationSystem() {
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }

    initializeInterface() {
        this.updateAudioButton();
        this.updateGameHeader();
    }

    // Screen Navigation
    showScreen(screenName, data = {}) {
        if (!this.screens[screenName]) {
            console.error('Screen not found:', screenName);
            return false;
        }

        // Vorherigen Screen merken
        this.previousScreen = this.currentScreen;

        // Alle Screens verstecken
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Neuen Screen anzeigen
        this.screens[screenName].classList.add('active');
        this.currentScreen = screenName;

        // Navigation und Header je nach Screen anzeigen/verstecken
        this.updateInterfaceVisibility(screenName);

        // Screen-spezifische Initialisierung
        this.initializeScreen(screenName, data);

        // Audio-Feedback
        if (window.audioManager) {
            window.audioManager.playClickSound();
        }

        console.log('Screen gewechselt zu:', screenName);
        return true;
    }

    updateInterfaceVisibility(screenName) {
        const showNavigation = !['startScreen', 'difficultyScreen', 'playerScreen'].includes(screenName);
        const showHeader = !['startScreen', 'difficultyScreen', 'playerScreen', 'helpScreen', 'parentAreaScreen'].includes(screenName);

        if (this.elements.topBar) {
            this.elements.topBar.style.display = showNavigation ? 'flex' : 'none';
        }

        if (this.elements.gameHeader) {
            this.elements.gameHeader.style.display = showHeader ? 'block' : 'none';
        }
    }

    initializeScreen(screenName, data) {
        switch (screenName) {
            case 'storyScreen':
                this.initializeStoryScreen(data);
                break;
            case 'dailyHubScreen':
                this.initializeDailyHub(data);
                break;
            case 'activeGameScreen':
                this.initializeActiveGame(data);
                break;
            case 'helpScreen':
                this.initializeHelpScreen();
                break;
            case 'parentAreaScreen':
                this.initializeParentArea();
                break;
        }
    }

    // Screen-spezifische Initialisierungen
    initializeStoryScreen(data) {
        if (!window.gameState || !window.contentData) return;

        const currentDay = window.gameState.getCurrentDay();
        const dayContent = window.contentData.getDayContent(currentDay);
        
        if (!dayContent || !dayContent.story) return;

        const story = dayContent.story;

        // Story-Titel setzen
        if (this.elements.storyTitle) {
            this.elements.storyTitle.textContent = story.title;
        }

        // Story-Text setzen
        if (this.elements.storyTextArea) {
            this.elements.storyTextArea.textContent = story.text;
        }

        // Story-Bild (falls vorhanden)
        if (story.image && this.elements.storyImage && this.elements.storyImageContainer) {
            this.elements.storyImage.src = `images/${story.image}`;
            this.elements.storyImage.alt = story.title;
            this.elements.storyImageContainer.style.display = 'block';
        }

        // Crunella Reaktion
        if (story.crunellaReaction && this.elements.crunellaReaction && this.elements.crunellaText) {
            this.elements.crunellaText.textContent = story.crunellaReaction;
            this.elements.crunellaReaction.style.display = 'block';
        }

        // Story vorlesen
        if (window.audioManager) {
            setTimeout(() => {
                window.audioManager.speak(story.text);
            }, 1000);
        }
    }

    initializeDailyHub(data) {
        if (!window.gameState || !window.contentData) return;

        const currentDay = window.gameState.getCurrentDay();
        const dayContent = window.contentData.getDayContent(currentDay);
        
        if (!dayContent) return;

        // Titel setzen
        if (this.elements.dailyTitle) {
            this.elements.dailyTitle.textContent = `Tag ${currentDay}: ${dayContent.theme}`;
        }

        // Spiele-Menu erstellen
        this.createGamesMenu(dayContent.games, currentDay);

        // Nächster Tag Button
        this.updateNextDayButton();
    }

    createGamesMenu(games, day) {
        if (!this.elements.dailyGamesMenu || !window.contentData) return;

        this.elements.dailyGamesMenu.innerHTML = '';

        games.forEach(gameId => {
            const gameInfo = window.contentData.getGameInfo(gameId);
            if (!gameInfo) return;

            const isCompleted = window.gameState.isGameCompleted(gameId, day);
            
            const gameCard = document.createElement('div');
            gameCard.className = `game-card ${isCompleted ? 'border-green-400 bg-green-50' : ''}`;
            
            gameCard.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-3">${gameInfo.icon}</div>
                    <h3 class="text-lg font-bold text-purple-700 mb-2">${gameInfo.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${gameInfo.description}</p>
                    <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>📅 ${gameInfo.estimatedTime}</span>
                        <span>🎯 ${gameInfo.type}</span>
                    </div>
                    ${isCompleted ? 
                        '<div class="achievement-badge"><i class="fas fa-check mr-1"></i>Abgeschlossen</div>' : 
                        '<button class="w-full game-button bg-purple-500 hover:bg-purple-600 focus:ring-purple-400">Spielen</button>'
                    }
                </div>
            `;

            if (!isCompleted) {
                const playButton = gameCard.querySelector('button');
                playButton.addEventListener('click', () => {
                    this.startGame(gameId);
                });
            }

            this.elements.dailyGamesMenu.appendChild(gameCard);
        });
    }

    updateNextDayButton() {
        if (!this.elements.nextDayBtn || !window.gameState) return;

        const canAdvance = window.gameState.canAdvanceToNextDay();
        const isLastDay = window.gameState.getCurrentDay() >= 35;

        if (canAdvance && !isLastDay) {
            this.elements.nextDayBtn.style.display = 'block';
            this.elements.nextDayBtn.textContent = 'Nächster Tag';
        } else if (canAdvance && isLastDay) {
            this.elements.nextDayBtn.style.display = 'block';
            this.elements.nextDayBtn.textContent = 'Spiel beenden';
        } else {
            this.elements.nextDayBtn.style.display = 'none';
        }
    }

    initializeActiveGame(data) {
        if (!data.gameId || !window.gameManager) return;

        // Game-Titel setzen
        if (this.elements.activeGameTitle && window.contentData) {
            const gameInfo = window.contentData.getGameInfo(data.gameId);
            if (gameInfo) {
                this.elements.activeGameTitle.textContent = gameInfo.name;
            }
        }

        // Game-Content leeren
        if (this.elements.activeGameContent) {
            this.elements.activeGameContent.innerHTML = '';
        }

        // Feedback leeren
        if (this.elements.gameFeedback) {
            this.elements.gameFeedback.textContent = '';
        }

        // Timer starten
        this.startGameTimer();

        // Spiel initialisieren
        window.gameManager.initializeGame(data.gameId, this.elements.activeGameContent);
    }

    initializeHelpScreen() {
        if (!this.elements.helpContent) return;

        this.elements.helpContent.innerHTML = `
            <div class="space-y-6">
                <div class="bg-blue-50 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-blue-700 mb-4">🎮 Wie funktioniert das Spiel?</h3>
                    <div class="space-y-3 text-gray-700">
                        <p><strong>Ziel:</strong> Begleite Maja und Sophie auf ihrer Reise, um ihren Bruder Luca von der Hexe Crunella zu befreien!</p>
                        <p><strong>Dauer:</strong> Das Abenteuer erstreckt sich über 35 spannende Tage.</p>
                        <p><strong>Lernen:</strong> Jeden Tag lernst du neue Buchstaben, Wörter und Geschichten kennen.</p>
                    </div>
                </div>

                <div class="bg-green-50 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-green-700 mb-4">📚 Lesestufen</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl mb-2">🧸</div>
                            <h4 class="font-bold">Buchstabenentdecker</h4>
                            <p class="text-sm text-gray-600">Erste Buchstaben und einfache Wörter</p>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl mb-2">📖</div>
                            <h4 class="font-bold">Leseanfänger</h4>
                            <p class="text-sm text-gray-600">Wörter und kurze Sätze</p>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl mb-2">🐇</div>
                            <h4 class="font-bold">Lesehase</h4>
                            <p class="text-sm text-gray-600">Längere Texte und Geschichten</p>
                        </div>
                    </div>
                </div>

                <div class="bg-purple-50 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-purple-700 mb-4">🎯 Spielarten</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🔤</span>
                                <div>
                                    <h4 class="font-bold">Buchstaben lernen</h4>
                                    <p class="text-sm text-gray-600">Neue Buchstaben kennenlernen</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🧠</span>
                                <div>
                                    <h4 class="font-bold">Memory-Spiel</h4>
                                    <p class="text-sm text-gray-600">Buchstaben und Bilder merken</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🎯</span>
                                <div>
                                    <h4 class="font-bold">Buchstaben-Bingo</h4>
                                    <p class="text-sm text-gray-600">Richtige Buchstaben finden</p>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🧩</span>
                                <div>
                                    <h4 class="font-bold">Wörter-Puzzle</h4>
                                    <p class="text-sm text-gray-600">Wörter zusammensetzen</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">📖</span>
                                <div>
                                    <h4 class="font-bold">Geschichte lesen</h4>
                                    <p class="text-sm text-gray-600">Spannende Geschichten</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🔢</span>
                                <div>
                                    <h4 class="font-bold">Zahlen lernen</h4>
                                    <p class="text-sm text-gray-600">Zählen und rechnen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-orange-50 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-orange-700 mb-4">💡 Tipps für Eltern</h3>
                    <div class="space-y-2 text-gray-700">
                        <p>• <strong>Gemeinsam spielen:</strong> Begleiten Sie Ihr Kind beim Lernen</p>
                        <p>• <strong>Pausen einhalten:</strong> 15-20 Minuten am Tag sind ausreichend</p>
                        <p>• <strong>Erfolge feiern:</strong> Loben Sie jeden Fortschritt</p>
                        <p>• <strong>Geduld haben:</strong> Jedes Kind lernt in seinem eigenen Tempo</p>
                        <p>• <strong>Audio nutzen:</strong> Die Sprachausgabe hilft beim Lernen</p>
                    </div>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-gray-700 mb-4">⚙️ Steuerung</h3>
                    <div class="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 class="font-bold mb-2">Tastatur:</h4>
                            <p>• Leertaste: Sprachausgabe wiederholen</p>
                            <p>• Escape: Zurück zum Menü</p>
                            <p>• Enter: Bestätigen</p>
                        </div>
                        <div>
                            <h4 class="font-bold mb-2">Maus/Touch:</h4>
                            <p>• Klicken/Tippen: Auswählen</p>
                            <p>• Lange drücken: Hilfe anzeigen</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeParentArea() {
        if (!this.elements.parentContent || !window.gameState) return;

        const stats = window.gameState.gameStats;
        const achievements = window.gameState.achievements;
        const progress = window.gameState.getProgress();

        this.elements.parentContent.innerHTML = `
            <div class="space-y-6">
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-blue-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-blue-600">${window.gameState.getCurrentDay()}</div>
                        <p class="text-gray-600">Aktueller Tag</p>
                    </div>
                    <div class="bg-green-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-green-600">${stats.gamesPlayed}</div>
                        <p class="text-gray-600">Spiele gespielt</p>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-lg text-center">
                        <div class="text-3xl font-bold text-purple-600">${Math.round(progress)}%</div>
                        <p class="text-gray-600">Fortschritt</p>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-xl font-bold text-gray-700 mb-4">📊 Lernfortschritt</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span>Gesamtfortschritt</span>
                                <span>${Math.round(progress)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-bold mb-2">Gelernte Buchstaben:</h4>
                            <div class="flex flex-wrap gap-2">
                                ${window.gameState.letterProgress.learned.map(letter => 
                                    `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">${letter}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div>
                            <h4 class="font-bold mb-2">Gemeisterte Buchstaben:</h4>
                            <div class="flex flex-wrap gap-2">
                                ${window.gameState.letterProgress.mastered.map(letter => 
                                    `<span class="px-2 py-1 bg-green-100 text-green-800 rounded">${letter}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-xl font-bold text-gray-700 mb-4">🏆 Erfolge</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${achievements.length > 0 ? 
                            achievements.map(achievement => `
                                <div class="flex items-center p-3 bg-yellow-50 rounded-lg">
                                    <span class="text-2xl mr-3">${achievement.icon}</span>
                                    <div>
                                        <h4 class="font-bold">${achievement.title}</h4>
                                        <p class="text-sm text-gray-600">${achievement.description}</p>
                                    </div>
                                </div>
                            `).join('') :
                            '<p class="text-gray-500 col-span-2 text-center">Noch keine Erfolge erreicht</p>'
                        }
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-xl font-bold text-gray-700 mb-4">⚙️ Einstellungen</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <label class="font-medium">Audio aktiviert</label>
                            <button id="parentToggleAudio" class="game-button ${window.gameState.audioEnabled ? 'bg-green-500' : 'bg-red-500'}">
                                ${window.gameState.audioEnabled ? 'An' : 'Aus'}
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="font-medium">Schwierigkeit</label>
                            <span class="px-3 py-1 bg-gray-100 rounded">${window.gameState.difficulty}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="font-medium">Spieler</label>
                            <span class="px-3 py-1 bg-gray-100 rounded">${window.gameState.selectedPlayer}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-xl font-bold text-gray-700 mb-4">💾 Speicherverwaltung</h3>
                    <div class="space-y-3">
                        <button id="exportSaveBtn" class="game-button bg-blue-500 hover:bg-blue-600 w-full">
                            Spielstand exportieren
                        </button>
                        <button id="importSaveBtn" class="game-button bg-green-500 hover:bg-green-600 w-full">
                            Spielstand importieren
                        </button>
                        <button id="resetGameBtn" class="game-button bg-red-500 hover:bg-red-600 w-full">
                            Spiel zurücksetzen
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event-Listener für Elternbereich hinzufügen
        this.setupParentAreaEvents();
    }

    setupParentAreaEvents() {
        // Audio-Toggle
        const audioToggle = document.getElementById('parentToggleAudio');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                const newState = !window.gameState.audioEnabled;
                window.gameState.toggleAudio();
                window.audioManager?.setEnabled(newState);
                audioToggle.textContent = newState ? 'An' : 'Aus';
                audioToggle.className = `game-button ${newState ? 'bg-green-500' : 'bg-red-500'}`;
                this.updateAudioButton();
            });
        }

        // Export/Import/Reset
        document.getElementById('exportSaveBtn')?.addEventListener('click', () => this.exportSaveData());
        document.getElementById('importSaveBtn')?.addEventListener('click', () => this.importSaveData());
        document.getElementById('resetGameBtn')?.addEventListener('click', () => this.resetGame());
    }

    // Game-spezifische Methoden
    startGame(gameId) {
        if (window.audioManager) {
            window.audioManager.playClickSound();
        }
        
        this.showScreen('activeGameScreen', { gameId });
    }

    startGameTimer() {
        this.gameStartTime = Date.now();
        this.gameTimer = setInterval(() => {
            if (this.elements.gameTimer) {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.elements.gameTimer.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopGameTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        return this.gameStartTime ? Math.floor((Date.now() - this.gameStartTime) / 1000) : 0;
    }

    // Feedback-System
    showGameFeedback(message, type = 'info') {
        if (!this.elements.gameFeedback) return;

        const colors = {
            success: 'text-green-600',
            error: 'text-red-600',
            info: 'text-blue-600',
            warning: 'text-yellow-600'
        };

        this.elements.gameFeedback.textContent = message;
        this.elements.gameFeedback.className = `text-center font-semibold text-lg h-8 ${colors[type] || colors.info}`;

        // Automatisch ausblenden nach 3 Sekunden
        setTimeout(() => {
            if (this.elements.gameFeedback) {
                this.elements.gameFeedback.textContent = '';
                this.elements.gameFeedback.className = 'text-center font-semibold text-lg h-8';
            }
        }, 3000);
    }

    // Notification-System
    showNotification(message, type = 'info', duration = 3000) {
        if (!this.elements.globalNotification || !this.elements.notificationText) return;

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };

        this.elements.notificationText.textContent = message;
        this.elements.globalNotification.className = 
            `fixed top-4 right-4 text-white p-4 rounded-lg shadow-lg z-40 transform transition-transform duration-300 ${colors[type] || colors.info}`;

        // Notification einblenden
        this.elements.globalNotification.style.transform = 'translateX(0)';

        // Notification ausblenden
        setTimeout(() => {
            if (this.elements.globalNotification) {
                this.elements.globalNotification.style.transform = 'translateX(100%)';
            }
        }, duration);
    }

    // Loading-System
    showLoading(message = 'Lade...') {
        if (this.elements.loadingIndicator) {
            const loadingText = this.elements.loadingIndicator.querySelector('p');
            if (loadingText) {
                loadingText.textContent = message;
            }
            this.elements.loadingIndicator.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.style.display = 'none';
        }
    }

    // Hilfsmethoden
    updateGameHeader() {
        if (!window.gameState) return;

        const currentDay = window.gameState.getCurrentDay();
        const progress = window.gameState.getProgress();

        if (this.elements.dayCounter) {
            this.elements.dayCounter.textContent = `Tag ${currentDay} von 35`;
        }

        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${progress}%`;
        }

        if (this.elements.chapterDisplay && window.contentData) {
            const chapter = window.contentData.getChapterForDay(currentDay);
            const chapterInfo = window.contentData.storyData.chapters[chapter];
            if (chapterInfo) {
                this.elements.chapterDisplay.textContent = `Kapitel ${chapter}: ${chapterInfo.title}`;
            }
        }
    }

    updateAudioButton() {
        if (!window.gameState || !this.elements.toggleAudioBtn) return;

        const isEnabled = window.gameState.audioEnabled;
        
        if (this.elements.audioIcon) {
            this.elements.audioIcon.className = `fas ${isEnabled ? 'fa-volume-up' : 'fa-volume-mute'} mr-2`;
        }
        
        if (this.elements.audioText) {
            this.elements.audioText.textContent = isEnabled ? 'Audio An' : 'Audio Aus';
        }
        
        this.elements.toggleAudioBtn.className = 
            `nav-btn ${isEnabled ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} focus:ring-gray-400`;
    }

    // Event-Handler
    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                if (this.currentScreen === 'activeGameScreen') {
                    this.showDailyHub();
                } else if (['helpScreen', 'parentAreaScreen'].includes(this.currentScreen)) {
                    this.showScreen(this.previousScreen || 'dailyHubScreen');
                }
                break;
            case ' ':
                event.preventDefault();
                // Sprachausgabe wiederholen (implementiert in spezifischen Spielen)
                break;
            case 'Enter':
                // Bestätigen (implementiert in spezifischen Spielen)
                break;
        }
    }

    handleResize() {
        // Responsive Anpassungen
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile-spezifische Anpassungen
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    // Navigation-Methoden
    startNewGame() {
        if (confirm('Möchtest du wirklich ein neues Spiel starten? Der aktuelle Fortschritt geht verloren!')) {
            window.gameState?.reset();
        }
    }

    saveGame() {
        if (window.gameState?.saveToStorage()) {
            this.showNotification('Spiel gespeichert!', 'success');
        } else {
            this.showNotification('Fehler beim Speichern!', 'error');
        }
    }

    loadGame() {
        // Hier könnte eine Datei-Auswahl implementiert werden
        this.showNotification('Lade-Funktion wird implementiert...', 'info');
    }

    showHelp() {
        this.showScreen('helpScreen');
    }

    hideHelp() {
        this.showScreen(this.previousScreen || 'dailyHubScreen');
    }

    showParentArea() {
        this.showScreen('parentAreaScreen');
    }

    hideParentArea() {
        this.showScreen(this.previousScreen || 'dailyHubScreen');
    }

    toggleAudio() {
        if (window.gameState && window.audioManager) {
            const newState = window.gameState.toggleAudio();
            window.audioManager.setEnabled(newState);
            this.updateAudioButton();
            
            if (newState) {
                window.audioManager.speak('Audio aktiviert');
                this.showNotification('Audio aktiviert', 'success');
            } else {
                this.showNotification('Audio deaktiviert', 'info');
            }
        }
    }

    showDifficultySelection() {
        this.showScreen('difficultyScreen');
    }

    selectDifficulty(difficulty) {
        if (window.gameState?.setDifficulty(difficulty)) {
            this.showScreen('playerScreen');
            
            if (window.audioManager) {
                const difficultyNames = {
                    entdecker: 'Buchstabenentdecker',
                    anfaenger: 'Leseanfänger',
                    hase: 'Lesehase'
                };
                window.audioManager.speak(`Du hast ${difficultyNames[difficulty]} gewählt. Wer spielt heute?`);
            }
        }
    }

    selectPlayer(player) {
        if (window.gameState?.setSelectedPlayer(player)) {
            this.showScreen('storyScreen');
            this.updateGameHeader();
            
            if (window.audioManager) {
                const playerNames = {
                    maja: 'Maja',
                    sophie: 'Sophie',
                    both: 'Maja und Sophie'
                };
                window.audioManager.speak(`Hallo ${playerNames[player]}! Willkommen zum Abenteuer!`);
            }
        }
    }

    showDailyHub() {
        this.stopGameTimer();
        this.showScreen('dailyHubScreen');
        this.updateGameHeader();
    }

    nextDay() {
        if (window.gameState?.nextDay()) {
            this.showScreen('storyScreen');
            this.updateGameHeader();
            
            if (window.audioManager) {
                window.audioManager.speak('Ein neuer Tag beginnt! Lass uns das Abenteuer fortsetzen!');
            }
        }
    }

    // Elternbereich-spezifische Methoden
    exportSaveData() {
        if (!window.gameState) return;

        try {
            const saveData = window.gameState.exportSaveData();
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `maja-sophie-spielstand-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Spielstand exportiert!', 'success');
        } catch (error) {
            console.error('Export-Fehler:', error);
            this.showNotification('Fehler beim Export!', 'error');
        }
    }

    importSaveData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = e.target.result;
                    if (window.gameState?.importSaveData(saveData)) {
                        this.showNotification('Spielstand importiert!', 'success');
                    } else {
                        this.showNotification('Ungültige Datei!', 'error');
                    }
                } catch (error) {
                    console.error('Import-Fehler:', error);
                    this.showNotification('Fehler beim Import!', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    resetGame() {
        if (confirm('Möchtest du wirklich das gesamte Spiel zurücksetzen? Alle Fortschritte gehen verloren!')) {
            if (confirm('Bist du dir sicher? Diese Aktion kann nicht rückgängig gemacht werden!')) {
                window.gameState?.reset();
            }
        }
    }
}

// Globale Instanz erstellen
window.uiManager = new UIManager();