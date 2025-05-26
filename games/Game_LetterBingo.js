/**
 * Game_LetterBingo - Buchstaben-Bingo mit verschiedenen Modi
 */
class Game_LetterBingo {
    constructor() {
        this.gameId = 'letterBingo';
        this.container = null;
        this.context = null;
        this.gameConfig = null;
        this.bingoBoard = [];
        this.calledItems = [];
        this.markedCells = [];
        this.score = 0;
        this.startTime = null;
        this.gameActive = false;
        this.currentRound = 0;
        this.totalRounds = 5;
        this.streakCount = 0;
    }

    init(container, context) {
        this.container = container;
        this.context = context;
        this.startTime = Date.now();
        this.gameActive = true;

        this.setupGame();
        this.render();
        this.bindEvents();
        this.startNewRound();
        
        // Spiel-Einführung
        if (context.audioManager) {
            setTimeout(() => {
                context.audioManager.speak('Willkommen zum Buchstaben-Bingo! Finde die gesuchten Buchstaben auf deinem Spielfeld.');
            }, 500);
        }
    }

    setupGame() {
        // Spiel-Konfiguration erstellen
        this.gameConfig = this.createGameConfig();
        
        // Bingo-Board generieren
        this.generateBingoBoard();
        
        console.log('Bingo-Spiel initialisiert:', {
            mode: this.gameConfig.mode,
            boardSize: this.gameConfig.boardSize,
            items: this.bingoBoard.length
        });
    }

    createGameConfig() {
        const difficulty = this.context.difficulty;
        const dayContent = this.context.dayContent;
        
        let config = {
            boardSize: 4, // 4x4 Grid
            mode: 'letter', // letter, word, image
            timePerRound: 15,
            showHints: true,
            requirePattern: false // Linie, Kreuz, etc.
        };

        // Schwierigkeits-Anpassung
        switch (difficulty) {
            case 'entdecker':
                config.boardSize = 3;
                config.timePerRound = 20;
                config.showHints = true;
                break;
            case 'anfaenger':
                config.boardSize = 4;
                config.timePerRound = 15;
                config.showHints = true;
                break;
            case 'hase':
                config.boardSize = 5;
                config.timePerRound = 10;
                config.showHints = false;
                config.requirePattern = true;
                break;
        }

        // Tag-basierte Modi
        if (dayContent) {
            const currentDay = this.context.day;
            
            if (currentDay <= 10) {
                config.mode = 'letter';
            } else if (currentDay <= 20) {
                config.mode = Math.random() < 0.7 ? 'letter' : 'word';
            } else {
                const modes = ['letter', 'word', 'image'];
                config.mode = modes[Math.floor(Math.random() * modes.length)];
            }
        }

        return config;
    }

    generateBingoBoard() {
        const { boardSize, mode } = this.gameConfig;
        const totalCells = boardSize * boardSize;
        
        // Items basierend auf Modus generieren
        let availableItems = [];
        
        switch (mode) {
            case 'letter':
                availableItems = this.generateLetterItems();
                break;
            case 'word':
                availableItems = this.generateWordItems();
                break;
            case 'image':
                availableItems = this.generateImageItems();
                break;
        }

        // Board füllen
        this.bingoBoard = [];
        const usedItems = new Set();
        
        for (let i = 0; i < totalCells; i++) {
            let item;
            let attempts = 0;
            
            do {
                item = availableItems[Math.floor(Math.random() * availableItems.length)];
                attempts++;
            } while (usedItems.has(item.id) && attempts < 50);
            
            if (!usedItems.has(item.id)) {
                usedItems.add(item.id);
                this.bingoBoard.push({
                    ...item,
                    position: i,
                    isMarked: false,
                    isCorrect: false
                });
            } else {
                // Fallback für doppelte Items
                this.bingoBoard.push({
                    id: `fallback_${i}`,
                    content: item.content,
                    display: item.display,
                    category: 'fallback',
                    position: i,
                    isMarked: false,
                    isCorrect: false
                });
            }
        }
    }

