/**
 * Manager für interaktive Geschichten mit Entscheidungen
 * Erweitert die normalen Tagesgeschichten um Spieler-Entscheidungen
 */

class InteractiveStoryManager {
    constructor() {
        this.currentPath = [];
        this.storyState = {};
        this.achievements = [];
    }

    // Spezielle interaktive Geschichten für bestimmte Tage
    loadInteractiveStory(day, container) {
        const storyData = INTERACTIVE_STORIES[day];
        if (!storyData) {
            console.log(`No interactive story for day ${day}, using regular story`);
            storyEngine.loadDailyStory(day, container);
            return;
        }

        this.currentStory = storyData;
        this.currentNode = 'start';
        this.storyState = {};
        this.currentPath = [];
        
        this.renderInteractiveNode(container, storyData.nodes[this.currentNode]);
    }

    renderInteractiveNode(container, node) {
        container.innerHTML = `
            <div class="interactive-story-container">
                <div class="story-progress mb-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-purple-700">${this.currentStory.title}</h3>
                        <div class="progress-dots flex space-x-2">
                            ${this.currentPath.map((_, index) => `
                                <div class="w-3 h-3 rounded-full bg-purple-400"></div>
                            `).join('')}
                            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
                        </div>
                    </div>
                </div>

                ${node.image ? `
                    <div class="story-scene mb-6">
                        <img src="${node.image}" alt="Story Scene" 
                             class="w-full max-w-lg mx-auto rounded-lg shadow-lg">
                    </div>
                ` : ''}

                <div class="story-text bg-blue-50 p-6 rounded-lg shadow-inner mb-6">
                    ${node.text.split('\n').map(paragraph => 
                        `<p class="mb-4 text-lg leading-relaxed">${paragraph}</p>`
                    ).join('')}
                </div>

                ${node.choices ? this.renderChoices(node.choices) : ''}
                
                ${node.minigame ? this.renderMinigame(node.minigame) : ''}
                
                ${node.ending ? this.renderEnding(node) : ''}
            </div>
        `;
    }

    renderChoices(choices) {
        return `
            <div class="story-choices">
                <h4 class="text-lg font-semibold text-blue-700 mb-4">Was soll passieren?</h4>
                <div class="choices-grid grid gap-3">
                    ${choices.map((choice, index) => `
                        <button onclick="interactiveStoryManager.makeChoice(${index})" 
                                class="choice-option bg-white hover:bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-left transition-all transform hover:scale-105 ${choice.locked ? 'opacity-50 cursor-not-allowed' : ''}">
                            <div class="flex items-start">
                                <div class="choice-icon mr-3 text-2xl">
                                    ${choice.icon || '🤔'}
                                </div>
                                <div>
                                    <div class="choice-title font-semibold text-blue-800">${choice.title}</div>
                                    <div class="choice-description text-sm text-blue-600 mt-1">${choice.description}</div>
                                    ${choice.requirement ? `
                                        <div class="choice-requirement text-xs text-gray-500 mt-2">
                                            Benötigt: ${choice.requirement}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderMinigame(minigame) {
        switch(minigame.type) {
            case 'wor