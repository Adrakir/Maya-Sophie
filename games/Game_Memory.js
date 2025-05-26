/**
 * Game_Memory - Memory-Spiel mit Buchstaben, Bildern und Wörtern
 */
class Game_Memory {
    constructor() {
        this.gameId = 'memory';
        this.container = null;
        this.context = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.attempts = 0;
        this.score = 0;
        this.startTime = null;
        this.gameData = null;
        this.isProcessing = false;
        this.gameActive = false;
    }

    init(container, context) {
        this.container = container;
        this.context = context;
        this.startTime = Date.now();
        this.gameActive = true;

        this.setupGame();
        this.render();
        this.bindEvents();
        
        // Spiel-Einführung
        if (context.audioManager) {
            setTimeout(() => {
                context.audioManager.speak('Willkommen zum Memory-Spiel! Finde die zusammengehörigen Paare.');
            }, 500);
        }
    }

    setupGame() {
        // Spiel-Konfiguration basierend auf Kontext
        const config = this.createGameConfig();
        
        // Memory-Paare generieren
        this.gameData = this.generateMemoryPairs(config);
        
        // Karten mischen
        this.cards = this.shuffleCards([...this.gameData, ...this.gameData]);
        
        // Jeder Karte eine eindeutige ID geben
        this.cards = this.cards.map((card, index) => ({
            ...card,
            id: index,
            isFlipped: false,
            isMatched: false
        }));

        console.log('Memory-Spiel initialisiert:', {
            pairs: this.gameData.length,
            totalCards: this.cards.length,
            config: config
        });
    }

    createGameConfig() {
        const difficulty = this.context.difficulty;
        const dayContent = this.context.dayContent;
        
        let config = {
            pairCount: 4,
            type: 'letter', // letter, image, word
            showTime: 1500,
            flipBackDelay: 1000
        };

        // Schwierigkeits-Anpassung
        switch (difficulty) {
            case 'entdecker':
                config.pairCount = 3;
                config.showTime = 2000;
                config.flipBackDelay = 1500;
                break;
            case 'anfaenger':
                config.pairCount = 4;
                config.showTime = 1500;
                config.flipBackDelay = 1000;
                break;
            case 'hase':
                config.pairCount = 6;
                config.showTime = 1000;
                config.flipBackDelay = 800;
                break;
        }

        // Tag-basierte Anpassung
        if (dayContent) {
            const currentDay = this.context.day;
            
            if (currentDay <= 7) {
                config.type = 'letter';
            } else if (currentDay <= 14) {
                config.type = Math.random() < 0.5 ? 'letter' : 'image';
            } else {
                const types = ['letter', 'image', 'word'];
                config.type = types[Math.floor(Math.random() * types.length)];
            }
        }

        return this.context.onProgress ? 
            this.context.onProgress({ ...config }) || config : 
            config;
    }

    generateMemoryPairs(config) {
        const { pairCount, type } = config;
        
        switch (type) {
            case 'letter':
                return this.generateLetterPairs(pairCount);
            case 'image':
                return this.generateImagePairs(pairCount);
            case 'word':
                return this.generateWordPairs(pairCount);
            default:
                return this.generateLetterPairs(pairCount);
        }
    }

    generateLetterPairs(count) {
        const dayContent = this.context.dayContent;
        const allLetters = dayContent?.lettersToLearn || ['A', 'B', 'C', 'D', 'E'];
        
        // Verfügbare Buchstaben erweitern falls nötig
        const availableLetters = [
            ...allLetters,
            ...(window.contentData?.getAllLearnedLetters(this.context.day) || [])
        ];
        
        const pairs = [];
        const usedLetters = new Set();
        
        for (let i = 0; i < count && pairs.length < count; i++) {
            const letter = availableLetters[i % availableLetters.length];
            if (!usedLetters.has(letter.toUpperCase())) {
                pairs.push({
                    id: `letter_${letter}`,
                    type: 'letter',
                    content: letter.toUpperCase(),
                    pair: letter.toLowerCase(),
                    category: 'letter'
                });
                usedLetters.add(letter.toUpperCase());
            }
        }
        
        return pairs;
    }

    generateImagePairs(count) {
        const imageWords = window.contentData?.getVocabularyByCategory('animals', this.context.difficulty) || [
            { word: 'Hund', emoji: '🐶' },
            { word: 'Katze', emoji: '🐱' },
            { word: 'Vogel', emoji: '🐦' },
            { word: 'Fisch', emoji: '🐟' }
        ];
        
        const pairs = [];
        
        for (let i = 0; i < Math.min(count, imageWords.length); i++) {
            const item = imageWords[i];
            pairs.push({
                id: `image_${item.word}`,
                type: 'image',
                content: item.emoji,
                pair: item.word,
                category: 'image-word'
            });
        }
        
        return pairs;
    }

