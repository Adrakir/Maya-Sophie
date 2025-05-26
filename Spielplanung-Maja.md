# **Detaillierte Spieldokumentation (Auszug)**

## **"Maja, Sophie & der Fluch der Hexe Crunella" (Version 17\)**

Diese Dokumentation ergänzt die übergeordnete Struktur einer Abschlussarbeit und beschreibt detailliert die Inhalte und Mechaniken der implementierten Spieltage, Spielmodule und interaktiven Geschichten.

**Anhang A: Tagesübersicht und Lerninhalte (Beispiele)**

### **Tag 1:**

* **Lernfokus (Buchstaben/Laute):** M, m, A, a  
* **Tagesgeschichte:**  
  * *Titel:* Der unheimliche Brief und Crunellas Fluch  
  * *Zusammenfassung:* Maja findet einen Brief, der Lucas Fluch durch Hexe Crunella enthüllt. Der Fluch wird zwischen Lucas 1\. Geburtstag (27. Juni) und Majas 7\. Geburtstag (28. Juni) wirksam (in 35 Tagen). Crunella will verhindern, dass Mädchen lesen und zaubern lernen. Lucas Liebe verstärkt die Zauberkraft der Schwestern. Die drei Kinder müssen gemeinsam das Zauberbuch der Urahnen finden/verstehen, um Crunella in ein Schulheft zu verbannen.  
  * *Missgeschick:* Maja liest "Mama" als "Lama", ein Lama erscheint kurz.  
  * *Bild-Prompt (für storyImageUrl):* "Maja liest erschrocken einen alten Brief, Sophie und Baby Luca schauen besorgt zu. Im Hintergrund eine düstere Andeutung von Hexe Crunella. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/A0C4FF/333333?text=Maja+liest+Brief%0ASophie+und+Luca+daneben)  
* **Verfügbare Spiele an diesem Tag:**  
  1. **Spiel:** alphabetIntroduction (Buchstaben kennenlernen & Memory)  
     * *Beschreibung:* Visuelle und auditive Einführung der Buchstaben M/m und A/a, gefolgt von einem Memory-Spiel.  
     * *Lernziel:* Buchstabenerkennung, Laut-Buchstaben-Zuordnung.  
     * *Spezifische Inhalte:* Buchstaben M, m, A, a. Memory mit Paaren M/m, A/a und Bildern/Wörtern wie "Mama", "Auto" (je nach Verfügbarkeit im Memory-Pool für diese Buchstaben).  
  2. **Spiel:** letterBingo (Buchstaben-Bingo)  
     * *Beschreibung:* Wörter/Bilder finden, die mit M oder A beginnen.  
     * *Lernziel:* Anlauterkennung, Wortschatzerweiterung.  
     * *Spezifische Inhalte:* Zielbuchstaben M oder A. Wortauswahl aus allBingoWords, die mit M oder A beginnen (z.B. Mama, Auto, Apfel, Maus).

### **Tag 2:**

* **Lernfokus (Buchstaben/Laute):** L, l, O, o  
* **Tagesgeschichte:**  
  * *Titel:* Der sprechende Apfelbaum und die Silben-Suppe  
  * *Zusammenfassung:* Die Kinder treffen einen sprechenden Apfelbaum, der die Bedeutung von Silben erklärt. Abends versuchen Maja und Sophie einen Stärkungstrank zu brauen. Maja liest "Orange" als "Orale", und eine Qualle erscheint. Lucas Lachen mildert den Zauber.  
  * *Missgeschick:* Orangentrank wird zu Quallen-Suppe.  
  * *Bild-Prompt:* "Maja und Sophie in der Küche vor einem blubbernden Topf, aus dem eine lustige Qualle schaut. Baby Luca lacht im Hintergrund. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/90EE90/333333?text=Maja+&+Sophie+kochen%0ALuca+lacht+über+Qualle)  
* **Verfügbare Spiele an diesem Tag:**  
  1. **Spiel:** alphabetIntroduction (Buchstaben kennenlernen & Memory)  
     * *Spezifische Inhalte:* Buchstaben L, l, O, o. Memory mit L/l, O/o und Bildern/Wörtern wie "Lama", "Oma", "Ofen".  
  2. **Spiel:** syllableClap (Silben-Klatschen)  
     * *Beschreibung:* Wörter in Silben zerlegen und die Silben in richtiger Reihenfolge anklicken.  
     * *Lernziel:* Silbenbewusstsein, Wortstruktur.  
     * *Spezifische Inhalte:* Wörter wie "Ma-ma", "La-ma", "O-ma", "Au-to" (sofern alle Buchstaben bekannt).

