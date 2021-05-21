# MicroBlogging App - 2518151
Dies ist die Abgabe für das Programmierprojekt Datenbanken Semester 4.
Für eine Live-Demo der App, ohne etwas herunterladen zu müssen, funktioniert dieser Link:

[Live-Demo](https://appetize.io/app/c6z4zye74phbxerpmmay8p22jw?device=pixel4&scale=75&orientation=portrait&osVersion=10.0)

Anmerkung: Aus Kompatibilitätsgründen funktioniert die Darstellung am besten für Pixel 4 oder höher.

## Wie sehe ich etwas?
Ich habe zwei Testnutzer erstellt, @eike und @franz. Am besten ist es, zunächst einen neuen Nutzer über Sign up zu erstellen. Da das Internet über die Demo sehr langsam ist, kann es sein, dass requests schnell einen timeout bekommen. In der Regel sollte es allerdings funktionieren. 

Danach kann man in der Nutzersuche (mittlerer Tab auf der Unterseite) franz eingeben und schauen, wie diese beiden Nutzer interagiert haben. Daran werden alle Kernfunktionalitäten der App sichbar.

# Nutzung

## Server

Der Server ist über heroku deployed, die Datenbank wird über MongoDB Atlas bereitgestellt. Alternativ kann man auch den gesamten Server inklusive Datenbank lokal auf seinem eigenen Rechner laufen lassen. Folgende Schritte sind dazu notwendig: 

1. Herunterladen des Codes, entweder über das zip-Verzeichnis oder ` git clone https://github.com/Eikeike/MicroBlog_DB.git`
2. Wechseln in das Server-Verzeichnis mit `cd server`
3. Installieren der Notwenigen pakete über `npm install`
4. Eventuell anpassen von Datenbank und Port: Ändern der Konfiguration `MONGO_URI` und `PORT` in utils/.env oder utils/config.js
5. ``npm start``

## App
Die einfachste Möglichkeit, die App zu nutzen, besteht in der Nutzung über die  [Live-Demo](https://appetize.io/app/c6z4zye74phbxerpmmay8p22jw?device=pixel4&scale=75&orientation=portrait&osVersion=10.0). Alternativ kann auch die [.apk - Datei](https://github.com/Eikeike/MicroBlog_DB/releases) heruntergeladen und auf einem x86 Android-Device oder Emulator zum Laufen gebracht werden.
Des Weiteren kann sie über den expo-client genutzt werden. Für die Installation im expo-client sind folgende Schritte notwendig:
1. Installation von `expo-cli` ([Anleitung](https://docs.expo.io/get-started/installation/))
2. Insatllation der notwendigen Pakete über `npm install`
3. Start des Development-Servers über `expo start`
4. Ausführen der App auf dem gewünschten Gerät
   1. Empfohlen:  **Webbrowser-Nutzung** . Die App ist dafür geeignet und es treten wenige Probleme auf. Layout ist immer noch Mobil, es gibt keine adaptive Desktop-Ansicht

# Tests
Eine eigenständige Durchführung der Tests kann nach erfolgter [Installation](#nutzung) wie folgt durchgeführt werden:
1. `npm test` in der Konsole eingeben
2. Um die Tests mit angegezeigter Code-Coverage laufen zu lassen, `npm test-coverage` nutzen

Der von mir durchgeführte Coverage-Report sieht wie folgt aus:

![Coverage report](https://github.com/Eikeike/MicroBlog_DB/blob/main/server/coverage/coverage.png)

# Code-Struktur
Die App gliedert sich in Frontend und Backend. Frontend-Code ist unter [ClientApp](../ClientApp) zu finden, Backend-Code unter [server](../server).

## App
- ### screens: 
  - Alle Screens, die angezeigt werden können. Jede mögliche Ansicht ist ein neuer Screen
- ### components:
  - Alle wichtigen Komponenten (=Teilbausteine der Seiten), für Wiederverwendbarkeit
- ### context
  - Globaler Kontext, den jeder Screen kennen muss, unabhängig von Position auf dem Call-Stack
- ### core
  - App-interne Konfiguration
- ### navigations
  - Handler für die Navigation der App, also das Hin- und Her- Navigieren zwischen Screens
- ### assets
  - Wichtige Logos, Bilder und Texte
- ### hooks
  - Hilfsfunktionen, die von allen Komponenten und Screens genutzt werden können, also unabhängig vom jeweiligen Kontext funktionieren

## Server

- ### routes
  - Deklaration aller Routen, auf die Clients zugreifen können
- ### controllers
  - Definitionen der Funktionen, die über die Routen aufgerufen werden können. Hier befindet sich die Hauptlogik der App
 - ### middleware
    - Hier befinden sich funktionen, die vor dem eigentlichen Aufruf der Controller genutzt werden, beispielsweise zur Authentifizierung der aufrufenden Nutzer oder zur Fehlerbehandlung
- ### models
  - Definition der Datenmodelle, die vom Mongoose-Client verwendet werden
- ### utils
  - Hilfs- und Konfigurationsdaten für den Server
- ### test
  - Test- Files für automatisierte Unit-Tests
- ### coverage
  - Bericht über die Code-Coverage der Unit-Tests 