    generateWordPairs(count) {
        const opposites = [
            { word1: 'Groß', word2: 'Klein' },
            { word1: 'Hell', word2: 'Dunkel' },
            { word1: 'Warm', word2: 'Kalt' },
            { word1: 'Schnell', word2: 'Langsam' },
            { word1: 'Laut', word2: 'Leise' },
            { word1: 'Oben', word2: 'Unten' }
        ];
        
        const pairs = [];
        
        for (let i = 0; i < Math.min(count, opposites.length); i++) {
            const opposite = opposites[i];
            pairs.push({
                id: `word_${opposite.word1}`,
                type: 'word',
                content: opposite.word1,
                pair: opposite.word2,
                category: 'opposite'
            });
        }
        
        return pairs;
    }

    shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    render() {
        if (!this.container) return;

        const gridSize = this.getGridSize(this.cards.length);
        
        this.container.innerHTML = `
            <div class="memory-game">
                <div class="memory-header text-center mb-6">
                    <h3 class="text-xl font-bold text-purple-700 mb-2">Memory-Spiel</h3>
                    <div class="flex justify-center space-x-6 text-sm">
                        <div class="memory-stat">
                            <span class="font-semibold">Versuche:</span>
                            <span id="attempts-count" class="text-purple-600">${this.attempts}</span>
                        </div>
                        <div class="memory-stat">
                            <span class="font-semibold">Gefunden:</span>
                            <span id="matches-count" class="text-green-600">${this.matchedPairs.length}</span>
                        </div>
                        <div class="memory-stat">
                            <span class="font-semibold">Verbleibend:</span>
                            <span id="remaining-count" class="text-orange-600">${this.gameData.length - this.matchedPairs.length}</span>
                        </div>
                    </div>
                </div>
                
                <div id="memory-grid" class="memory-grid grid grid-cols-${gridSize.cols} gap-3 max-w-2xl mx-auto">
                    ${this.cards.map(card => this.renderCard(card)).join('')}
                </div>
                
                <div class="memory-actions text-center mt-6">
                    <button id="memory-hint-btn" class="game-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 mr-3">
                        💡 Hinweis
                    </button>
                    <button id="memory-reset-btn" class="game-button bg-gray-500 hover:bg-gray-600 focus:ring-gray-400">
                        🔄 Neu mischen
                    </button>
                </div>
                
                <div id="memory-feedback" class="text-center mt-4 h-8 font-semibold"></div>
            </div>
        `;

        // Initiales Anzeigen aller Karten für kurze Zeit
        this.showAllCardsTemporarily();
    }

    getGridSize(cardCount) {
        if (cardCount <= 8) return { cols: 4, rows: 2 };
        if (cardCount <= 12) return { cols: 4, rows: 3 };
        return { cols: 4, rows: 4 };
    }