### **Tag 3:**

* **Lernfokus (Buchstaben/Laute):** S, s, R, r  
* **Tagesgeschichte:**  
  * *Titel:* Die geheimnisvolle Karte und der schwebende Teddy  
  * *Zusammenfassung:* Der Apfelbaum gibt den Kindern eine Schatzkarte zum Zauberbuch. Maja will Lucas Teddy mit "SCHWEB\!" tanzen lassen, liest aber "SCHREI\!". Der Teddy kreischt und schwebt, bis Lucas Lachen ihn sanft herunterholt.  
  * *Missgeschick:* Teddy schreit und schwebt unkontrolliert.  
  * *Bild-Prompt:* "Maja und Sophie im Kinderzimmer, ein Teddybär schwebt kreischend an der Decke. Baby Luca sitzt am Boden und lacht. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/FFE4B5/333333?text=Maja+hält+Schatzkarte+hoch%0ALuca+mit+schwebendem+Teddy)  
* **Verfügbare Spiele an diesem Tag:**  
  1. **Spiel:** alphabetIntroduction (Buchstaben kennenlernen & Memory)  
     * *Spezifische Inhalte:* Buchstaben S, s, R, r. Memory mit S/s, R/r und Bildern/Wörtern wie "Sonne", "Rose", "Salat".  
  2. **Spiel:** treasureHunt (Schatzsuche \- Teil 1\)  
     * *Beschreibung:* Die erste Etappe der 20-teiligen Schatzsuche beginnt. Hinweise müssen gelesen werden.  
     * *Lernziel:* Sinnerfassendes Lesen, Logik.

## ***(Weitere Tage bis Tag 34 würden analog dokumentiert werden)***

**Anhang B: Spieldokumentation (Beispiele)**

### **Spielmodul: Game\_AlphabetIntroduction.js**

* **Beschreibung:** Dient der Einführung neuer Buchstaben des Tages. Besteht aus einer Präsentationsphase und einem anschließenden Memory-Spiel zur Festigung.  
* **Lernziele:**  
  * Visuelle und auditive Erkennung neuer Groß- und Kleinbuchstaben.  
  * Korrekte Laut-Buchstaben-Zuordnung.  
  * Gedächtnistraining und Konzentration durch Memory.  
* **Mechanik:**  
  1. **Buchstabenpräsentation:** Die lettersToLearnThisDay werden einzeln angezeigt (Groß- und Kleinbuchstabe). Der Buchstabe und sein Laut werden vorgelesen (AudioManager.speak). Spieler können vor- und zurückblättern.  
  2. **Memory-Spiel (optional startbar):**  
     * Nach der Präsentation kann ein Memory-Spiel gestartet werden.  
     * **Varianten (zufällig gewählt):**  
       * *Buchstabenpaare:* Karten zeigen Groß- und Kleinbuchstaben der Tagesbuchstaben (z.B. M \+ m).  
       * *Bild-Wort-Paare:* Karten zeigen ein Bild (Emoji) und das dazugehörige Wort. Das Wort beginnt mit einem der Tagesbuchstaben und verwendet idealerweise nur bereits bekannte Buchstaben.  
     * **Ablauf:** Standard-Memory. Zwei Karten werden umgedreht. Bei einem Paar bleiben sie aufgedeckt. Bei keinem Paar drehen sie sich nach kurzer Zeit wieder um. Das Spiel endet, wenn alle Paare gefunden sind.  
* **Datenstruktur in ContentData.js (pro Tag):**  
  * lettersToLearnThisDay: Array von Buchstaben (z.B. \['M', 'm', 'A', 'a'\]).  
  * memoryLetterPairs (generiert aus lettersToLearnThisDay im Spielmodul oder optional vordefiniert).  
  * memoryImageWordPairs (eine Auswahl passender Wörter aus allBingoWords wird im Spielmodul basierend auf lettersToLearnThisDay und lettersLearnedSoFar getroffen).  
* **Schwierigkeitsanpassung (gameState.difficulty):**  
  * entdecker: Weniger neue Buchstaben auf einmal in der Präsentationsphase. Memory mit weniger Paaren.  
  * anfaenger: Standardanzahl.  
  * hase: Ggf. mehr Memory-Paare oder komplexere Wörter in der Bild-Wort-Variante.  
* **Feedback:** Akustisches Feedback für das Umdrehen von Karten und das Finden von Paaren. Visuelle Hervorhebung gefundener Paare.

