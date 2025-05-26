/**
 * Erweiterte Spiel-Engine für alle Lernspiele
 * Unterstützt alle Spieltypen und Schwierigkeitsgrade
 */

class GameEngine {
    constructor() {
        this.currentGame = null;
        this.gameState = this.loadGameState();
        this.soundEnabled = true;
        this.animations = true;
    }

    // Hauptfunktion zum Starten eines Spiels
    startGame(gameType, gameData, difficulty = 'leseanfaenger') {
        this.currentGame = {
            type: gameType,
            data: gameData,
            difficulty: difficulty,
            startTime: Date.now(),
            score: 0,
            attempts: 0,
            completed: false
        };

        const gameContainer = document.getElementById('game-content');
        
        switch(gameType) {
            case 'alphabetIntroduction':
                this.loadAlphabetGame(gameContainer, gameData);
                break;
            case 'letterBingo':
                this.loadLetterBingo(gameContainer, gameData);
                break;
            case 'syllableClap':
                this.loadSyllableGame(gameContainer, gameData);
                break;
            case 'treasureHunt':
                this.loadTreasureHunt(gameContainer, gameData);
                break;
            case 'wordChain':
                this.loadWordChain(gameContainer, gameData);
                break;
            case 'interactiveStory':
                this.loadInteractiveStory(gameContainer, gameData);
                break;
            case 'blitzWords':
                this.loadBlitzWords(gameContainer, gameData);
                break;
            case 'rhymeGame':
                this.loadRhymeGame(gameContainer, gameData);
                break;
            default:
                this.showComingSoon(gameContainer);
        }
    }

