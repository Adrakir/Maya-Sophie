/**
 * Vollständige JavaScript-Implementierung für den Maya-Sophie Elternbereich
 * Verwaltet Fortschritt, Statistiken, Einstellungen und Berichte
 */

class ParentDashboard {
    constructor() {
        this.parentData = this.loadParentData();
        this.currentTab = 'progress';
        this.charts = {};
        this.achievements = this.initializeAchievements();
        this.tips = this.initializeTips();
        
        this.init();
    }

    init() {
        this.updateAllStats();
        this.renderLetterProgress();
        this.renderAchievements();
        this.renderReadingEntries();
        this.renderCustomContent();
        this.initializeCharts();
        this.loadDailyTip();
        
        // Auto-refresh alle 30 Sekunden
        setInterval(() => this.updateAllStats(), 30000);
    }

    loadParentData() {
        const defaultData = {
            readingEntries: [],
            customWords: {
                nouns: [],
                verbs: [],
                adjectives: []
            },
            customStories: [],
            settings: {
                notifications: {
                    daily: true,
                    achievements: true,
                    tips: false
                },
                privacy: {
                    analyticsSharing: false
                }
            },
            statistics: {
                totalPlayTime: 0,
                averageSessionTime: 0,
                gamesCompleted: 0,
                lastActive: null
            }
        };

        const saved = localStorage.getItem('mayaSophieParentData');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveParentData() {
        localStorage.setItem('mayaSophieParentData', JSON.stringify(this.parentData));
    }

    updateAllStats() {
        const gameState = this.getGameState();
        if (!gameState) return;

        // Basic Stats aktualisieren
        document.getElementById('current-day-stat').textContent = gameState.currentDay || 1;
        document.getElementById('letters-learned-stat').textContent = gameState.learnedLetters?.length || 0;
        document.getElementById('games-played-stat').textContent = gameState.gamesPlayed || 0;
        document.getElementById('total-points-stat').textContent = gameState.totalPoints || 0;

        // Progress bars aktualisieren
        const overallProgress = (gameState.currentDay / 35) * 100;
        const alphabetProgress = (gameState.learnedLetters?.length / 26) * 100;
        const readingSkillsProgress = this.calculateReadingSkillsProgress(gameState);

        document.getElementById('overall-progress').style.width = `${overallProgress}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(overallProgress)}%`;
        
        document.getElementById('alphabet-progress').style.width = `${alphabetProgress}%`;
        document.getElementById('alphabet-percentage').textContent = `${Math.round(alphabetProgress)}%`;
        
        document.getElementById('reading-skills-progress').style.width = `${readingSkillsProgress}%`;
        document.getElementById('reading-skills-percentage').textContent = `${Math.round(readingSkillsProgress)}%`;

        // Erweiterte Statistiken
        const successRate = this.calculateSuccessRate(gameState);
        document.getElementById('success-rate').textContent = `${successRate}%`;
        
        const pointsPerDay = gameState.currentDay > 0 ? Math.round(gameState.totalPoints / gameState.currentDay) : 0;
        document.getElementById('points-per-day').textContent = pointsPerDay;

        // Parent-spezifische Updates
        this.updateParentStats();
    }

    updateParentStats() {
        document.getElementById('total-entries').textContent = this.parentData.readingEntries.length;
        
        const thisWeek = this.parentData.readingEntries.filter(entry => 
            this.isThisWeek(new Date(entry.date))
        ).length;
        document.getElementById('entries-this-week').textContent = thisWeek;
        
        const favoriteCategory = this.getFavoriteCategory();
        document.getElementById('favorite-category').textContent = favoriteCategory;
        
        const averageMood = this.getAverageMood();
        document.getElementById('average-mood').textContent = averageMood;
    }

    calculateReadingSkillsProgress(gameState) {
        const factors = [
            (gameState.gamesPlayed || 0) / 20, // Spiele gespielt
            (gameState.totalPoints || 0) / 500, // Punkte gesammelt
            this.parentData.readingEntries.length / 30 // Leseeinträge
        ];
        
        const average = factors.reduce((sum, factor) => sum + Math.min(factor, 1), 0) / factors.length;
        return Math.round(average * 100);
    }

    calculateSuccessRate(gameState) {
        // Vereinfachte Berechnung - in der Realität würde man detailliertere Daten verwenden
        const totalAttempts = gameState.gamesPlayed || 0;
        if (totalAttempts === 0) return 0;
        
        const successfulGames = Math.round(totalAttempts * 0.85); // Annahme: 85% Erfolgsrate
        return Math.round((successfulGames / totalAttempts) * 100);
    }

    getGameState() {
        const saved = localStorage.getItem('mayaSophieGameState');
        return saved ? JSON.parse(saved) : null;
    }

    // Tab Management
    showTab(tabName) {
        // Alle Tabs verstecken
        document.querySelectorAll('.tab-content > div').forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Tab Buttons aktualisieren
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-purple-100', 'text-purple-700', 'border-b-2', 'border-purple-500');
        });
        