### **Spielmodul: Game\_LetterBingo.js**

* **Beschreibung:** Ein Bingo-Spiel, bei dem Wörter oder Bilder gefunden werden müssen, die mit einem vorgegebenen Zielbuchstaben beginnen.  
* **Lernziele:**  
  * Festigung der Anlauterkennung.  
  * Verbindung von Laut und Schriftbild.  
  * Erweiterung des Sichtwortschatzes.  
* **Mechanik:**  
  1. Ein Zielbuchstabe (Anlaut) wird angezeigt und vorgelesen.  
  2. Ein Raster von 6-9 Feldern wird angezeigt. Jedes Feld enthält ein Wort (für Maja) oder ein Bild (für Sophie-Modus oder jüngere Spieler).  
  3. Der Spieler klickt auf die Felder, deren Wörter/Bilder mit dem Zielbuchstaben beginnen.  
  4. Richtige Auswahl wird markiert. Falsche Auswahl gibt kurzes negatives Feedback.  
  5. Das Spiel endet, wenn alle korrekten Felder gefunden wurden oder eine bestimmte Anzahl von Versuchen/Zeit abgelaufen ist (aktuell: alle korrekten finden).  
* **Datenstruktur in ContentData.js (pro Tag):**  
  * targetLetters: Array von möglichen Zielbuchstaben (oft die lettersToLearnThisDay).  
  * words: Eine Auswahl von Objekten aus allBingoWords, die dem aktuellen Lernstand entsprechen. Jedes Objekt: { word: "Mama", image: "👩‍👧‍👦", startsWith: "M" }.  
* **Schwierigkeitsanpassung:**  
  * entdecker: Weniger Ablenker-Wörter, deutlichere Bilder.  
  * anfaenger: Standard.  
  * hase: Mehr Wörter im Raster, ähnlich klingende Ablenker, Wörter mit dem Zielbuchstaben an anderer Position.  
* **Feedback:** Visuelle Markierung korrekter/falscher Klicks. Akustisches Feedback. Erfolgsmeldung bei Abschluss.

### **Spielmodul: Game\_InteractiveStory.js**

* **Beschreibung:** Ermöglicht das Durchspielen einer verzweigten Geschichte, bei der der Spieler an bestimmten Punkten Entscheidungen trifft, die den weiteren Verlauf beeinflussen.  
* **Lernziele:**  
  * Sinnerfassendes Lesen von längeren Textabschnitten.  
  * Verständnis von Handlungsabläufen.  
  * Förderung der Entscheidungsfindung und des kritischen Denkens.  
  * Wortschatzerweiterung im Kontext.  
* **Mechanik:**  
  1. Die Geschichte wird szenenweise präsentiert. Jede Szene besteht aus einem erzählenden Text und einer Illustration (Platzhalter).  
  2. Am Ende vieler Szenen werden dem Spieler 2-3 Handlungsoptionen als Buttons angeboten.  
  3. Die Auswahl einer Option führt zur nächsten Szene.  
  4. Manche Entscheidungen können zu "richtigen" Fortführungen, lustigen Sackgassen oder alternativen Wegen führen.  
  5. Am Ende der Geschichte kann ein Quiz zum Inhalt folgen.  
* **Datenstruktur in ContentData.js (unter interactiveStories.\<storyId\>):**  
  * title: Titel der Geschichte.  
  * startSceneId: ID der ersten Szene.  
  * scenes: Ein Objekt, das alle Szenen enthält. Jede Szene (\<sceneId\>):  
    * text: Der Text der Szene.  
    * storyImageUrl: URL zum Bild der Szene.  
    * options: Array von Optionsobjekten. Jedes Optionsobjekt:  
      * text: Text des Auswahlbuttons.  
      * nextSceneId: ID der Folgeszene (kann null sein für ein Ende).  
      * feedback (optional): Kurze Rückmeldung auf die Wahl.  
      * award (optional): Gegenstand oder Information, die der Spieler erhält.  
    * isEnd (optional, boolean): Markiert eine Szene als mögliches Ende.  
  * quiz (optional): Objekt mit Quizfragen am Ende der Geschichte. Jede Frage:  
    * question: Die Frage.  
    * options: Array von Antwort-Strings.  
    * correctAnswerIndex: Index der richtigen Antwort im options-Array.  
