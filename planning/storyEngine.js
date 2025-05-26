/**
 * Story Engine für Maya-Sophie Lernspiel
 * Verwaltet alle Tagesgeschichten und interaktiven Geschichten
 */

class StoryEngine {
    constructor() {
        this.currentStory = null;
        this.interactiveMode = false;
        this.choices = [];
        this.storyProgress = {};
        this.speechSynthesis = window.speechSynthesis;
    }

    // Hauptfunktion zum Laden einer Tagesgeschichte
    loadDailyStory(day, container) {
        const storyData = DAILY_STORIES[day];
        if (!storyData) {
            console.error(`Story for day ${day} not found`);
            return;
        }

        this.currentStory = storyData;
        this.renderDailyStory(container, storyData);
    }

    // Tagesgeschichte rendern
    renderDailyStory(container, story) {
        container.innerHTML = `
            <div class="daily-story-container">
                <!-- Story Header -->
                <div class="story-header mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-bold text-purple-700 flex items-center">
                            <i class="fas fa-book-open mr-3 text-3xl"></i>
                            ${story.title}
                        </h3>
                        <div class="story-controls flex space-x-2">
                            <button onclick="storyEngine.toggleAudio()" 
                                    class="audio-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-all">
                                <i class="fas fa-volume-up mr-1"></i>
                                Vorlesen
                            </button>
                            <button onclick="storyEngine.showCharacters()" 
                                    class="characters-btn bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-all">
                                <i class="fas fa-users mr-1"></i>
                                Charaktere
                            </button>
                        </div>
                    </div>
                    
                    <!-- Story Navigation -->
                    <div class="story-nav flex justify-center space-x-2 mb-4">
                        ${story.chapters.map((chapter, index) => `
                            <button onclick="storyEngine.loadChapter(${index})" 
                                    class="chapter-btn ${index === 0 ? 'active' : ''} px-3 py-1 rounded-full text-sm border-2 border-purple-300 hover:bg-purple-100 transition-all"
                                    data-chapter="${index}">
                                ${index + 1}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Story Content -->
                <div class="story-content">
                    <!-- Story Image -->
                    <div class="story-image-container mb-6">
                        <img id="story-main-image" 
                             src="${story.mainImage}" 
                             alt="${story.title}" 
                             class="story-image w-full rounded-lg shadow-lg">
                        <div class="image-caption text-center mt-2 text-sm text-gray-600">
                            ${story.imageCaption || ''}
                        </div>
                    </div>

                    <!-- Chapter Content -->
                    <div id="chapter-content" class="chapter-content">
                        ${this.renderChapter(story.chapters[0], 0)}
                    </div>

                    <!-- Story Actions -->
                    <div class="story-actions mt-6 text-center">
                        <button id="continue-btn" onclick="storyEngine.nextChapter()" 
                                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                            <i class="fas fa-arrow-right mr-2"></i>
                            Weiter lesen
                        </button>
                    </div>
                </div>

                <!-- Character Modal -->
                <div id="character-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-xl font-bold text-purple-700">Charaktere in dieser Geschichte</h4>
                            <button onclick="storyEngine.hideCharacters()" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div id="character-list" class="grid md:grid-cols-2 gap-4">
                            <!-- Characters will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.currentChapter = 0;
        this.setupStoryListeners();
    }

    // Einzelnes Kapitel rendern
    renderChapter(chapter, chapterIndex) {
        return `
            <div class="chapter" data-chapter="${chapterIndex}">
                ${chapter.image ? `
                    <div class="chapter-image mb-4">
                        <img src="${chapter.image}" alt="Kapitel ${chapterIndex + 1}" 
                             class="w-full max-w-md mx-auto rounded-lg shadow-md">
                    </div>
                ` : ''}
                
                <div class="chapter-text bg-purple-50 p-6 rounded-lg shadow-inner border-l-4 border-purple-500">
                    ${chapter.content.split('\n').map(paragraph => 
                        paragraph.trim() ? `<p class="mb-4 text-lg leading-relaxed">${paragraph}</p>` : ''
                    ).join('')}
                </div>

                ${chapter.mishap ? `
                    <div class="mishap-box bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                        <h5 class="font-bold text-red-700 mb-2 flex items-center">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Majas Lesefehler:
                        </h5>
                        <p class="text-red-600">${chapter.mishap}</p>
                    </div>
                ` : ''}

                ${chapter.lesson ? `
                    <div class="lesson-box bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
                        <h5 class="font-bold text-green-700 mb-2 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>
                            Was wir lernen:
                        </h5>
                        <p class="text-green-600">${chapter.lesson}</p>
                    </div>
                ` : ''}

                ${chapter.interactive ? this.renderInteractiveElement(chapter.interactive) : ''}
            </div>
        `;
    }