    // Alphabet/Memory Spiel
    loadAlphabetGame(container, gameData) {
        const { letters, difficulty } = gameData;
        const difficultySettings = difficulty[this.currentGame.difficulty];
        const cards = this.createMemoryCards(letters, difficultySettings.pairs);
        
        let flippedCards = [];
        let matchedPairs = 0;
        let timeLeft = difficultySettings.time;

        container.innerHTML = `
            <div class="alphabet-game">
                <div class="game-header mb-6 text-center">
                    <h3 class="text-2xl font-bold text-purple-700 mb-2">Buchstaben Memory</h3>
                    <div class="flex justify-center space-x-6 mb-4">
                        <div class="stat-box bg-blue-100 px-4 py-2 rounded-lg">
                            <i class="fas fa-clock text-blue-600"></i>
                            <span id="timer" class="font-bold text-blue-700">${timeLeft}s</span>
                        </div>
                        <div class="stat-box bg-green-100 px-4 py-2 rounded-lg">
                            <i class="fas fa-check-circle text-green-600"></i>
                            <span id="pairs-found" class="font-bold text-green-700">0/${difficultySettings.pairs}</span>
                        </div>
                    </div>
                </div>
                
                <div class="memory-grid grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
                    ${cards.map((card, index) => `
                        <div class="memory-card-container">
                            <div class="memory-card cursor-pointer" data-letter="${card.letter}" data-type="${card.type}" data-index="${index}">
                                <div class="card-face card-front bg-purple-500 text-white text-2xl font-bold flex items-center justify-center h-20">
                                    <i class="fas fa-question"></i>
                                </div>
                                <div class="card-face card-back bg-yellow-200 text-purple-700 text-3xl font-bold flex items-center justify-center h-20">
                                    ${card.display}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="game-instructions text-center text-gray-600">
                    <p>Finde die Paare von Groß- und Kleinbuchstaben!</p>
                </div>
            </div>
        `;

        // Timer starten
        const timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft + 's';
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                this.endGame(false, 'Zeit abgelaufen!');
            }
        }, 1000);

        // Event Listeners für Karten
        container.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || 
                    card.classList.contains('matched') || 
                    flippedCards.length >= 2) return;

                this.flipCard(card);
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    this.currentGame.attempts++;
                    
                    setTimeout(() => {
                        const [card1, card2] = flippedCards;
                        const letter1 = card1.dataset.letter;
                        const letter2 = card2.dataset.letter;
                        
                        if (letter1.toLowerCase() === letter2.toLowerCase() && letter1 !== letter2) {
                            // Match gefunden
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            matchedPairs++;
                            document.getElementById('pairs-found').textContent = `${matchedPairs}/${difficultySettings.pairs}`;
                            
                            this.playSound('success');
                            this.showFeedback('Richtig! 🎉', 'positive');
                            
                            if (matchedPairs === difficultySettings.pairs) {
                                clearInterval(timerInterval);
                                this.endGame(true, 'Alle Paare gefunden!');
                            }
                        } else {
                            // Kein Match
                            this.flipCard(card1, false);
                            this.flipCard(card2, false);
                            this.playSound('error');
                            this.showFeedback('Nicht ganz richtig, probier weiter! 🤔', 'neutral');
                        }
                        
                        flippedCards = [];
                    }, 1200);
                }
            });
        });
    }

    // Silben-Spiel
    loadSyllableGame(container, gameData) {
        const { words, difficulty } = gameData;
        const difficultySettings = difficulty[this.currentGame.difficulty];
        const gameWords = words.slice(0, difficultySettings.wordCount);
        
        let currentWordIndex = 0;
        let correctClaps = 0;

        container.innerHTML = `
            <div class="syllable-game text-center">
                <div class="game-header mb-6">
                    <h3 class="text-2xl font-bold text-purple-700 mb-2">Silben klatschen</h3>
                    <p class="text-gray-600 mb-4">Klatsche für jede Silbe einmal!</p>
                    <div class="progress-indicator">
                        <span class="text-lg font-semibold">Wort ${currentWordIndex + 1} von ${gameWords.length}</span>
                    </div>
                </div>
                
                <div class="word-display mb-8">
                    <div class="current-word text-4xl font-bold text-purple-600 mb-4" id="current-word">
                        ${gameWords[0].word}
                    </div>
                    ${difficultySettings.showSyllables ? `
                        <div class="syllable-help text-lg text-gray-500" id="syllable-help">
                            ${gameWords[0].syllables.join(' - ')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="clap-area mb-6">
                    <button id="clap-button" class="clap-btn bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-8 py-6 rounded-full text-2xl font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95">
                        <i class="fas fa-hands-clapping mr-2"></i>
                        KLATSCH!
                    </button>
                </div>
                
                <div class="clap-counter mb-4">
                    <span class="text-xl">Geklatscht: </span>
                    <span id="clap-count" class="text-2xl font-bold text-green-600">0</span>
                    <span class="text-xl"> mal</span>
                </div>
                
                <div class="action-buttons">
                    <button id="check-syllables" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mr-4 disabled:opacity-50" disabled>
                        <i class="fas fa-check mr-2"></i>Prüfen
                    </button>
                    <button id="reset-claps" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
                        <i class="fas fa-redo mr-2"></i>Neu versuchen
                    </button>
                </div>
            </div>
        `;

        let clapCount = 0;
        
        // Event Listeners
        document.getElementById('clap-button').addEventListener('click', () => {
            clapCount++;
            document.getElementById('clap-count').textContent = clapCount;
            document.getElementById('check-syllables').disabled = false;
            
            // Visueller Effekt
            const button = document.getElementById('clap-button');
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            
            this.playSound('clap');
        });

        document.getElementById('check-syllables').addEventListener('click', () => {
            const currentWord = gameWords[currentWordIndex];
            const correctSyllables = currentWord.syllables.length;
            
            if (clapCount === correctSyllables) {
                correctClaps++;
                this.showFeedback(`Richtig! "${currentWord.word}" hat ${correctSyllables} Silben! 🎉`, 'positive');
                
                currentWordIndex++;
                if (currentWordIndex < gameWords.length) {
                    // Nächstes Wort
                    setTimeout(() => {
                        this.loadNextSyllableWord(gameWords[currentWordIndex], difficultySettings);
                        clapCount = 0;
                        document.getElementById('clap-count').textContent = '0';
                        document.getElementById('check-syllables').disabled = true;
                    }, 2000);
                } else {
                    // Spiel beendet
                    setTimeout(() => {
                        this.endGame(true, `Alle ${gameWords.length} Wörter richtig geklatscht!`);
                    }, 2000);
                }
            } else {
                this.showFeedback(`Nicht ganz richtig. "${currentWord.word}" hat ${correctSyllables} Silben. Probier es nochmal! 🤔`, 'neutral');
            }
        });

        document.getElementById('reset-claps').addEventListener('click', () => {
            clapCount = 0;
            document.getElementById('clap-count').textContent = '0';
            document.getElementById('check-syllables').disabled = true;
        });
    }

    // Schatzsuche
    loadTreasureHunt(container, gameData) {
        const { stages, difficulty } = gameData;
        const difficultySettings = difficulty[this.currentGame.difficulty];
        const gameStages = stages.slice(0, difficultySettings.stages);
        
        let currentStage = 0;
        let foundTreasures = [];

        this.loadTreasureStage(container, gameStages[0], currentStage, gameStages.length, difficultySettings);
    }

    loadTreasureStage(container, stage, stageNumber, totalStages, settings) {
        container.innerHTML = `
            <div class="treasure-hunt text-center">
                <div class="game-header mb-6">
                    <h3 class="text-2xl font-bold text-purple-700 mb-2">Schatzsuche</h3>
                    <div class="stage-indicator mb-4">
                        <span class="text-lg">Etappe ${stageNumber + 1} von ${totalStages}</span>
                        <div class="progress-bar-container bg-gray-200 rounded-full h-4 mt-2 max-w-md mx-auto">
                            <div class="progress-bar bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all" 
                                 style="width: ${((stageNumber + 1) / totalStages) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="treasure-scene mb-8">
                    <div class="scene-image mb-4">
                        <i class="fas fa-map-marked-alt text-8xl text-brown-600 mb-4"></i>
                    </div>
                    <div class="clue-box bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 max-w-md mx-auto mb-6">
                        <h4 class="text-lg font-bold text-yellow-800 mb-2">
                            <i class="fas fa-search mr-2"></i>Hinweis:
                        </h4>
                        <p class="text-yellow-700">${stage.clue}</p>
                        ${settings.hints ? `
                            <div class="hint mt-3 text-sm text-yellow-600">
                                💡 Tipp: Suche nach "${stage.answer}"
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="treasure-input mb-6">
                    <input type="text" id="treasure-answer" 
                           class="text-input text-2xl text-center border-2 border-purple-300 rounded-lg p-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                           placeholder="Deine Antwort..." 
                           maxlength="20">
                </div>
                
                <div class="action-buttons">
                    <button id="check-treasure" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-bold">
                        <i class="fas fa-key mr-2"></i>Schatz öffnen!
                    </button>
                </div>
                
                <div class="collected-letters mt-6">
                    <h4 class="text-lg font-semibold text-gray-700 mb-2">Gesammelte Buchstaben:</h4>
                    <div id="letter-collection" class="flex justify-center space-x-2">
                        <!-- Gesammelte Buchstaben werden hier angezeigt -->
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        const answerInput = document.getElementById('treasure-answer');
        const checkButton = document.getElementById('check-treasure');

        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkButton.click();
            }
        });

        checkButton.addEventListener('click', () => {
            const userAnswer = answerInput.value.trim().toUpperCase();
            const correctAnswer = stage.answer.toUpperCase();
            
            if (userAnswer === correctAnswer) {
                // Richtige Antwort
                this.showTreasureSuccess(stage.letters);
                this.currentGame.score += 10;
                
                setTimeout(() => {
                    if (stageNumber < totalStages - 1) {
                        // Nächste Etappe
                        this.loadTreasureStage(container, 
                            this.currentGame.data.stages[stageNumber + 1], 
                            stageNumber + 1, totalStages, settings);
                    } else {
                        // Schatzsuche beendet
                        this.endGame(true, 'Alle Schätze gefunden! Du bist ein wahrer Schatzjäger!');
                    }
                }, 3000);
            } else {
                // Falsche Antwort
                this.showFeedback('Das ist nicht ganz richtig. Schau dir den Hinweis nochmal an! 🤔', 'neutral');
                answerInput.value = '';
                answerInput.focus();
            }
        });

        answerInput.focus();
    }

    // Hilfsfunktionen
    createMemoryCards(letters, pairCount) {
        const cards = [];
        const selectedLetters = letters.slice(0, pairCount * 2);
        
        for (let i = 0; i < selectedLetters.length; i += 2) {
            const upperCase = selectedLetters[i];
            const lowerCase = selectedLetters[i + 1] || upperCase.toLowerCase();
            
            cards.push(
                { letter: upperCase, type: 'upper', display: upperCase },
                { letter: lowerCase, type: 'lower', display: lowerCase }
            );
        }
        
        return this.shuffleArray(cards);
    }

    flipCard(card, flip = true) {
        if (flip) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    }

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-bold z-50 ${
            type === 'positive' ? 'bg-green-500' : 
            type === 'negative' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // In einer vollständigen Implementierung würden hier echte Sounds abgespielt
        console.log(`🔊 Sound: ${type}`);
    }

    endGame(success, message) {
        this.currentGame.completed = true;
        this.currentGame.success = success;
        
        if (success) {
            this.gameState.totalPoints += this.currentGame.data.points || 10;
            this.gameState.gamesPlayed++;
            this.saveGameState();
        }
        
        const container = document.getElementById('game-content');
        container.innerHTML = `
            <div class="game-complete text-center py-8">
                <div class="result-icon mb-6">
                    ${success ? 
                        '<i class="fas fa-trophy text-6xl text-yellow-500"></i>' : 
                        '<i class="fas fa-redo text-6xl text-blue-500"></i>'
                    }
                </div>
                <h3 class="text-2xl font-bold mb-4 ${success ? 'text-green-600' : 'text-blue-600'}">
                    ${success ? 'Fantastisch!' : 'Nicht aufgeben!'}
                </h3>
                <p class="text-lg text-gray-700 mb-6">${message}</p>
                ${success ? `
                    <div class="points-earned mb-6">
                        <span class="text-2xl font-bold text-purple-600">
                            +${this.currentGame.data.points || 10} Punkte
                        </span>
                    </div>
                ` : ''}
                <div class="action-buttons">
                    ${!success ? `
                        <button onclick="gameEngine.startGame('${this.currentGame.type}', ${JSON.stringify(this.currentGame.data)}, '${this.currentGame.difficulty}')" 
                                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mr-4">
                            <i class="fas fa-redo mr-2"></i>Nochmal versuchen
                        </button>
                    ` : ''}
                    <button onclick="closeGameModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
                        <i class="fas fa-arrow-left mr-2"></i>Zurück zum Spiel
                    </button>
                </div>
            </div>
        `;
        
        if (success) {
            updateProgressDisplay();
            setTimeout(() => {
                showWitchReaction(this.currentGame.type);
            }, 1000);
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    saveGameState() {
        localStorage.setItem('mayaSophieGameState', JSON.stringify(this.gameState));
    }

    loadGameState() {
        const saved = localStorage.getItem('mayaSophieGameState');
        return saved ? JSON.parse(saved) : {
            currentDay: 1,
            difficulty: 'leseanfaenger',
            totalPoints: 0,
            learnedLetters: ['M', 'm', 'A', 'a'],
            gamesPlayed: 0,
            readingEntries: [],
            customWords: { nouns: [], verbs: [], adjectives: [] }
        };
    }
}

// Globale Instanz der Spiel-Engine
const gameEngine = new GameEngine();