    generateLetterItems() {
        const dayContent = this.context.dayContent;
        const allLetters = [
            ...(dayContent?.lettersToLearn || []),
            ...(window.contentData?.getAllLearnedLetters(this.context.day) || [])
        ];
        
        // Fallback falls keine Buchstaben verfügbar
        if (allLetters.length === 0) {
            allLetters.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
        }

        return allLetters.map(letter => ({
            id: `letter_${letter}`,
            content: letter.toUpperCase(),
            display: letter.toUpperCase(),
            category: 'letter',
            audioText: letter
        }));
    }

    generateWordItems() {
        const words = window.contentData?.getBingoWords(this.context.difficulty) || [
            'HAUS', 'BAUM', 'AUTO', 'BALL', 'BUCH', 'TIER', 
            'SONNE', 'MOND', 'BLUME', 'VOGEL', 'HUND', 'KATZE'
        ];

        return words.map(word => ({
            id: `word_${word}`,
            content: word,
            display: word,
            category: 'word',
            audioText: word
        }));
    }

    generateImageItems() {
        const imageItems = window.contentData?.getVocabularyByCategory('animals', this.context.difficulty) || [
            { word: 'Hund', emoji: '🐶' },
            { word: 'Katze', emoji: '🐱' },
            { word: 'Vogel', emoji: '🐦' },
            { word: 'Fisch', emoji: '🐟' }
        ];

        return imageItems.map(item => ({
            id: `image_${item.word}`,
            content: item.word,
            display: item.emoji,
            category: 'image',
            audioText: item.word
        }));
    }

    render() {
        if (!this.container) return;

        const { boardSize } = this.gameConfig;
        
        this.container.innerHTML = `
            <div class="bingo-game">
                <div class="bingo-header text-center mb-6">
                    <h3 class="text-xl font-bold text-purple-700 mb-2">Buchstaben-Bingo</h3>
                    <div class="flex justify-center space-x-6 text-sm">
                        <div class="bingo-stat">
                            <span class="font-semibold">Runde:</span>
                            <span id="round-count" class="text-purple-600">${this.currentRound}/${this.totalRounds}</span>
                        </div>
                        <div class="bingo-stat">
                            <span class="font-semibold">Punkte:</span>
                            <span id="score-count" class="text-green-600">${this.score}</span>
                        </div>
                        <div class="bingo-stat">
                            <span class="font-semibold">Serie:</span>
                            <span id="streak-count" class="text-orange-600">${this.streakCount}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bingo-target text-center mb-6">
                    <div id="target-display" class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600 mb-2">Suche:</p>
                        <div id="target-item" class="text-3xl font-bold text-blue-700">
                            Bereit?
                        </div>
                    </div>
                    <div id="timer-display" class="mt-3">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div id="timer-bar" class="bg-blue-500 h-2 rounded-full transition-all duration-1000" style="width: 100%;"></div>
                        </div>
                        <p id="timer-text" class="text-sm text-gray-600 mt-1">Zeit: --</p>
                    </div>
                </div>
                
                <div id="bingo-board" class="bingo-board grid grid-cols-${boardSize} gap-2 max-w-lg mx-auto mb-6">
                    ${this.bingoBoard.map(cell => this.renderBingoCell(cell)).join('')}
                </div>
                
                <div class="bingo-actions text-center">
                    <button id="hint-btn" class="game-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 mr-3">
                        💡 Hinweis
                    </button>
                    <button id="skip-btn" class="game-button bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 mr-3">
                        ⏭️ Überspringen
                    </button>
                    <button id="new-game-btn" class="game-button bg-green-500 hover:bg-green-600 focus:ring-green-400">
                        🔄 Neues Spiel
                    </button>
                </div>
                
                <div id="bingo-feedback" class="text-center mt-4 h-8 font-semibold"></div>
            </div>
        `;
    }

    renderBingoCell(cell) {
        return `
            <div class="bingo-cell ${cell.isMarked ? 'marked' : ''} ${cell.isCorrect ? 'correct' : ''}"
                 data-cell-id="${cell.position}"
                 data-content="${cell.content}">
                <div class="bingo-cell-content">
                    ${cell.display}
                </div>
            </div>
        `;
    }