    // Interaktive Elemente rendern
    renderInteractiveElement(interactive) {
        switch(interactive.type) {
            case 'choice':
                return `
                    <div class="interactive-choice mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <h5 class="font-bold text-blue-700 mb-3">${interactive.question}</h5>
                        <div class="choices grid gap-3">
                            ${interactive.options.map((option, index) => `
                                <button onclick="storyEngine.makeChoice(${index})" 
                                        class="choice-btn bg-white hover:bg-blue-100 border-2 border-blue-300 rounded-lg p-3 text-left transition-all transform hover:scale-105"
                                        data-choice="${index}">
                                    ${option.text}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            
            case 'reading':
                return `
                    <div class="interactive-reading mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <h5 class="font-bold text-yellow-700 mb-3">
                            <i class="fas fa-book mr-2"></i>
                            Hilf Maja beim Lesen:
                        </h5>
                        <div class="reading-word text-2xl font-bold text-center mb-4 p-4 bg-white rounded border-2 border-yellow-300">
                            ${interactive.word}
                        </div>
                        <div class="reading-options grid grid-cols-2 gap-3">
                            ${interactive.options.map((option, index) => `
                                <button onclick="storyEngine.checkReading(${index}, '${interactive.correct}')" 
                                        class="reading-option bg-white hover:bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3 transition-all">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            
            default:
                return '';
        }
    }

    // Nächstes Kapitel laden
    nextChapter() {
        if (this.currentChapter < this.currentStory.chapters.length - 1) {
            this.currentChapter++;
            this.loadChapter(this.currentChapter);
        } else {
            this.completeStory();
        }
    }

    // Spezifisches Kapitel laden
    loadChapter(chapterIndex) {
        this.currentChapter = chapterIndex;
        const chapter = this.currentStory.chapters[chapterIndex];
        
        document.getElementById('chapter-content').innerHTML = this.renderChapter(chapter, chapterIndex);
        
        // Navigation Buttons aktualisieren
        document.querySelectorAll('.chapter-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === chapterIndex);
        });

        // Continue Button Text aktualisieren
        const continueBtn = document.getElementById('continue-btn');
        if (chapterIndex === this.currentStory.chapters.length - 1) {
            continueBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Geschichte beenden';
        } else {
            continueBtn.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>Weiter lesen';
        }