    renderCard(card) {
        const cardContent = this.getCardContent(card);
        
        return `
            <div class="memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}" 
                 data-card-id="${card.id}"
                 data-pair-id="${card.id.split('_')[1]}">
                <div class="memory-card-inner">
                    <div class="memory-card-front">
                        <span class="text-2xl">❓</span>
                    </div>
                    <div class="memory-card-back">
                        <span class="memory-card-content">${cardContent}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getCardContent(card) {
        switch (card.type) {
            case 'letter':
                return `<span class="text-3xl font-bold">${card.content}</span>`;
            case 'image':
                return `<span class="text-4xl">${card.content}</span>`;
            case 'word':
                return `<span class="text-lg font-bold">${card.content}</span>`;
            default:
                return card.content;
        }
    }

    bindEvents() {
        if (!this.container) return;

        // Karten-Klick Events
        this.container.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.memory-card');
            if (cardElement && !this.isProcessing) {
                this.handleCardClick(cardElement);
            }
        });

        // Button Events
        const hintBtn = this.container.querySelector('#memory-hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        const resetBtn = this.container.querySelector('#memory-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        // Keyboard Events
        document.addEventListener('keydown', (event) => {
            if (this.gameActive) {
                this.handleKeyPress(event);
            }
        });
    }

    showAllCardsTemporarily() {
        const config = this.createGameConfig();
        
        // Alle Karten kurz anzeigen
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                this.flipCard(card.id, true, false);
            }, index * 100);
        });

        // Nach Anzeigezeit wieder umdrehen
        setTimeout(() => {
            this.cards.forEach((card, index) => {
                setTimeout(() => {
                    if (!card.isMatched) {
                        this.flipCard(card.id, false, false);
                    }
                }, index * 50);
            });
        }, config.showTime);
    }

    handleCardClick(cardElement) {
        if (this.isProcessing) return;

        const cardId = parseInt(cardElement.dataset.cardId);
        const card = this.cards.find(c => c.id === cardId);

        if (!card || card.isFlipped || card.isMatched) {
            return;
        }

        // Karte umdrehen
        this.flipCard(cardId, true);
        this.flippedCards.push(card);

        // Audio-Feedback
        if (this.context.audioManager) {
            this.context.audioManager.playClickSound();
            
            // Karten-Inhalt aussprechen
            if (card.type === 'letter') {
                this.context.audioManager.speakLetter(card.content);
            } else if (card.type === 'word') {
                this.context.audioManager.speakWord(card.content);
            }
        }

        // Prüfen auf Paar
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            this.attempts++;
            this.updateStats();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 800);
        }
    }

    flipCard(cardId, flip, animate = true) {
        const cardElement = this.container.querySelector(`[data-card-id="${cardId}"]`);
        const card = this.cards.find(c => c.id === cardId);
        
        if (!cardElement || !card) return;

        card.isFlipped = flip;
        
        if (flip) {
            cardElement.classList.add('flipped');
        } else {
            cardElement.classList.remove('flipped');
        }

        if (animate && this.context.audioManager) {
            this.context.audioManager.playSound('click');
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = this.isMatchingPair(card1, card2);

        if (isMatch) {
            // Paar gefunden
            this.handleMatch(card1, card2);
        } else {
            // Kein Paar
            this.handleNoMatch(card1, card2);
        }

        this.flippedCards = [];
        this.isProcessing = false;
    }

    isMatchingPair(card1, card2) {
        if (card1.type !== card2.type) return false;

        switch (card1.type) {
            case 'letter':
                return card1.content.toLowerCase() === card2.content.toLowerCase() ||
                       (card1.content === card2.pair || card2.content === card1.pair);
            case 'image':
                return card1.pair === card2.content || card2.pair === card1.content;
            case 'word':
                return card1.pair === card2.content || card2.pair === card1.content;
            default:
                return card1.content === card2.content;
        }
    }

    handleMatch(card1, card2) {
        // Karten als gefunden markieren
        card1.isMatched = true;
        card2.isMatched = true;
        
        const card1Element = this.container.querySelector(`[data-card-id="${card1.id}"]`);
        const card2Element = this.container.querySelector(`[data-card-id="${card2.id}"]`);
        
        if (card1Element) card1Element.classList.add('matched');
        if (card2Element) card2Element.classList.add('matched');

        this.matchedPairs.push([card1, card2]);
        this.score += 10;

        // Feedback
        this.showFeedback('Richtig! Paar gefunden! 🎉', 'success');
        
        if (this.context.audioManager) {
            this.context.audioManager.provideFeedback(true, `${card1.content} und ${card2.content}`);
        }

        this.updateStats();

        // Spiel-Ende prüfen
        if (this.matchedPairs.length === this.gameData.length) {
            setTimeout(() => {
                this.completeGame();
            }, 1500);
        }
    }

    handleNoMatch(card1, card2) {
        // Karten nach kurzer Zeit wieder umdrehen
        setTimeout(() => {
            this.flipCard(card1.id, false);
            this.flipCard(card2.id, false);
        }, 1000);

        // Feedback
        this.showFeedback('Kein Paar. Versuche es nochmal! 🤔', 'error');
        
        if (this.context.audioManager) {
            this.context.audioManager.provideFeedback(false);
        }
    }

    showHint() {
        if (this.flippedCards.length > 0) return;

        // Zufällige ungepaarte Karte finden
        const unmatched = this.cards.filter(card => !card.isMatched);
        if (unmatched.length < 2) return;

        const randomCard = unmatched[Math.floor(Math.random() * unmatched.length)];
        const matchingCard = this.findMatchingCard(randomCard);

        if (matchingCard) {
            // Beide Karten kurz anzeigen
            this.flipCard(randomCard.id, true);
            this.flipCard(matchingCard.id, true);

            // Nach 2 Sekunden wieder umdrehen
            setTimeout(() => {
                this.flipCard(randomCard.id, false);
                this.flipCard(matchingCard.id, false);
            }, 2000);

            this.showFeedback('Hinweis: Merke dir diese beiden Karten! 💡', 'info');
            
            if (this.context.audioManager) {
                this.context.audioManager.speak('Das ist ein zusammengehörendes Paar. Merke es dir!');
            }
        }
    }

    findMatchingCard(card) {
        return this.cards.find(otherCard => 
            otherCard.id !== card.id && 
            !otherCard.isMatched && 
            this.isMatchingPair(card, otherCard)
        );
    }

    resetGame() {
        if (confirm('Möchtest du das Spiel wirklich neu starten?')) {
            this.cards = this.shuffleCards(this.cards);
            this.cards.forEach(card => {
                card.isFlipped = false;
                card.isMatched = false;
            });
            
            this.flippedCards = [];
            this.matchedPairs = [];
            this.attempts = 0;
            this.isProcessing = false;
            
            this.render();
            this.bindEvents();
            
            if (this.context.audioManager) {
                this.context.audioManager.speak('Spiel wurde neu gestartet!');
            }
        }
    }

    updateStats() {
        const attemptsElement = this.container.querySelector('#attempts-count');
        const matchesElement = this.container.querySelector('#matches-count');
        const remainingElement = this.container.querySelector('#remaining-count');

        if (attemptsElement) attemptsElement.textContent = this.attempts;
        if (matchesElement) matchesElement.textContent = this.matchedPairs.length;
        if (remainingElement) remainingElement.textContent = this.gameData.length - this.matchedPairs.length;
    }

    showFeedback(message, type) {
        const feedbackElement = this.container.querySelector('#memory-feedback');
        if (!feedbackElement) return;

        const colors = {
            success: 'text-green-600',
            error: 'text-red-600',
            info: 'text-blue-600'
        };

        feedbackElement.textContent = message;
        feedbackElement.className = `text-center mt-4 h-8 font-semibold ${colors[type] || colors.info}`;

        setTimeout(() => {
            feedbackElement.textContent = '';
        }, 3000);
    }

    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                this.showHint();
                break;
            case 'r':
                event.preventDefault();
                this.resetGame();
                break;
        }
    }

    completeGame() {
        this.gameActive = false;
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Score berechnen
        const maxScore = 100;
        const attemptPenalty = Math.max(0, (this.attempts - this.gameData.length) * 2);
        const timePenalty = Math.max(0, (timeElapsed - 60) * 0.5);
        const finalScore = Math.max(20, Math.floor(maxScore - attemptPenalty - timePenalty));

        const result = {
            gameId: this.gameId,
            score: finalScore,
            timeElapsed: timeElapsed,
            attempts: this.attempts,
            perfectPairs: this.matchedPairs.length,
            achievements: this.calculateAchievements(finalScore, timeElapsed),
            data: {
                type: this.gameData[0]?.type || 'letter',
                pairCount: this.gameData.length,
                efficiency: this.attempts === this.gameData.length ? 'perfect' : 'good'
            }
        };

        // Fortschritt für gelernte Buchstaben
        if (this.gameData[0]?.type === 'letter') {
            result.data.learnedLetters = this.gameData.map(card => card.content);
        }

        if (this.context.onComplete) {
            this.context.onComplete(result);
        }

        // Audio-Feedback
        if (this.context.audioManager) {
            this.context.audioManager.celebrateSuccess();
        }
    }

    calculateAchievements(score, timeElapsed) {
        const achievements = [];

        if (this.attempts === this.gameData.length) {
            achievements.push({
                id: 'memory_perfect',
                title: 'Perfektes Gedächtnis!',
                description: 'Alle Paare beim ersten Versuch gefunden!',
                icon: '🧠'
            });
        }

        if (timeElapsed < 60) {
            achievements.push({
                id: 'memory_speed',
                title: 'Blitzschnell!',
                description: 'Spiel in unter einer Minute abgeschlossen!',
                icon: '⚡'
            });
        }

        if (score >= 90) {
            achievements.push({
                id: 'memory_master',
                title: 'Memory-Meister!',
                description: 'Über 90 Punkte erreicht!',
                icon: '🏆'
            });
        }

        return achievements;
    }

    // Cleanup
    cleanup() {
        this.gameActive = false;
        this.isProcessing = false;
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        // Event Listeners entfernen
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    // Pause/Resume
    pause() {
        this.gameActive = false;
        this.isProcessing = true;
    }

    resume() {
        this.gameActive = true;
        this.isProcessing = false;
    }

    end(reason) {
        this.gameActive = false;
        this.cleanup();
    }
}

// Export für GameManager
window.Game_Memory = Game_Memory;