    bindEvents() {
        if (!this.container) return;

        // Bingo-Zellen Klick Events
        this.container.addEventListener('click', (event) => {
            const cell = event.target.closest('.bingo-cell');
            if (cell && this.gameActive) {
                this.handleCellClick(cell);
            }
        });

        // Button Events
        const hintBtn = this.container.querySelector('#hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        const skipBtn = this.container.querySelector('#skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipRound());
        }

        const newGameBtn = this.container.querySelector('#new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.resetGame());
        }

        // Keyboard Events
        document.addEventListener('keydown', (event) => {
            if (this.gameActive) {
                this.handleKeyPress(event);
            }
        });
    }

    startNewRound() {
        if (this.currentRound >= this.totalRounds) {
            this.completeGame();
            return;
        }

        this.currentRound++;
        
        // Zufälliges Item vom Board auswählen
        const availableCells = this.bingoBoard.filter(cell => !cell.isMarked);
        if (availableCells.length === 0) {
            this.completeGame();
            return;
        }

        this.currentTarget = availableCells[Math.floor(Math.random() * availableCells.length)];
        
        // UI aktualisieren
        this.updateTargetDisplay();
        this.updateStats();
        this.startTimer();

        // Audio-Ansage
        if (this.context.audioManager) {
            setTimeout(() => {
                let announcement = '';
                
                switch (this.currentTarget.category) {
                    case 'letter':
                        announcement = `Finde den Buchstaben ${this.currentTarget.audioText}`;
                        break;
                    case 'word':
                        announcement = `Finde das Wort ${this.currentTarget.audioText}`;
                        break;
                    case 'image':
                        announcement = `Finde ${this.currentTarget.audioText}`;
                        break;
                }
                
                this.context.audioManager.speak(announcement);
            }, 500);
        }
    }

    updateTargetDisplay() {
        const targetElement = this.container.querySelector('#target-item');
        if (targetElement && this.currentTarget) {
            targetElement.textContent = this.currentTarget.display;
        }
    }

    startTimer() {
        const timeLimit = this.gameConfig.timePerRound;
        let timeLeft = timeLimit;
        
        const timerBar = this.container.querySelector('#timer-bar');
        const timerText = this.container.querySelector('#timer-text');
        
        this.roundTimer = setInterval(() => {
            timeLeft--;
            
            const percentage = (timeLeft / timeLimit) * 100;
            
            if (timerBar) {
                timerBar.style.width = `${percentage}%`;
                
                // Farbe ändern basierend auf verbleibender Zeit
                if (percentage > 50) {
                    timerBar.className = 'bg-green-500 h-2 rounded-full transition-all duration-1000';
                } else if (percentage > 25) {
                    timerBar.className = 'bg-yellow-500 h-2 rounded-full transition-all duration-1000';
                } else {
                    timerBar.className = 'bg-red-500 h-2 rounded-full transition-all duration-1000';
                }
            }
            
            if (timerText) {
                timerText.textContent = `Zeit: ${timeLeft}s`;
            }
            
            if (timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.roundTimer) {
            clearInterval(this.roundTimer);
            this.roundTimer = null;
        }
    }

    handleCellClick(cellElement) {
        const cellId = parseInt(cellElement.dataset.cellId);
        const cell = this.bingoBoard.find(c => c.position === cellId);
        
        if (!cell || cell.isMarked) return;

        // Zelle markieren
        cell.isMarked = true;
        cellElement.classList.add('marked');

        // Audio-Feedback
        if (this.context.audioManager) {
            this.context.audioManager.playClickSound();
        }

        // Prüfen ob richtig
        if (cell.id === this.currentTarget.id) {
            this.handleCorrectSelection(cell, cellElement);
        } else {
            this.handleIncorrectSelection(cell, cellElement);
        }
    }

    handleCorrectSelection(cell, cellElement) {
        this.stopTimer();
        
        // Zelle als korrekt markieren
        cell.isCorrect = true;
        cellElement.classList.add('correct');
        
        // Punkte vergeben
        const timeBonus = this.calculateTimeBonus();
        const streakBonus = this.streakCount * 2;
        const roundScore = 10 + timeBonus