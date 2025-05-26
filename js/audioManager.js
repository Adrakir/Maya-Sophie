/**
 * AudioManager - Verwaltet Audio-Ausgabe und Sprachsynthese
 */
class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.7;
        this.speechRate = 0.9;
        this.speechPitch = 1.2;
        this.voiceName = null;
        this.audioContext = null;
        this.sounds = {};
        
        this.init();
    }

    init() {
        this.setupSpeechSynthesis();
        this.setupAudioContext();
        this.preloadSounds();
        this.setupEventListeners();
    }

    setupSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            
            // Warten auf verfügbare Stimmen
            const loadVoices = () => {
                const voices = this.speechSynthesis.getVoices();
                
                // Deutsche Stimme bevorzugen
                const germanVoices = voices.filter(voice => 
                    voice.lang.startsWith('de') || 
                    voice.name.toLowerCase().includes('german') ||
                    voice.name.toLowerCase().includes('deutsch')
                );
                
                if (germanVoices.length > 0) {
                    // Weibliche Stimme bevorzugen für Kinderspiel
                    const femaleVoice = germanVoices.find(voice => 
                        voice.name.toLowerCase().includes('female') ||
                        voice.name.toLowerCase().includes('anna') ||
                        voice.name.toLowerCase().includes('petra') ||
                        voice.name.toLowerCase().includes('marlene')
                    );
                    
                    this.voiceName = femaleVoice ? femaleVoice.name : germanVoices[0].name;
                }
                
                console.log('Verfügbare Stimmen:', voices.map(v => v.name));
                console.log('Gewählte Stimme:', this.voiceName);
            };

            if (this.speechSynthesis.getVoices().length !== 0) {
                loadVoices();
            } else {
                this.speechSynthesis.addEventListener('voiceschanged', loadVoices);
            }
        } else {
            console.warn('Speech Synthesis nicht unterstützt');
        }
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio Context nicht verfügbar:', error);
        }
    }

    preloadSounds() {
        // Vordefinierte Sound-Effekte
        this.soundEffects = {
            success: { frequency: 523.25, duration: 0.3, type: 'sine' }, // C5
            error: { frequency: 220, duration: 0.5, type: 'sawtooth' }, // A3
            click: { frequency: 440, duration: 0.1, type: 'square' }, // A4
            achievement: { frequency: [523.25, 659.25, 783.99], duration: 0.8, type: 'sine' }, // C5-E5-G5
            applause: { frequency: 'noise', duration: 1.0 },
            magic: { frequency: [400, 600, 800, 1000], duration: 1.5, type: 'sine' }
        };
    }

    setupEventListeners() {
        // Audio-Zustand von GameState synchronisieren
        if (window.gameState) {
            this.enabled = window.gameState.audioEnabled;
        }
    }

    // Sprachausgabe
    speak(text, options = {}) {
        if (!this.enabled || !this.speechSynthesis || !text) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                // Aktuelle Sprachausgabe stoppen
                this.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                
                // Stimme setzen
                const voices = this.speechSynthesis.getVoices();
                if (this.voiceName) {
                    const selectedVoice = voices.find(voice => voice.name === this.voiceName);
                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }
                }

                // Einstellungen
                utterance.rate = options.rate || this.speechRate;
                utterance.pitch = options.pitch || this.speechPitch;
                utterance.volume = (options.volume || this.volume) * (this.enabled ? 1 : 0);
                utterance.lang = options.lang || 'de-DE';

                // Event-Handler
                utterance.onend = () => resolve();
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    reject(event);
                };

                // Sprachausgabe starten
                this.speechSynthesis.speak(utterance);
                
                console.log('Spreche:', text);
            } catch (error) {
                console.error('Fehler bei Sprachausgabe:', error);
                reject(error);
            }
        });
    }

    // Buchstaben aussprechen
    speakLetter(letter, options = {}) {
        let text = letter;
        
        // Spezielle Aussprache für deutsche Buchstaben
        const pronunciations = {
            'A': 'Ah', 'Ä': 'Ä wie in Bär',
            'B': 'Beh', 'C': 'Tseh', 'D': 'Deh',
            'E': 'Eh', 'F': 'Eff', 'G': 'Geh',
            'H': 'Hah', 'I': 'Ih', 'J': 'Jot',
            'K': 'Kah', 'L': 'Ell', 'M': 'Emm',
            'N': 'Enn', 'O': 'Oh', 'Ö': 'Ö wie in Löwe',
            'P': 'Peh', 'Q': 'Kuh', 'R': 'Err',
            'S': 'Ess', 'T': 'Teh', 'U': 'Uh',
            'Ü': 'Ü wie in Tür', 'V': 'Fau', 'W': 'Weh',
            'X': 'Iks', 'Y': 'Ypsilon', 'Z': 'Tsett',
            'ß': 'Eszett'
        };

        if (pronunciations[letter.toUpperCase()]) {
            text = pronunciations[letter.toUpperCase()];
        }

        return this.speak(text, { ...options, rate: 0.7 });
    }

    // Wort aussprechen
    speakWord(word, options = {}) {
        // Langsamer für besseres Verständnis
        return this.speak(word, { ...options, rate: 0.8 });
    }

    // Satz aussprechen
    speakSentence(sentence, options = {}) {
        return this.speak(sentence, { ...options, rate: 0.9 });
    }

    // Ermutigung aussprechen
    speakEncouragement(type = 'success') {
        const encouragements = {
            success: [
                'Prima gemacht!', 'Super!', 'Sehr gut!', 'Toll!', 
                'Das war richtig!', 'Weiter so!', 'Klasse!', 'Perfekt!'
            ],
            error: [
                'Das war nicht ganz richtig.', 'Versuche es nochmal!', 
                'Nicht aufgeben!', 'Du schaffst das!', 'Probiere es noch einmal!'
            ],
            hint: [
                'Hier ist ein Hinweis:', 'Schau genau hin:', 
                'Denk daran:', 'Tipp:'
            ],
            achievement: [
                'Fantastisch!', 'Du bist ein Held!', 'Unglaublich gut!', 
                'Das war großartig!', 'Du bist ein echter Lesemeister!'
            ]
        };

        const messages = encouragements[type] || encouragements.success;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return this.speak(randomMessage, { pitch: 1.3, rate: 1.0 });
    }

    // Sound-Effekte
    playSound(soundName, options = {}) {
        if (!this.enabled || !this.audioContext || !this.soundEffects[soundName]) {
            return;
        }

        try {
            const sound = this.soundEffects[soundName];
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Lautstärke
            const volume = (options.volume || this.volume) * 0.3; // Leiser für Sound-Effekte
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);

            if (Array.isArray(sound.frequency)) {
                // Akkord oder Melodie
                sound.frequency.forEach((freq, index) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + (index * 0.1));
                    osc.type = sound.type || 'sine';
                    
                    gain.gain.setValueAtTime(volume / sound.frequency.length, this.audioContext.currentTime + (index * 0.1));
                    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
                    
                    osc.start(this.audioContext.currentTime + (index * 0.1));
                    osc.stop(this.audioContext.currentTime + sound.duration);
                });
            } else if (sound.frequency === 'noise') {
                // Weißes Rauschen für Applaus
                const bufferSize = this.audioContext.sampleRate * sound.duration;
                const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                const output = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                
                const noise = this.audioContext.createBufferSource();
                noise.buffer = buffer;
                noise.connect(gainNode);
                noise.start();
            } else {
                // Einzelner Ton
                oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
                oscillator.type = sound.type || 'sine';
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + sound.duration);
            }

            console.log('Sound gespielt:', soundName);
        } catch (error) {
            console.error('Fehler beim Abspielen des Sounds:', error);
        }
    }

    // Hintergrundmusik (vereinfacht)
    playBackgroundMusic(melody = 'happy') {
        if (!this.enabled || !this.audioContext) {
            return;
        }

        const melodies = {
            happy: [523, 587, 659, 698, 784, 880, 988, 1047], // C-Dur Tonleiter
            mysterious: [440, 466, 523, 554, 587, 622, 659, 698], // A-Moll
            victory: [523, 659, 784, 1047, 784, 659, 523] // C-Dur Akkord
        };

        const notes = melodies[melody] || melodies.happy;
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                if (this.enabled) {
                    this.playSound('click', { volume: 0.1 });
                }
            }, index * 500);
        });
    }

    // Einstellungen
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled && this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        
        if (window.gameState) {
            window.gameState.audioEnabled = enabled;
            window.gameState.saveToStorage();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setSpeechRate(rate) {
        this.speechRate = Math.max(0.1, Math.min(2, rate));
    }

    setSpeechPitch(pitch) {
        this.speechPitch = Math.max(0, Math.min(2, pitch));
    }

    // Utility-Methoden
    stopAllAudio() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }

    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Game-spezifische Audio-Methoden
    celebrateSuccess() {
        this.playSound('achievement');
        setTimeout(() => {
            this.speakEncouragement('success');
        }, 500);
    }

    indicateError() {
        this.playSound('error');
        setTimeout(() => {
            this.speakEncouragement('error');
        }, 300);
    }

    playClickSound() {
        this.playSound('click');
    }

    playMagicSound() {
        this.playSound('magic');
    }

    // Lernspiel-spezifische Methoden
    announceGameStart(gameName) {
        const announcement = `Willkommen zu ${gameName}! Viel Spaß beim Lernen!`;
        return this.speak(announcement, { pitch: 1.1, rate: 1.0 });
    }

    announceGameEnd(score) {
        let message = 'Spiel beendet! ';
        
        if (score >= 90) {
            message += 'Ausgezeichnet! Du bist ein wahrer Champion!';
        } else if (score >= 70) {
            message += 'Sehr gut gemacht! Du lernst schnell!';
        } else if (score >= 50) {
            message += 'Gut gemacht! Weiter so!';
        } else {
            message += 'Nicht aufgeben! Übung macht den Meister!';
        }
        
        return this.speak(message, { pitch: 1.2, rate: 0.9 });
    }

    provideFeedback(isCorrect, item = '') {
        if (isCorrect) {
            this.playSound('success');
            const feedback = item ? `Richtig! ${item}` : 'Richtig!';
            return this.speak(feedback, { pitch: 1.3, rate: 1.1 });
        } else {
            this.playSound('error');
            const feedback = 'Das war nicht richtig. Versuche es noch einmal!';
            return this.speak(feedback, { pitch: 1.0, rate: 0.9 });
        }
    }

    // Debugging
    testAudio() {
        console.log('Audio-Test gestartet...');
        
        this.speak('Hallo! Das ist ein Test der Sprachausgabe.').then(() => {
            this.playSound('success');
            setTimeout(() => {
                this.speakLetter('A');
            }, 1000);
            setTimeout(() => {
                this.celebrateSuccess();
            }, 2000);
        });
    }
}

// Globale Instanz erstellen
window.audioManager = new AudioManager();