        // Auto-scroll zum neuen Kapitel
        document.getElementById('chapter-content').scrollIntoView({ behavior: 'smooth' });
    }

    // Audio-Funktionen
    toggleAudio() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        } else {
            this.readCurrentChapter();
        }
    }

    readCurrentChapter() {
        const chapter = this.currentStory.chapters[this.currentChapter];
        const text = chapter.content.replace(/\n/g, ' ');
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.9;
        
        this.speechSynthesis.speak(utterance);
    }

    // Interaktive Funktionen
    makeChoice(choiceIndex) {
        const interactive = this.currentStory.chapters[this.currentChapter].interactive;
        const choice = interactive.options[choiceIndex];
        
        // Visuelles Feedback
        document.querySelectorAll('.choice-btn').forEach((btn, index) => {
            if (index === choiceIndex) {
                btn.classList.add('bg-blue-200', 'border-blue-500');
                btn.disabled = true;
            } else {
                btn.classList.add('opacity-50');
                btn.disabled = true;
            }
        });

        // Feedback anzeigen
        setTimeout(() => {
            this.showChoiceFeedback(choice);
        }, 500);
    }

    showChoiceFeedback(choice) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'choice-feedback mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg';
        feedbackDiv.innerHTML = `
            <h6 class="font-bold text-green-700 mb-2">
                <i class="fas fa-comment mr-2"></i>
                ${choice.correct ? 'Richtig!' : 'Interessante Wahl!'}
            </h6>
            <p class="text-green-600">${choice.feedback}</p>
        `;
        
        document.querySelector('.interactive-choice').appendChild(feedbackDiv);
        
        if (choice.correct) {
            gameState.totalPoints += 5;
            updateProgressDisplay();
        }
    }

    checkReading(optionIndex, correctAnswer) {
        const buttons = document.querySelectorAll('.reading-option');
        const selectedButton = buttons[optionIndex];
        const selectedText = selectedButton.textContent.trim();
        
        buttons.forEach(btn => btn.disabled = true);
        
        if (selectedText === correctAnswer) {
            selectedButton.classList.add('bg-green-200', 'border-green-500');
            this.showReadingFeedback(true, 'Perfekt gelesen! 🎉');
            gameState.totalPoints += 10;
        } else {
            selectedButton.classList.add('bg-red-200', 'border-red-500');
            // Richtige Antwort hervorheben
            buttons.forEach(btn => {
                if (btn.textContent.trim() === correctAnswer) {
                    btn.classList.add('bg-green-200', 'border-green-500');
                }
            });
            this.showReadingFeedback(false, 'Nicht ganz richtig, aber du lernst dabei! 📚');
        }
        
        updateProgressDisplay();
    }

    showReadingFeedback(correct, message) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `reading-feedback mt-4 p-4 ${correct ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border-2 rounded-lg`;
        feedbackDiv.innerHTML = `
            <p class="${correct ? 'text-green-600' : 'text-blue-600'}">${message}</p>
        `;
        
        document.querySelector('.interactive-reading').appendChild(feedbackDiv);
    }

    // Charaktere anzeigen
    showCharacters() {
        const characters = this.currentStory.characters;
        const characterList = document.getElementById('character-list');
        
        characterList.innerHTML = characters.map(char => `
            <div class="character-card bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-3">
                    <img src="${char.image}" alt="${char.name}" 
                         class="w-16 h-16 rounded-full border-2 border-purple-300 mr-3">
                    <div>
                        <h5 class="font-bold text-purple-700">${char.name}</h5>
                        <p class="text-sm text-gray-600">${char.age}</p>
                    </div>
                </div>
                <p class="text-sm text-gray-700">${char.description}</p>
            </div>
        `).join('');
        
        document.getElementById('character-modal').classList.remove('hidden');
    }

    hideCharacters() {
        document.getElementById('character-modal').classList.add('hidden');
    }

    // Geschichte beenden
    completeStory() {
        const completionDiv = document.createElement('div');
        completionDiv.className = 'story-completion mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 text-center';
        completionDiv.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon mb-4">
                    <i class="fas fa-star text-5xl text-yellow-500"></i>
                </div>
                <h4 class="text-2xl font-bold text-purple-700 mb-3">Geschichte abgeschlossen!</h4>
                <p class="text-lg text-purple-600 mb-4">Du hast die heutige Geschichte erfolgreich gelesen!</p>
                <div class="story-rewards mb-4">
                    <span class="inline-block bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                        +20 Punkte für das Lesen!
                    </span>
                </div>
                <button onclick="storyEngine.showStorySummary()" 
                        class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mr-4">
                    <i class="fas fa-list mr-2"></i>Zusammenfassung
                </button>
                <button onclick="loadDailyGames()" 
                        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                    <i class="fas fa-gamepad mr-2"></i>Spiele spielen
                </button>
            </div>
        `;
        
        document.querySelector('.story-content').appendChild(completionDiv);
        
        // Punkte hinzufügen
        gameState.totalPoints += 20;
        updateProgressDisplay();
        
        // Witch Reaction
        setTimeout(() => {
            showWitchReaction('story');
        }, 1000);
    }

    showStorySummary() {
        const summary = this.currentStory.summary;
        alert(`Zusammenfassung: ${summary}`);
    }

    setupStoryListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextChapter();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (this.currentChapter > 0) {
                    this.loadChapter(this.currentChapter - 1);
                }
            }
        });
    }
}

// Globale Instanz
const storyEngine = new StoryEngine();