* **Schwierigkeitsanpassung:**  
  * entdecker: Kürzere Sätze, einfachere Wörter, weniger komplexe Entscheidungsbäume, einfachere Quizfragen.  
  * anfaenger: Standard.  
  * hase: Längere Texte, komplexere Satzstrukturen, mehrdeutige Hinweise, anspruchsvollere Quizfragen.  
* **Feedback:** Textuelles Feedback auf Entscheidungen (falls in options.feedback definiert). Ergebnis des Quiz.

*(Dokumentation für Game\_SyllableClap.js, Game\_TreasureHunt.js, Game\_Blitzwoerter.js, Game\_Wortpaare.js, Game\_LeseWuerfel.js, Game\_Wortkette.js, Game\_Buecherwurm.js, Game\_Wortgitter.js, Game\_LueckentextMaus.js, Game\_PictureStory.js würde analog folgen.)*

**Anhang C: Interaktive Geschichten – Detailaufbau (Beispiele)**

### **Interaktive Geschichte: "Der Glühwürmchen-Pfad" (Tag 4\)**

* **Story-ID:** fireflyPath  
* **Kurzbeschreibung:** Maja und Sophie müssen das Rätsel leuchtender Glühwürmchen lösen, um den richtigen Waldpfad zu finden und eine Zauberbuchseite zu erhalten.  
* **Lernfokus:** Leseverständnis einfacher Wörter ("ROSE", "MAUS", "LAMPE"), logische Schlussfolgerung.  
* **Szenenaufbau:**  
  * **Szene 1 (scene1): Das Rätsel der Glühwürmchen**  
    * *Text:* "Die Glühwürmchen summen: 'Willkommen, kleine Abenteurer\! Um den Weg durch unseren Wald zu finden, müsst ihr klug wählen. Wir zeigen euch drei Wörter. Nur eines davon beschreibt etwas, das euch in der Dunkelheit wirklich helfen kann. Welches ist es?' Die Glühwürmchen formen die Wörter: 1\. ROSE 2\. MAUS 3\. LAMPE"  
    * *Bild-Prompt:* "Zwei Mädchen im dunklen Wald, umgeben von vielen leuchtenden Glühwürmchen, die die Wörter ROSE, MAUS, LAMPE in der Luft formen. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/1A2B4F/E6E6FA?text=Glühwürmchen+formen+Wörter)  
    * *Optionen:*  
      1. text: "ROSE", nextSceneId: "scene\_rose", feedback: "Eine Rose duftet schön, aber leuchtet nicht."  
      2. text: "MAUS", nextSceneId: "scene\_maus", feedback: "Eine Maus ist klein und flink, aber kein Licht."  
      3. text: "LAMPE", nextSceneId: "scene\_lampe\_correct", feedback: "Genau\! Eine Lampe spendet Licht\!"  
  * **Szene 2 (scene\_rose): Falsche Wahl \- Rose**  
    * *Text:* "Du wählst ROSE. Die Glühwürmchen schütteln traurig ihre Köpfchen. 'Eine Rose ist schön, aber sie leuchtet nicht im Dunkeln. Der Pfad bleibt verborgen.' Du musst zurück zum Anfang des Rätsels."  
    * *Bild-Prompt:* "Zwei Mädchen im dunklen Wald, die Glühwürmchen schauen traurig, eine einzelne Rose leuchtet schwach. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/FFC0CB/333333?text=Traurige+Glühwürmchen+mit+Rose)  
    * *Optionen:* text: "Nochmal versuchen", nextSceneId: "scene1"  
  * **Szene 3 (scene\_maus): Falsche Wahl \- Maus**  
    * *Text:* "Du wählst MAUS. Die Glühwürmchen kichern. 'Eine Maus huscht durch die Nacht, aber sie zeigt dir nicht den Weg. Der Pfad bleibt verborgen.' Du musst zurück zum Anfang des Rätsels."  
    * *Bild-Prompt:* "Zwei Mädchen im dunklen Wald, die Glühwürmchen kichern, eine kleine Maus huscht vorbei. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/808080/FFFFFF?text=Kichernde+Glühwürmchen+mit+Maus)  
    * *Optionen:* text: "Nochmal versuchen", nextSceneId: "scene1"  
  * **Szene 4 (scene\_lampe\_correct): Richtige Wahl \- Lampe**  
    * *Text:* "Du wählst LAMPE. Die Glühwürmchen jubeln\! 'Richtig\! Eine Lampe erhellt die Dunkelheit\!' Ein besonders helles Glühwürmchen löst sich vom Schwarm. 'Folgt mir\!', summt es. 'Ich zeige euch den Weg zur nächsten Seite des Zauberbuchs\!'"  
    * *Bild-Prompt:* "Zwei Mädchen im dunklen Wald, ein Glühwürmchen leuchtet besonders hell und fliegt voran, um einen Pfad zu erhellen. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/FFFFE0/000080?text=Helles+Glühwürmchen+zeigt+Weg)  
    * *Optionen:* text: "Dem Glühwürmchen folgen\!", nextSceneId: "scene\_end\_success"  
    * *Award:* ZauberbuchSeite2  
  * **Szene 5 (scene\_end\_success): Erfolg**  
    * *Text:* "Das helle Glühwürmchen führt euch sicher durch den dunklen Wald zu einer kleinen Lichtung. Dort, auf einem moosbewachsenen Stein, liegt eine weitere vergilbte Seite des Zauberbuchs eurer Urahnen\! Ihr habt es geschafft\!"  
    * *Bild-Prompt:* "Zwei Mädchen und Baby auf einer sonnigen Waldlichtung, finden eine leuchtende Buchseite auf einem Stein. Kinderbuchstil, fröhlich." (Platzhalter: https://placehold.co/600x350/98FB98/333333?text=Zauberbuchseite+gefunden\!)  
    * *Optionen:* text: "Juhu\! Zurück zum Tagesmenü.", nextSceneId: null  
* **Quiz:** (Für diese Geschichte ist aktuell kein Quiz in V17 definiert, könnte aber leicht ergänzt werden)

### **Interaktive Geschichte: "Das vertauschte Rezept" (Tag 15\)**

* **Story-ID:** cookieRecipeMystery  
* **Kurzbeschreibung:** Maja und Sophie wollen Glückskekse backen, aber Maja verliest sich bei einer Zutat, was zu einem lustigen Backchaos führt.  
* **Lernfokus:** Genaues Lesen von Wörtern in einem Rezept, Konsequenzen von Lesefehlern erkennen.  
* **Szenenaufbau (Auszug):**  
  * **Szene 1 (scene1\_kitchen): Die Backidee**  
    * *Text:* "Heute wollen Maja und Sophie Glückskekse backen\! Papa Sven hat bald Geburtstag. Im Urahnen-Zauberbuch finden sie ein Rezept für 'Kicher-Glückskekse'. Maja liest vor: 'Man nehme Mehl, Eier und einen Löffel voll... H-O-N-I-G.' Aber das 'G' sieht aus wie ein 'S'. 'H-O-N-I-S? Was ist Honis?', fragt Sophie."  
    * *Bild-Prompt:* "Maja und Sophie in der Küche, schauen in ein großes Zauberbuch. Zutaten wie Mehl und Eier stehen bereit. Kinderbuchstil." (Platzhalter: https://placehold.co/600x350/F0E68C/333333?text=Maja+und+Sophie+backen+Kekse)  
    * *Optionen:*  
      1. text: "Wir nehmen einfach Honig, das klingt richtig.", nextSceneId: "scene2\_honey"  
      2. text: "Vielleicht ist 'Honis' ein Zauberkraut? Suchen wir im Garten\!", nextSceneId: "scene2\_honis\_search"  
  * ... (weitere Szenen für falsche Zutat, lustiges Ergebnis, Korrektur, erfolgreiches Backen) ...  
  * **Quiz:**  
    1. *Frage:* "Welche Zutat hat Maja zuerst falsch gelesen?" *Optionen:* \["Zucker", "Honis", "Mehl"\], *Korrekt:* 1  
    2. ... (weitere Fragen)

*(Dokumentation für "Crunellas misslungener Gegenfluch" (Tag 19), "Das Geheimnis der flüsternden Bibliothek" (Tag 23), "Der vertauschte Zauberstab" (Tag 27), "Die Suche nach dem verlorenen Lachen" (Tag 34\) und die finale Bildergeschichte (Tag 35\) würde analog folgen.)*

Diese detaillierte Dokumentation sollte Ihnen helfen, den Aufbau und die Inhalte des Spiels besser nachzuvollziehen und als Grundlage für Ihre Abschlussarbeit zu dienen. Wenn Sie möchten, dass ich einen spezifischen anderen Tag oder ein anderes Spielmodul auf diese Weise detailliert ausarbeite, lassen Sie es mich wissen\!

Als Nächstes sende ich Ihnen den **vollständigen Code der Version 17 als direkten Textblock**. Bitte bestätigen Sie, dass Sie bereit für eine sehr lange Nachricht sind.