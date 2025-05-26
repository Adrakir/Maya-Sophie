/**
 * GameState - Verwaltet den aktuellen Spielzustand
 */
class GameState {
    constructor() {
        this.currentDay = 1;
        this.maxDays = 35;
        this.difficulty = 'anfaenger'; // entdecker, anfaenger, hase
        this.selectedPlayer = 'both'; // maja, sophie, both
        this.currentScreen = 'start';
        this.currentGame = null;
        this.audioEnabled = true;
        this.gamesCompleted = {};
        this.achievements = [];
        this.totalPlayTime = 0;
        this.lastSaveTime = null;
        this.letterProgress = {
            learned: [],
            practicing: [],
            mastered: []
        };
        this.storyProgress = {
            chaptersRead: [],
            currentChapter: 1
        };
        this.gameStats = {
            gamesPlayed: 0,
            totalScore: 0,
            averageScore: 0,
            favoriteGame: null
        };
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }

    // Speicher-Management
    saveToStorage() {
        const saveData = {
            currentDay: this.currentDay,
            difficulty: this.difficulty,
            selectedPlayer: this.selectedPlayer,
            audioEnabled: this.audioEnabled,
            gamesCompleted: this.gamesCompleted,
            achievements: this.achievements,
            totalPlayTime: this.totalPlayTime,
            letterProgress: this.letterProgress,
            storyProgress: this.storyProgress,
            gameStats: this.gameStats,
            lastSaveTime: new Date().toISOString()
        };
        
        localStorage.setItem('majaSophieGameState', JSON.stringify(saveData));
        this.lastSaveTime = saveData.lastSaveTime;
        
        console.log('Spielstand gespeichert:', saveData);
        return true;
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('majaSophieGameState');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                this.currentDay = data.currentDay || 1;
                this.difficulty = data.difficulty || 'anfaenger';
                this.selectedPlayer = data.selectedPlayer || 'both';
                this.audioEnabled = data.audioEnabled !== undefined ? data.audioEnabled : true;
                this.gamesCompleted = data.gamesCompleted || {};
                this.achievements = data.achievements || [];
                this.totalPlayTime = data.totalPlayTime || 0;
                this.letterProgress = data.letterProgress || {
                    learned: [],
                    practicing: [],
                    mastered: []
                };
                this.storyProgress = data.storyProgress || {
                    chaptersRead: [],
                    currentChapter: 1
                };
                this.gameStats = data.gameStats || {
                    gamesPlayed: 0,
                    totalScore: 0,
                    averageScore: 0,
                    favoriteGame: null
                };
                this.lastSaveTime = data.lastSaveTime;
                
                console.log('Spielstand geladen:', data);
                return true;
            }
        } catch (error) {
            console.error('Fehler beim Laden des Spielstands:', error);
        }
        return false;
    }

    // Tag-Management
    getCurrentDay() {
        return this.currentDay;
    }

    setCurrentDay(day) {
        if (day >= 1 && day <= this.maxDays) {
            this.currentDay = day;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    nextDay() {
        if (this.currentDay < this.maxDays) {
            this.currentDay++;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getProgress() {
        return (this.currentDay / this.maxDays) * 100;
    }

    // Spiel-Management
    markGameCompleted(gameId, score = 0) {
        if (!this.gamesCompleted[this.currentDay]) {
            this.gamesCompleted[this.currentDay] = {};
        }
        
        this.gamesCompleted[this.currentDay][gameId] = {
            completed: true,
            score: score,
            timestamp: new Date().toISOString()
        };
        
        this.updateGameStats(gameId, score);
        this.checkAchievements(gameId, score);
        this.saveToStorage();
    }

    isGameCompleted(gameId, day = null) {
        const checkDay = day || this.currentDay;
        return this.gamesCompleted[checkDay] && 
               this.gamesCompleted[checkDay][gameId] && 
               this.gamesCompleted[checkDay][gameId].completed;
    }

    getAllCompletedGames(day = null) {
        const checkDay = day || this.currentDay;
        return this.gamesCompleted[checkDay] || {};
    }

    canAdvanceToNextDay() {
        const dayGames = this.getAllCompletedGames();
        const requiredGames = this.getRequiredGamesForDay();
        
        let completedCount = 0;
        for (const gameId of requiredGames) {
            if (dayGames[gameId] && dayGames[gameId].completed) {
                completedCount++;
            }
        }
        
        return completedCount >= Math.ceil(requiredGames.length * 0.6); // 60% der Spiele müssen abgeschlossen sein
    }

    getRequiredGamesForDay(day = null) {
        const checkDay = day || this.currentDay;
        // Diese Methode wird von ContentData überschrieben
        return ['alphabetIntroduction', 'letterBingo', 'memory'];
    }

    // Statistiken und Achievements
    updateGameStats(gameId, score) {
        this.gameStats.gamesPlayed++;
        this.gameStats.totalScore += score;
        this.gameStats.averageScore = this.gameStats.totalScore / this.gameStats.gamesPlayed;
        
        // Lieblingsspiel ermitteln
        if (!this.favoriteGameStats) {
            this.favoriteGameStats = {};
        }
        if (!this.favoriteGameStats[gameId]) {
            this.favoriteGameStats[gameId] = 0;
        }
        this.favoriteGameStats[gameId]++;
        
        let maxPlayed = 0;
        let favoriteGame = null;
        for (const [game, count] of Object.entries(this.favoriteGameStats)) {
            if (count > maxPlayed) {
                maxPlayed = count;
                favoriteGame = game;
            }
        }
        this.gameStats.favoriteGame = favoriteGame;
    }

    checkAchievements(gameId, score) {
        const achievements = [];
        
        // Erste Spiel-Achievement
        if (this.gameStats.gamesPlayed === 1) {
            achievements.push({
                id: 'first_game',
                title: 'Erstes Abenteuer!',
                description: 'Du hast dein erstes Spiel gespielt!',
                icon: '🎮',
                timestamp: new Date().toISOString()
            });
        }
        
        // Perfekte Punktzahl
        if (score === 100) {
            achievements.push({
                id: 'perfect_score',
                title: 'Perfekt!',
                description: 'Du hast die volle Punktzahl erreicht!',
                icon: '⭐',
                timestamp: new Date().toISOString()
            });
        }
        
        // 5 Spiele gespielt
        if (this.gameStats.gamesPlayed === 5) {
            achievements.push({
                id: 'five_games',
                title: 'Spielmeister!',
                description: 'Du hast 5 Spiele gespielt!',
                icon: '🏆',
                timestamp: new Date().toISOString()
            });
        }
        
        // Tag abgeschlossen
        if (this.canAdvanceToNextDay()) {
            achievements.push({
                id: `day_${this.currentDay}_completed`,
                title: `Tag ${this.currentDay} geschafft!`,
                description: `Du hast alle Aufgaben von Tag ${this.currentDay} gemeistert!`,
                icon: '📅',
                timestamp: new Date().toISOString()
            });
        }
        
        // Neue Achievements hinzufügen
        for (const achievement of achievements) {
            if (!this.achievements.find(a => a.id === achievement.id)) {
                this.achievements.push(achievement);
                this.showAchievementNotification(achievement);
            }
        }
    }

    showAchievementNotification(achievement) {
        // Diese Methode wird vom UIManager implementiert
        if (window.uiManager) {
            window.uiManager.showNotification(
                `🎉 ${achievement.title} - ${achievement.description}`,
                'success',
                5000
            );
        }
    }

    // Buchstaben-Fortschritt
    addLearnedLetter(letter) {
        if (!this.letterProgress.learned.includes(letter)) {
            this.letterProgress.learned.push(letter);
            this.saveToStorage();
        }
    }

    addPracticingLetter(letter) {
        if (!this.letterProgress.practicing.includes(letter)) {
            this.letterProgress.practicing.push(letter);
            this.saveToStorage();
        }
    }

    masterLetter(letter) {
        if (!this.letterProgress.mastered.includes(letter)) {
            this.letterProgress.mastered.push(letter);
            
            // Aus practicing entfernen
            const index = this.letterProgress.practicing.indexOf(letter);
            if (index > -1) {
                this.letterProgress.practicing.splice(index, 1);
            }
            
            this.saveToStorage();
        }
    }

    getLetterStatus(letter) {
        if (this.letterProgress.mastered.includes(letter)) return 'mastered';
        if (this.letterProgress.practicing.includes(letter)) return 'practicing';
        if (this.letterProgress.learned.includes(letter)) return 'learned';
        return 'unknown';
    }

    // Einstellungen
    setDifficulty(difficulty) {
        if (['entdecker', 'anfaenger', 'hase'].includes(difficulty)) {
            this.difficulty = difficulty;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    setSelectedPlayer(player) {
        if (['maja', 'sophie', 'both'].includes(player)) {
            this.selectedPlayer = player;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        this.saveToStorage();
        return this.audioEnabled;
    }

    // Debug und Reset
    reset() {
        localStorage.removeItem('majaSophieGameState');
        location.reload();
    }

    exportSaveData() {
        const saveData = {
            currentDay: this.currentDay,
            difficulty: this.difficulty,
            selectedPlayer: this.selectedPlayer,
            audioEnabled: this.audioEnabled,
            gamesCompleted: this.gamesCompleted,
            achievements: this.achievements,
            totalPlayTime: this.totalPlayTime,
            letterProgress: this.letterProgress,
            storyProgress: this.storyProgress,
            gameStats: this.gameStats,
            lastSaveTime: new Date().toISOString(),
            exportedAt: new Date().toISOString()
        };
        
        return JSON.stringify(saveData, null, 2);
    }

    importSaveData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validierung der importierten Daten
            if (!data.currentDay || !data.difficulty) {
                throw new Error('Ungültige Speicherdaten');
            }
            
            localStorage.setItem('majaSophieGameState', JSON.stringify(data));
            location.reload();
            return true;
        } catch (error) {
            console.error('Fehler beim Importieren der Speicherdaten:', error);
            return false;
        }
    }
}

// Globale Instanz erstellen
window.gameState = new GameState();