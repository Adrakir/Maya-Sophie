/**
 * ContentData - Verwaltet alle Spielinhalte, Geschichten und Lernmaterialien
 */
class ContentData {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.germanAlphabet = 'AÄBCDEFGHIJKLMNOÖPQRSTUÜVWXYZß'.split('');
        
        this.init();
    }

    init() {
        this.setupDailyContent();
        this.setupStories();
        this.setupGames();
        this.setupVocabulary();
    }

    setupDailyContent() {
        this.dailyContent = {};
        
        for (let day = 1; day <= 35; day++) {
            this.dailyContent[day] = {
                chapter: Math.ceil(day / 7),
                theme: this.getThemeForDay(day),
                lettersToLearn: this.getLettersForDay(day),
                story: this.getStoryForDay(day),
                games: this.getGamesForDay(day),
                vocabulary: this.getVocabularyForDay(day),
                difficulty: {
                    entdecker: this.getDifficultyConfig(day, 'entdecker'),
                    anfaenger: this.getDifficultyConfig(day, 'anfaenger'),
                    hase: this.getDifficultyConfig(day, 'hase')
                }
            };
        }
    }

    getThemeForDay(day) {
        const themes = [
            'Die Reise beginnt', 'Erste Buchstaben', 'Im Wald', 'Tiere kennenlernen',
            'Farben und Formen', 'Zahlen lernen', 'Die Hexe Crunella', 'Magische Wörter',
            'Freundschaft', 'Zusammenhalt', 'Mut und Tapferkeit', 'Rätsel lösen',
            'Versteckte Hinweise', 'Der Zauberberg', 'Kristallhöhle', 'Fließende Wörter',
            'Sprechende Tiere', 'Alte Weisheiten', 'Zaubersprüche', 'Dunkler Wald',
            'Licht und Schatten', 'Hoffnung', 'Zusammenarbeit', 'Kreativität',
            'Problemlösung', 'Vertrauen', 'Geduld', 'Durchhaltevermögen',
            'Letzter Kampf', 'Sieg des Guten', 'Rettung Lucas', 'Heimkehr',
            'Neue Abenteuer', 'Freude und Fest', 'Das Ende ist der Anfang'
        ];
        return themes[day - 1] || `Tag ${day}`;
    }

    getLettersForDay(day) {
        // Buchstaben werden schrittweise eingeführt
        const letterIntroduction = [
            ['A', 'a'], ['M', 'm'], ['I', 'i'], ['L', 'l'], ['O', 'o'],
            ['S', 's'], ['T', 't'], ['N', 'n'], ['E', 'e'], ['R', 'r'],
            ['D', 'd'], ['U', 'u'], ['H', 'h'], ['G', 'g'], ['B', 'b'],
            ['K', 'k'], ['F', 'f'], ['W', 'w'], ['Z', 'z'], ['P', 'p'],
            ['V', 'v'], ['J', 'j'], ['C', 'c'], ['Q', 'q'], ['X', 'x'],
            ['Y', 'y'], ['Ä', 'ä'], ['Ö', 'ö'], ['Ü', 'ü'], ['ß'],
            // Wiederholung und Festigung
            [], [], [], [], []
        ];
        
        return letterIntroduction[day - 1] || [];
    }

    getStoryForDay(day) {
        const stories = {
            1: {
                title: "Der Beginn des Abenteuers",
                text: "Maja und Sophie spielten friedlich im Garten, als plötzlich ein seltsamer Nebel aufkam. Als sich der Nebel lichtete, war ihr kleiner Bruder Luca verschwunden! An seiner Stelle lag nur eine geheimnisvolle Nachricht: 'Wenn ihr euren Bruder wiedersehen wollt, müsst ihr mich finden! - Hexe Crunella'",
                image: "story_day1.jpg",
                crunellaReaction: "Ha! Ihr werdet mich niemals finden! Luca ist sicher in meinem Turm versteckt!"
            },
            2: {
                title: "Die ersten Buchstaben",
                text: "Die beiden Schwestern machten sich auf den Weg. Im Wald fanden sie magische Steine mit Buchstaben darauf. 'Das sind Zauberbuchstaben!', rief Maja. 'Wenn wir sie sammeln und lernen, werden sie uns helfen!'",
                image: "story_day2.jpg",
                crunellaReaction: "Diese dummen Buchstaben werden euch nicht helfen! Meine Macht ist stärker!"
            },
            3: {
                title: "Freundliche Waldtiere",
                text: "Ein kluges Eichhörnchen und ein weiser alter Uhu halfen den Mädchen. 'Lernt die Buchstaben gut', sagte der Uhu. 'Nur mit Wissen könnt ihr Crunellas Zauber brechen!'",
                image: "story_day3.jpg",
                crunellaReaction: "Diese nervigen Tiere! Ich werde ihnen zeigen, wer hier das Sagen hat!"
            }
            // Weitere Geschichten...
        };
        
        return stories[day] || {
            title: `Tag ${day}`,
            text: "Das Abenteuer geht weiter...",
            image: `story_day${day}.jpg`,
            crunellaReaction: "Ihr kommt mir nicht entkommen!"
        };
    }

    getGamesForDay(day) {
        // Spiele werden basierend auf Tag und Fortschritt ausgewählt
        const baseGames = ['alphabetIntroduction', 'letterBingo', 'memory'];
        const advancedGames = ['wordPuzzle', 'storyReading', 'mathBasics'];
        
        let games = [...baseGames];
        
        if (day > 7) {
            games.push(...advancedGames.slice(0, 1));
        }
        if (day > 14) {
            games.push(...advancedGames.slice(1, 2));
        }
        if (day > 21) {
            games.push(...advancedGames.slice(2));
        }
        
        return games;
    }

    getVocabularyForDay(day) {
        const vocabularyByDay = {
            1: ['Maja', 'Sophie', 'Luca', 'Mama', 'Papa'],
            2: ['Wald', 'Baum', 'Blume', 'Stein', 'Weg'],
            3: ['Tier', 'Eule', 'Hase', 'Fuchs', 'Reh'],
            4: ['rot', 'blau', 'grün', 'gelb', 'lila'],
            5: ['eins', 'zwei', 'drei', 'vier', 'fünf'],
            // Weitere Vokabeln...
        };
        
        return vocabularyByDay[day] || ['Wort', 'lernen', 'spielen', 'freuen'];
    }

    getDifficultyConfig(day, difficulty) {
        const configs = {
            entdecker: {
                wordsPerGame: 3,
                timeLimit: null,
                hintsEnabled: true,
                repetitions: 2
            },
            anfaenger: {
                wordsPerGame: 5,
                timeLimit: 180, // 3 Minuten
                hintsEnabled: true,
                repetitions: 1
            },
            hase: {
                wordsPerGame: 8,
                timeLimit: 120, // 2 Minuten
                hintsEnabled: false,
                repetitions: 1
            }
        };
        
        return configs[difficulty] || configs.anfaenger;
    }

    setupStories() {
        this.storyData = {
            chapters: {
                1: {
                    title: "Die Reise beginnt",
                    description: "Maja und Sophie entdecken, dass Luca verschwunden ist",
                    days: [1, 2, 3, 4, 5, 6, 7]
                },
                2: {
                    title: "Der Zauberwald",
                    description: "Die Mädchen betreten den magischen Wald",
                    days: [8, 9, 10, 11, 12, 13, 14]
                },
                3: {
                    title: "Magische Begegnungen",
                    description: "Freunde und Feinde im Zauberland",
                    days: [15, 16, 17, 18, 19, 20, 21]
                },
                4: {
                    title: "Crunellas Turm",
                    description: "Der Weg zur Hexe",
                    days: [22, 23, 24, 25, 26, 27, 28]
                },
                5: {
                    title: "Das finale Abenteuer",
                    description: "Der Kampf um Luca",
                    days: [29, 30, 31, 32, 33, 34, 35]
                }
            }
        };
    }

    setupGames() {
        this.gameData = {
            alphabetIntroduction: {
                name: "Buchstaben lernen",
                description: "Lerne neue Buchstaben kennen",
                icon: "🔤",
                type: "learning",
                estimatedTime: "5-10 Min"
            },
            letterBingo: {
                name: "Buchstaben-Bingo",
                description: "Finde die richtigen Buchstaben",
                icon: "🎯",
                type: "game",
                estimatedTime: "10-15 Min"
            },
            memory: {
                name: "Memory-Spiel",
                description: "Merke dir die Buchstaben-Paare",
                icon: "🧠",
                type: "memory",
                estimatedTime: "10-15 Min"
            },
            wordPuzzle: {
                name: "Wörter-Puzzle",
                description: "Setze Wörter zusammen",
                icon: "🧩",
                type: "puzzle",
                estimatedTime: "15-20 Min"
            },
            storyReading: {
                name: "Geschichte lesen",
                description: "Lies spannende Geschichten",
                icon: "📖",
                type: "reading",
                estimatedTime: "10-20 Min"
            },
            mathBasics: {
                name: "Zahlen lernen",
                description: "Lerne zählen und rechnen",
                icon: "🔢",
                type: "math",
                estimatedTime: "10-15 Min"
            }
        };

        // Memory-Spiel Daten
        this.memoryData = {
            letterPairs: this.generateLetterPairs(),
            imagePairs: this.generateImagePairs(),
            wordPairs: this.generateWordPairs()
        };

        // Bingo-Spiel Daten
        this.bingoData = {
            words: this.generateBingoWords(),
            images: this.generateBingoImages()
        };
    }

    generateLetterPairs() {
        const pairs = [];
        for (let i = 0; i < this.alphabet.length; i++) {
            pairs.push({
                id: `letter_${i}`,
                card1: this.alphabet[i],
                card2: this.alphabet[i].toLowerCase(),
                type: 'letter'
            });
        }
        return pairs;
    }

    generateImagePairs() {
        return [
            { id: 'apple', card1: '🍎', card2: 'Apfel', type: 'image-word' },
            { id: 'ball', card1: '⚽', card2: 'Ball', type: 'image-word' },
            { id: 'cat', card1: '🐱', card2: 'Katze', type: 'image-word' },
            { id: 'dog', card1: '🐶', card2: 'Hund', type: 'image-word' },
            { id: 'elephant', card1: '🐘', card2: 'Elefant', type: 'image-word' },
            { id: 'fish', card1: '🐟', card2: 'Fisch', type: 'image-word' },
            { id: 'house', card1: '🏠', card2: 'Haus', type: 'image-word' },
            { id: 'sun', card1: '☀️', card2: 'Sonne', type: 'image-word' },
            { id: 'tree', card1: '🌳', card2: 'Baum', type: 'image-word' },
            { id: 'flower', card1: '🌸', card2: 'Blume', type: 'image-word' }
        ];
    }

    generateWordPairs() {
        return [
            { id: 'mama_papa', card1: 'Mama', card2: 'Papa', type: 'word-pair' },
            { id: 'tag_nacht', card1: 'Tag', card2: 'Nacht', type: 'word-pair' },
            { id: 'gross_klein', card1: 'Groß', card2: 'Klein', type: 'word-pair' },
            { id: 'hell_dunkel', card1: 'Hell', card2: 'Dunkel', type: 'word-pair' },
            { id: 'warm_kalt', card1: 'Warm', card2: 'Kalt', type: 'word-pair' }
        ];
    }

    generateBingoWords() {
        return {
            beginner: [
                'AM', 'IM', 'IST', 'EIN', 'DAS', 'DIE', 'UND', 'MIT',
                'BEI', 'FÜR', 'AUF', 'VOR', 'ZU', 'AN', 'WIR', 'ICH'
            ],
            intermediate: [
                'HAUS', 'BAUM', 'TIER', 'BUCH', 'SPIEL', 'KIND', 'MAMA', 'PAPA',
                'AUTO', 'BALL', 'HUND', 'KATZE', 'VOGEL', 'BLUME', 'SONNE', 'MOND'
            ],
            advanced: [
                'FREUND', 'SCHULE', 'GARTEN', 'FAMILIE', 'GESCHENK', 'GEBURTSTAG',
                'REGENBOGEN', 'SCHOKOLADE', 'ABENTEUER', 'GESCHICHTE', 'ZAUBER', 'MÄRCHEN'
            ]
        };
    }

    generateBingoImages() {
        return [
            { word: 'APFEL', emoji: '🍎', difficulty: 'beginner' },
            { word: 'BALL', emoji: '⚽', difficulty: 'beginner' },
            { word: 'KATZE', emoji: '🐱', difficulty: 'beginner' },
            { word: 'HUND', emoji: '🐶', difficulty: 'beginner' },
            { word: 'HAUS', emoji: '🏠', difficulty: 'intermediate' },
            { word: 'BAUM', emoji: '🌳', difficulty: 'intermediate' },
            { word: 'SONNE', emoji: '☀️', difficulty: 'intermediate' },
            { word: 'BLUME', emoji: '🌸', difficulty: 'intermediate' },
            { word: 'AUTO', emoji: '🚗', difficulty: 'advanced' },
            { word: 'FLUGZEUG', emoji: '✈️', difficulty: 'advanced' }
        ];
    }

    setupVocabulary() {
        this.vocabulary = {
            animals: [
                { word: 'Hund', emoji: '🐶', difficulty: 'beginner' },
                { word: 'Katze', emoji: '🐱', difficulty: 'beginner' },
                { word: 'Vogel', emoji: '🐦', difficulty: 'beginner' },
                { word: 'Fisch', emoji: '🐟', difficulty: 'beginner' },
                { word: 'Elefant', emoji: '🐘', difficulty: 'intermediate' },
                { word: 'Giraffe', emoji: '🦒', difficulty: 'intermediate' },
                { word: 'Pinguin', emoji: '🐧', difficulty: 'advanced' },
                { word: 'Schmetterling', emoji: '🦋', difficulty: 'advanced' }
            ],
            objects: [
                { word: 'Ball', emoji: '⚽', difficulty: 'beginner' },
                { word: 'Buch', emoji: '📚', difficulty: 'beginner' },
                { word: 'Auto', emoji: '🚗', difficulty: 'intermediate' },
                { word: 'Flugzeug', emoji: '✈️', difficulty: 'intermediate' },
                { word: 'Computer', emoji: '💻', difficulty: 'advanced' },
                { word: 'Telefon', emoji: '📱', difficulty: 'advanced' }
            ],
            nature: [
                { word: 'Baum', emoji: '🌳', difficulty: 'beginner' },
                { word: 'Blume', emoji: '🌸', difficulty: 'beginner' },
                { word: 'Sonne', emoji: '☀️', difficulty: 'beginner' },
                { word: 'Mond', emoji: '🌙', difficulty: 'beginner' },
                { word: 'Regenbogen', emoji: '🌈', difficulty: 'intermediate' },
                { word: 'Wasserfall', emoji: '💧', difficulty: 'advanced' }
            ]
        };
    }

    // Getter-Methoden
    getDayContent(day) {
        return this.dailyContent[day] || null;
    }

    getGameInfo(gameId) {
        return this.gameData[gameId] || null;
    }

    getMemoryPairs(type = 'letter', difficulty = 'anfaenger') {
        let pairs = [];
        
        switch (type) {
            case 'letter':
                pairs = this.memoryData.letterPairs;
                break;
            case 'image':
                pairs = this.memoryData.imagePairs;
                break;
            case 'word':
                pairs = this.memoryData.wordPairs;
                break;
        }
        
        // Schwierigkeit anpassen
        const maxPairs = {
            entdecker: 4,
            anfaenger: 6,
            hase: 8
        };
        
        return pairs.slice(0, maxPairs[difficulty] || 6);
    }

    getBingoWords(difficulty = 'anfaenger') {
        const difficultyMap = {
            entdecker: 'beginner',
            anfaenger: 'intermediate',
            hase: 'advanced'
        };
        
        return this.bingoData.words[difficultyMap[difficulty]] || this.bingoData.words.intermediate;
    }

    getVocabularyByCategory(category, difficulty = 'anfaenger') {
        const words = this.vocabulary[category] || [];
        const difficultyMap = {
            entdecker: 'beginner',
            anfaenger: 'intermediate',
            hase: 'advanced'
        };
        
        return words.filter(item => 
            item.difficulty === difficultyMap[difficulty] || 
            (difficulty === 'hase' && item.difficulty !== 'advanced')
        );
    }

    getRandomWords(count = 5, difficulty = 'anfaenger') {
        const allWords = [
            ...this.vocabulary.animals,
            ...this.vocabulary.objects,
            ...this.vocabulary.nature
        ];
        
        const difficultyMap = {
            entdecker: 'beginner',
            anfaenger: 'intermediate',
            hase: 'advanced'
        };
        
        const filteredWords = allWords.filter(item => 
            item.difficulty === difficultyMap[difficulty]
        );
        
        const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Hilfsmethoden
    getChapterForDay(day) {
        return Math.ceil(day / 7);
    }

    getDaysInChapter(chapter) {
        const startDay = (chapter - 1) * 7 + 1;
        const endDay = Math.min(chapter * 7, 35);
        
        const days = [];
        for (let day = startDay; day <= endDay; day++) {
            days.push(day);
        }
        return days;
    }

    getAllLearnedLetters(day) {
        const letters = [];
        for (let d = 1; d <= day; d++) {
            const dayLetters = this.getLettersForDay(d);
            letters.push(...dayLetters);
        }
        return [...new Set(letters)]; // Duplikate entfernen
    }

    validateGameCompletion(gameId, day, score) {
        const dayContent = this.getDayContent(day);
        if (!dayContent || !dayContent.games.includes(gameId)) {
            return false;
        }
        
        // Mindestpunktzahl basierend auf Schwierigkeit
        const minScores = {
            entdecker: 50,
            anfaenger: 60,
            hase: 70
        };
        
        const difficulty = window.gameState?.difficulty || 'anfaenger';
        return score >= minScores[difficulty];
    }
}

// Globale Instanz erstellen
window.contentData = new ContentData();