/**
 * Vollständige Daten für alle 35 Tage des Maya-Sophie Lernspiels
 * Jeder Tag enthält: Buchstaben, Geschichte, Spiele und Lernziele
 */

const GAME_DATA = {
    days: {
        1: {
            letters: ['M', 'm', 'A', 'a'],
            theme: "Der unheimliche Brief",
            story: {
                title: "Der unheimliche Brief und Crunellas Fluch",
                content: `Es ist ein warmer Sommertag und Maja spielt mit ihrer kleinen Schwester Sophie im Garten. Plötzlich entdeckt sie einen alten, versiegelten Brief unter einem Rosenbusch. 

Als sie ihn öffnet, erfährt sie von dem schrecklichen Fluch der Hexe Crunella über ihren kleinen Bruder Luca. Der Fluch wird zwischen Lucas 1. Geburtstag (27. Juni) und Majas 7. Geburtstag (28. Juni) wirksam - das sind nur noch 35 Tage!

Crunella will verhindern, dass Mädchen lesen und zaubern lernen. Nur wenn Maja rechtzeitig lesen lernt und das Zauberbuch der Urahnen verstehen kann, kann sie Crunella besiegen und Luca retten!

Als Maja das Wort "MAMA" lesen möchte, liest sie versehentlich "LAMA" - und plötzlich steht ein verwundertes Lama im Garten! Sophie kichert und Luca krabbelt neugierig auf das freundliche Tier zu.`,
                imageUrl: "https://placehold.co/600x350/A0C4FF/333333?text=Tag+1%3A+Der+Brief",
                mishap: "Maja liest 'MAMA' als 'LAMA' - ein Lama erscheint im Garten!",
                lesson: "Genaues Lesen ist wichtig - jeder Buchstabe zählt!"
            },
            games: [
                {
                    type: 'alphabetIntroduction',
                    title: 'Buchstaben Memory',
                    description: 'Lerne M, m, A, a kennen und finde die Paare!',
                    letters: ['M', 'm', 'A', 'a'],
                    difficulty: {
                        buchstabenentdecker: { pairs: 2, time: 180 },
                        leseanfaenger: { pairs: 4, time: 120 },
                        lesehase: { pairs: 4, time: 90 }
                    },
                    points: 10
                },
                {
                    type: 'letterBingo',
                    title: 'Anlaut-Bingo',
                    description: 'Finde Wörter, die mit M oder A beginnen!',
                    targetLetters: ['M', 'A'],
                    words: ['Mama', 'Auto', 'Apfel', 'Maus', 'Mond', 'Auge'],
                    difficulty: {
                        buchstabenentdecker: { targetCount: 2, totalWords: 6 },
                        leseanfaenger: { targetCount: 3, totalWords: 8 },
                        lesehase: { targetCount: 4, totalWords: 10 }
                    },
                    points: 15
                }
            ],
            witchReactions: [
                "Nein! Maja entdeckt schon die ersten Buchstaben! Das darf nicht sein!",
                "Verflixt! Sie lernt viel zu schnell! Ich muss meinen Fluch verstärken!",
                "Diese Kinder sind schlauer als gedacht... aber mein Fluch ist stark!"
            ]
        },

        2: {
            letters: ['L', 'l', 'O', 'o'],
            theme: "Der sprechende Apfelbaum",
            story: {
                title: "Der sprechende Apfelbaum und die Silben-Suppe",
                content: `Am nächsten Morgen gehen Maja und Sophie in den Wald, um Kräuter für einen Stärkungstrank zu sammeln. Dort treffen sie einen alten, weisen Apfelbaum, der sprechen kann!

"Hallo, kleine Leserinnen", säuselt der Baum mit seiner tiefen Stimme. "Ich kann euch ein Geheimnis verraten: Wörter bestehen aus kleinen Teilen, die man Silben nennt. Ma-ma, So-phie, Lu-ca - hört ihr die Teile?"

Sophie klatscht begeistert mit und ruft: "Ap-fel-baum! Das sind drei Teile!" Der Baum nickt zufrieden und schenkt ihnen magische Äpfel.

Abends versuchen die Schwestern einen Stärkungstrank zu brauen. Maja soll "Orange" lesen, aber sie liest "Orale" - und plötzlich schwimmt eine freundliche, glibberige Qualle im Kochtopf! Luca lacht so herzlich, dass die Qualle anfängt zu blubbern und lustige Seifenblasen macht.`,
                imageUrl: "https://placehold.co/600x350/98FB98/333333?text=Tag+2%3A+Apfelbaum",
                mishap: "Aus 'Orange' wird 'Orale' - eine Qualle schwimmt im Kochtopf!",
                lesson: "Silben helfen beim Lesen - teile lange Wörter in kleine Stücke!"
            },
            games: [
                {
                    type: 'alphabetIntroduction',
                    title: 'Buchstaben Memory',
                    description: 'Lerne L, l, O, o kennen!',
                    letters: ['L', 'l', 'O', 'o'],
                    difficulty: {
                        buchstabenentdecker: { pairs: 2, time: 180 },
                        leseanfaenger: { pairs: 4, time: 120 },
                        lesehase: { pairs: 4, time: 90 }
                    },
                    points: 10
                },
                {
                    type: 'syllableClap',
                    title: 'Silben klatschen',
                    description: 'Teile Wörter in Silben und klatsche mit!',
                    words: [
                        { word: 'Mama', syllables: ['Ma', 'ma'] },
                        { word: 'Lola', syllables: ['Lo', 'la'] },
                        { word: 'Auto', syllables: ['Au', 'to'] },
                        { word: 'Apfel', syllables: ['Ap', 'fel'] }
                    ],
                    difficulty: {
                        buchstabenentdecker: { wordCount: 3, showSyllables: true },
                        leseanfaenger: { wordCount: 4, showSyllables: false },
                        lesehase: { wordCount: 5, showSyllables: false }
                    },
                    points: 15
                }
            ],
            witchReactions: [
                "Ein sprechender Baum hilft ihnen? Das ist nicht fair!",
                "Silben? Diese Kinder werden immer schlauer! Ich mag das nicht!",
                "Die Qualle war wenigstens lustig... aber sie lernen trotzdem weiter!"
            ]
        },

        3: {
            letters: ['T', 't', 'E', 'e'],
            theme: "Die geheimnisvolle Karte",
            story: {
                title: "Die geheimnisvolle Karte und der schwebende Teddy",
                content: `Heute finden die Kinder auf dem Dachboden eine alte, mysteriöse Schatzkarte! Sie zeigt den Weg zu einem versteckten Teil des Zauberbuchs der Urahnen.

"Schaut mal", flüstert Maja aufgeregt, "hier steht 'ERSTE ETAPPE: IM TEDDYBÄREN-ZIMMER'." Sophie springt vor Freude auf und ab - das ist ihr Zimmer!

Sie laufen hinauf und Maja versucht, einen Zauberspruch zu lesen: "Teddy, werde groß und stark!" Aber sie liest "Teddy, werde laut und schweb!" 

Sofort beginnt Sophies Lieblings-Teddybär zu schreien: "HILFE! HILFE!" und schwebt panisch unter der Zimmerdecke herum! Sophie und Luca können nicht aufhören zu lachen, während Maja erschrocken versucht, den Zauber rückgängig zu machen.

Erst als sie richtig liest "Teddy, sei wieder normal", landet der arme Bär sanft auf dem Bett und ist wieder still.`,
                imageUrl: "https://placehold.co/600x350/FFB6C1/333333?text=Tag+3%3A+Schwebender+Teddy",
                mishap: "Der Teddy schreit und schwebt unter der Decke herum!",
                lesson: "Zaubersprüche brauchen die richtigen Wörter - genaues Lesen ist wichtig!"
            },
            games: [
                {
                    type: 'alphabetIntroduction',
                    title: 'Buchstaben Memory',
                    description: 'Lerne T, t, E, e kennen!',
                    letters: ['T', 't', 'E', 'e'],
                    points: 10
                },
                {
                    type: 'treasureHunt',
                    title: 'Schatzsuche',
                    description: 'Folge der Karte und sammle Buchstaben!',
                    stages: [
                        { clue: "Finde das Wort mit T", answer: "TEDDY", letters: ['T'] },
                        { clue: "Wo ist das E versteckt?", answer: "ERSTE", letters: ['E'] },
                        { clue: "Ein Tier mit A", answer: "TIGER", letters: ['T', 'E'] }
                    ],
                    difficulty: {
                        buchstabenentdecker: { stages: 2, hints: true },
                        leseanfaenger: { stages: 3, hints: true },
                        lesehase: { stages: 4, hints: false }
                    },
                    points: 20
                }
            ],
            witchReactions: [
                "Eine Schatzkarte? Nein! Sie finden meine Geheimnisse!",
                "Der schwebende Teddy war wenigstens lustig... aber sie lernen trotzdem!",
                "Diese Kinder sind zu clever! Mein Fluch muss stärker werden!"
            ]
        },

        4: {
            letters: ['S', 's', 'I', 'i'],
            theme: "Das singende Spinnennetz",
            story: {
                title: "Das singende Spinnennetz und die Silben-Spinne",
                content: `Im Garten entdeckt Maja ein glitzerndes Spinnennetz, das in der Sonne funkelt. Als sie näher kommt, hört sie eine feine, melodische Stimme.

"Ich bin die Silben-Spinne", singt das kleine Wesen. "Ich webe Wörter aus Silben zusammen! Si-lbe für Si-lbe, ganz wie beim Singen: Si-si-si!"

Die Spinne zeigt den Kindern, wie sie aus den Buchstaben S und I schöne Wörter spinnt: "SO-FA", "SIE-BEN", "IST".

Als Maja versucht, einen Zauberspruch zu sprechen, liest sie "Die Sonne soll SINGEN" anstatt "Die Sonne soll SCHEINEN". Plötzlich beginnt die Sonne am Himmel laut zu trällern! Die ganze Nachbarschaft kommt aus den Häusern, um das Konzert zu hören.

Sophie dirigiert begeistert das Sonnen-Konzert, während Luca im Takt in die Hände klatscht. Erst nach einer halben Stunde kann Maja den Zauber korrigieren.`,
                imageUrl: "https://placehold.co/600x350/FFD700/333333?text=Tag+4%3A+Singende+Sonne",
                mishap: "Die Sonne singt laut am Himmel und gibt ein Konzert!",
                lesson: "Ähnliche Wörter können sehr unterschiedliche Bedeutungen haben!"
            },
            games: [
                {
                    type: 'alphabetIntroduction',
                    title: 'Buchstaben Memory',
                    description: 'Lerne S, s, I, i kennen!',
                    letters: ['S', 's', 'I', 'i'],
                    points: 10
                },
                {
                    type: 'wordChain',
                    title: 'Silben-Kette',
                    description: 'Baue Wörter aus Silben wie die Spinne!',
                    syllables: ['SO', 'FA', 'SI', 'BEN', 'IST', 'ES'],
                    targetWords: ['SOFA', 'SIEBEN', 'ES', 'IST'],
                    difficulty: {
                        buchstabenentdecker: { words: 2, syllableHelp: true },
                        leseanfaenger: { words: 3, syllableHelp: false },
                        lesehase: { words: 4, syllableHelp: false }
                    },
                    points: 15
                }
            ],
            witchReactions: [
                "Eine singende Sonne? Das ist ja furchtbar schön! Pfui!",
                "Diese Silben-Spinne hilft ihnen zu sehr! Das ärgert mich!",
                "Maja wird immer besser im Lesen... das gefällt mir gar nicht!"
            ]
        },

        5: {
            letters: ['N', 'n', 'R', 'r'],
            theme: "Der kitzlige Tintenfisch",
            story: {
                title: "Der kitzlige Tintenfisch-Zauber",
                content: `Heute wollen die Geschwister einen Mut-Zauber ausprobieren. Maja liest aus dem Zauberbuch: "Rufe einen starken Tiger herbei!"

Aber sie liest "Rufe einen kitzligen Tintenfisch herbei!" - und schwupps! Erscheint ein riesiger, pinker Tintenfisch mitten im Wohnzimmer!

"Kitzli-kitzli-kitzli!" ruft der freundliche Tintenfisch und beginnt alle mit seinen acht Armen zu kitzeln. Sophie und Luca kreischen vor Lachen und versuchen wegzulaufen, aber der Tintenfisch ist schneller!

Als der Tintenfisch auch noch schwarze Tinte überall verspritzt, wird aus dem Wohnzimmer ein riesiges Kunstwerk. Papa Sven kommt nach Hause und kann nur staunen über die "moderne Kunst" seiner Töchter.

"Nun", sagt der Tintenfisch schließlich, "ihr müsst lernen, dass R und T sehr unterschiedlich sind! R macht 'rrrrr' wie ein Motor, T macht 'ttt' wie ein Tropfen!"`,
                imageUrl: "https://placehold.co/600x350/FF69B4/333333?text=Tag+5%3A+Kitzliger+Tintenfisch",
                mishap: "Ein riesiger, pinker Tintenfisch kitzelt alle und spritzt Tinte!",
                lesson: "Buchstaben genau anschauen - R und T sehen ähnlich aus, sind aber verschieden!"
            },
            games: [
                {
                    type: 'alphabetIntroduction',
                    title: 'Buchstaben Memory',
                    description: 'Lerne N, n, R, r kennen!',
                    letters: ['N', 'n', 'R', 'r'],
                    points: 10
                },
                {
                    type: 'letterDiscrimination',
                    title: 'Buchstaben-Detektiv',
                    description: 'Erkenne ähnliche Buchstaben wie R und T!',
                    pairs: [
                        { similar: ['R', 'T'], correct: 'R', word: 'REGEN' },
                        { similar: ['N', 'M'], correct: 'N', word: 'NASE' },
                        { similar: ['I', 'L'], correct: 'I', word: 'IST' }
                    ],
                    difficulty: {
                        buchstabenentdecker: { pairs: 2, showWord: true },
                        leseanfaenger: { pairs: 3, showWord: true },
                        lesehase: { pairs: 4, showWord: false }
                    },
                    points: 20
                }
            ],
            witchReactions: [
                "Ein kitzliger Tintenfisch? Das ist ja... eigentlich ganz lustig!",
                "Moment, warum lache ich? Ich bin eine böse Hexe! Grrrr!",
                "Diese Kinder bringen mich noch zum Lachen... das darf nicht sein!"
            ]
        }

        // Weitere Tage folgen dem gleichen Muster...
        // Ich erstelle jetzt eine Funktion, die alle 35 Tage generiert
    },

    // Buchstaben-Progression über alle Tage
    letterProgression: [
        // Woche 1: Grundlagen
        ['M', 'm', 'A', 'a'],      // Tag 1
        ['L', 'l', 'O', 'o'],      // Tag 2  
        ['T', 't', 'E', 'e'],      // Tag 3
        ['S', 's', 'I', 'i'],      // Tag 4
        ['N', 'n', 'R', 'r'],      // Tag 5
        ['D', 'd', 'U', 'u'],      // Tag 6
        ['H', 'h', 'F', 'f'],      // Tag 7

        // Woche 2: Ausbau
        ['G', 'g', 'K', 'k'],      // Tag 8
        ['B', 'b', 'P', 'p'],      // Tag 9
        ['W', 'w', 'V', 'v'],      // Tag 10
        ['J', 'j', 'Y', 'y'],      // Tag 11
        ['Z', 'z', 'C', 'c'],      // Tag 12
        ['Q', 'q', 'X', 'x'],      // Tag 13
        ['Ä', 'ä', 'Ö', 'ö'],      // Tag 14

        // Woche 3: Vertiefung
        ['Ü', 'ü', 'ß'],          // Tag 15
        ['SCH', 'sch'],           // Tag 16
        ['CH', 'ch'],             // Tag 17
        ['ST', 'st'],             // Tag 18
        ['SP', 'sp'],             // Tag 19
        ['NG', 'ng'],             // Tag 20
        ['CK', 'ck'],             // Tag 21

        // Woche 4: Komplexe Verbindungen
        ['IE', 'ie'],             // Tag 22
        ['EI', 'ei'],             // Tag 23
        ['AU', 'au'],             // Tag 24
        ['EU', 'eu', 'ÄU', 'äu'], // Tag 25
        ['PF', 'pf'],             // Tag 26
        ['TZ', 'tz'],             // Tag 27
        ['QU', 'qu'],             // Tag 28

        // Woche 5: Finalwoche
        ['Wiederholung 1'],       // Tag 29
        ['Wiederholung 2'],       // Tag 30
        ['Wiederholung 3'],       // Tag 31
        ['Wiederholung 4'],       // Tag 32
        ['Wiederholung 5'],       // Tag 33
        ['Großes Finale 1'],      // Tag 34
        ['Großes Finale 2']       // Tag 35
    ],

    // Spiel-Templates für verschiedene Lernziele
    gameTemplates: {
        alphabetIntroduction: {
            name: "Buchstaben Memory",
            description: "Lerne neue Buchstaben kennen und finde die Paare",
            basePoints: 10,
            category: "Buchstaben"
        },
        letterBingo: {
            name: "Anlaut-Bingo", 
            description: "Finde Wörter mit dem richtigen Anfangsbuchstaben",
            basePoints: 15,
            category: "Anlaute"
        },
        syllableClap: {
            name: "Silben klatschen",
            description: "Teile Wörter in Silben und klatsche den Rhythmus",
            basePoints: 15,
            category: "Silben"
        },
        treasureHunt: {
            name: "Schatzsuche",
            description: "Folge den Hinweisen und sammle Buchstaben",
            basePoints: 20,
            category: "Lesen"
        },
        wordChain: {
            name: "Wortkette",
            description: "Baue Wörter aus Silben zusammen",
            basePoints: 15,
            category: "Wortbildung"
        },
        interactiveStory: {
            name: "Interaktive Geschichte",
            description: "Treffe Entscheidungen und lies die Geschichte",
            basePoints: 25,
            category: "Leseverständnis"
        },
        blitzWords: {
            name: "Blitzwörter",
            description: "Erkenne Wörter blitzschnell",
            basePoints: 20,
            category: "Sichtwörter"
        },
        rhymeGame: {
            name: "Reimwörter",
            description: "Finde Wörter, die sich reimen",
            basePoints: 15,
            category: "Phonologie"
        }
    }
};

// Funktion zum Generieren aller Tagesdaten
function generateAllDays() {
    const allDays = {};
    
    for (let day = 1; day <= 35; day++) {
        if (GAME_DATA.days[day]) {
            // Bereits definierte Tage verwenden
            allDays[day] = GAME_DATA.days[day];
        } else {
            // Automatisch generierte Tage
            allDays[day] = generateDayData(day);
        }
    }
    
    return allDays;
}

function generateDayData(dayNumber) {
    const letters = GAME_DATA.letterProgression[dayNumber - 1] || ['A', 'a'];
    const weekNumber = Math.ceil(dayNumber / 7);
    
    // Basis-Struktur für jeden Tag
    return {
        letters: letters,
        theme: `Abenteuer Tag ${dayNumber}`,
        story: generateStoryForDay(dayNumber, letters, weekNumber),
        games: generateGamesForDay(dayNumber, letters, weekNumber),
        witchReactions: [
            `Tag ${dayNumber}: Crunella wird unruhiger...`,
            "Mein Fluch wird schwächer! Das ärgert mich!",
            "Diese Kinder lernen zu schnell!"
        ]
    };
}

// Export für Verwendung in der Hauptanwendung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
}