        // Gewählten Tab anzeigen
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        // Aktiven Button markieren
        event.target.classList.add('active', 'bg-purple-100', 'text-purple-700', 'border-b-2', 'border-purple-500');
        
        this.currentTab = tabName;
        
        // Tab-spezifische Aktionen
        if (tabName === 'analytics') {
            setTimeout(() => this.updateCharts(), 100);
        }
    }

    // Letter Progress Visualization
    renderLetterProgress() {
        const gameState = this.getGameState();
        const learnedLetters = gameState?.learnedLetters || [];
        const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        const container = document.getElementById('letter-progress-grid');
        container.innerHTML = allLetters.map(letter => {
            const isLearned = learnedLetters.includes(letter) || learnedLetters.includes(letter.toLowerCase());
            return `
                <div class="letter-progress-item text-center p-2 rounded-lg border-2 transition-all ${
                    isLearned 
                        ? 'bg-green-100 border-green-400 text-green-800' 
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                }">
                    <div class="text-lg font-bold">${letter}</div>
                    ${isLearned ? '<i class="fas fa-check text-xs text-green-600"></i>' : ''}
                </div>
            `;
        }).join('');
    }

    // Achievements System
    initializeAchievements() {
        return [
            {
                id: 'first_letter',
                title: 'Erster Buchstabe',
                description: 'Den ersten Buchstaben gelernt',
                icon: 'fas fa-font',
                condition: (gameState) => gameState.learnedLetters?.length >= 1,
                points: 10
            },
            {
                id: 'first_game',
                title: 'Erstes Spiel',
                description: 'Das erste Spiel erfolgreich gespielt',
                icon: 'fas fa-gamepad',
                condition: (gameState) => gameState.gamesPlayed >= 1,
                points: 15
            },
            {
                id: 'alphabet_half',
                title: 'Halbes Alphabet',
                description: '13 Buchstaben gelernt',
                icon: 'fas fa-medal',
                condition: (gameState) => gameState.learnedLetters?.length >= 13,
                points: 50
            },
            {
                id: 'reading_enthusiast',
                title: 'Lesebegeisterung',
                description: '10 Lesetagebuch-Einträge',
                icon: 'fas fa-book-heart',
                condition: () => this.parentData.readingEntries.length >= 10,
                points: 25
            },
            {
                id: 'week_one',
                title: 'Erste Woche',
                description: 'Eine Woche durchgehalten',
                icon: 'fas fa-calendar-week',
                condition: (gameState) => gameState.currentDay >= 7,
                points: 30
            },
            {
                id: 'point_collector',
                title: 'Punkte-Sammler',
                description: '100 Punkte gesammelt',
                icon: 'fas fa-star',
                condition: (gameState) => gameState.totalPoints >= 100,
                points: 20
            }
        ];
    }

    renderAchievements() {
        const gameState = this.getGameState();
        const container = document.getElementById('achievements-list');
        
        const unlockedAchievements = this.achievements.filter(achievement => 
            achievement.condition(gameState)
        );

        if (unlockedAchievements.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-trophy text-3xl mb-2 opacity-50"></i>
                    <p>Noch keine Erfolge freigeschaltet</p>
                    <p class="text-sm">Spielt weiter, um Erfolge zu sammeln!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = unlockedAchievements.map(achievement => `
            <div class="achievement-item flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="achievement-icon mr-3">
                    <i class="${achievement.icon} text-xl text-yellow-600"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-yellow-800">${achievement.title}</h4>
                    <p class="text-sm text-yellow-600">${achievement.description}</p>
                </div>
                <div class="achievement-points text-yellow-700 font-bold">
                    +${achievement.points}
                </div>
            </div>
        `).join('');
    }

    // Reading Diary Functions
    addReadingEntry(event) {
        event.preventDefault();
        
        const text = document.getElementById('reading-text').value.trim();
        const category = document.getElementById('reading-category').value;
        const difficulty = document.getElementById('reading-difficulty').value;
        const mood = document.getElementById('selected-mood').value;
        
        if (!text) {
            alert('Bitte geben Sie einen Text ein.');
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            category: category,
            difficulty: difficulty,
            mood: mood
        };

        this.parentData.readingEntries.unshift(entry);
        this.saveParentData();
        
        // Form zurücksetzen
        document.getElementById('reading-text').value = '';
        document.getElementById('selected-mood').value = 'freudig';
        this.resetMoodButtons();
        
        // UI aktualisieren
        this.renderReadingEntries();
        this.updateParentStats();
        
        // Feedback
        this.showNotification('Eintrag erfolgreich hinzugefügt!', 'success');
    }

    setMood(mood) {
        document.getElementById('selected-mood').value = mood;
        
        // Mood buttons visuell aktualisieren
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('bg-purple-100', 'border-purple-400');
        });
        
        event.target.classList.add('bg-purple-100', 'border-purple-400');
    }

    resetMoodButtons() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('bg-purple-100', 'border-purple-400');
        });
    }

    renderReadingEntries() {
        const container = document.getElementById('reading-entries-list');
        const entries = this.parentData.readingEntries;

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-book-open text-4xl mb-3 opacity-50"></i>
                    <p class="text-lg">Noch keine Einträge vorhanden</p>
                    <p class="text-sm">Fügen Sie den ersten Eintrag hinzu!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="reading-entry bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center space-x-3">
                        <span class="category-badge px-2 py-1 text-xs font-medium rounded-full ${this.getCategoryColor(entry.category)}">
                            ${this.getCategoryLabel(entry.category)}
                        </span>
                        <span class="difficulty-badge px-2 py-1 text-xs font-medium rounded-full ${this.getDifficultyColor(entry.difficulty)}">
                            ${this.getDifficultyLabel(entry.difficulty)}
                        </span>
                        <span class="mood-indicator text-lg">${this.getMoodEmoji(entry.mood)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">${this.formatDate(entry.date)}</span>
                        <button onclick="parentDashboard.deleteReadingEntry(${entry.id})" 
                                class="text-red-500 hover:text-red-700 text-sm">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-700">${entry.text}</p>
            </div>
        `).join('');
    }

    deleteReadingEntry(entryId) {
        if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;
        
        this.parentData.readingEntries = this.parentData.readingEntries.filter(
            entry => entry.id !== entryId
        );
        
        this.saveParentData();
        this.renderReadingEntries();
        this.updateParentStats();
        
        this.showNotification('Eintrag gelöscht', 'info');
    }

    filterEntries() {
        const filterCategory = document.getElementById('filter-category').value;
        const entries = filterCategory 
            ? this.parentData.readingEntries.filter(entry => entry.category === filterCategory)
            : this.parentData.readingEntries;
        
        // Temporär gefilterte Entries rendern
        const container = document.getElementById('reading-entries-list');
        if (entries.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <p>Keine Einträge in dieser Kategorie gefunden</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="reading-entry bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center space-x-3">
                        <span class="category-badge px-2 py-1 text-xs font-medium rounded-full ${this.getCategoryColor(entry.category)}">
                            ${this.getCategoryLabel(entry.category)}
                        </span>
                        <span class="difficulty-badge px-2 py-1 text-xs font-medium rounded-full ${this.getDifficultyColor(entry.difficulty)}">
                            ${this.getDifficultyLabel(entry.difficulty)}
                        </span>
                        <span class="mood-indicator text-lg">${this.getMoodEmoji(entry.mood)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">${this.formatDate(entry.date)}</span>
                        <button onclick="parentDashboard.deleteReadingEntry(${entry.id})" 
                                class="text-red-500 hover:text-red-700 text-sm">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-700">${entry.text}</p>
            </div>
        `).join('');
    }

    // Custom Content Functions
    addCustomWord(type) {
        const inputId = `custom-${type === 'noun' ? 'noun' : type === 'verb' ? 'verb' : 'adjective'}`;
        const word = document.getElementById(inputId).value.trim();
        
        if (!word) {
            alert('Bitte geben Sie ein Wort ein.');
            return;
        }

        const key = type === 'noun' ? 'nouns' : type === 'verb' ? 'verbs' : 'adjectives';
        
        if (this.parentData.customWords[key].includes(word)) {
            alert('Dieses Wort ist bereits vorhanden.');
            return;
        }

        this.parentData.customWords[key].push(word);
        this.saveParentData();
        
        document.getElementById(inputId).value = '';
        this.renderCustomContent();
        
        this.showNotification(`${word} hinzugefügt!`, 'success');
    }

    removeCustomWord(type, index) {
        this.parentData.customWords[type].splice(index, 1);
        this.saveParentData();
        this.renderCustomContent();
    }

    addCustomStory(event) {
        event.preventDefault();
        
        const title = document.getElementById('story-title').value.trim();
        const content = document.getElementById('story-content').value.trim();
        const difficulty = document.getElementById('story-difficulty').value;
        
        if (!title || !content) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        const story = {
            id: Date.now(),
            title: title,
            content: content,
            difficulty: difficulty,
            created: new Date().toISOString()
        };

        this.parentData.customStories.push(story);
        this.saveParentData();
        
        // Form zurücksetzen
        document.getElementById('story-title').value = '';
        document.getElementById('story-content').value = '';
        
        this.renderCustomContent();