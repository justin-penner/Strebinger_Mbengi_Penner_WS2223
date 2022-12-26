# Travelence - Die UrlaubsAPI

Gruppe - `Christian Mbengi`, `Justin Penner` & `Paul Strebinger`

<br>

## Inhaltsverzeichnis

1. [Die Domäne](#die-domäne)
2. [Die Idee](#die-idee)
3. [Domänenmodelle](#domänenmodelle)
4. [Unsere Zielsetzung](#unsere-zielsetzung)
5. [Die Anwendungslogik](md/applicationLogic.md)
6. [Webservices, die wir nutzen](md/webservices.md)
7. [Proof of Concept](md/proofOfConcept.md)
8. [Setup](#setup)

<br>

<!-- ## A simple way to get information about a destination
... by getting Covid statistics <br>
... by getting hotels at destination <br>
... by getting places of interest at destination <br>
... by getting statics for destination (e.g. weather) <br>
[... read more](md/idea.md)

<br>

## API's we use
* [CovidAPI](https://rapidapi.com/api-sports/api/covid-193/) - to display Covid statistics for a certain day
* [PlacesAPI](https://rapidapi.com/opentripmap/api/places1) - to display places of interest
* [WeatherAPI](https://open-meteo.com/en/docs) - to display a weather forecast
* [GeoCodeAPI](https://nominatim.org/release-docs/latest/) - to translate coordinates and city names

<br>

## Data we add
- We get the country by the city with the help of a JSON object
- We display a list of hotels at the searched destination

<br> -->

## Die Domäne

### Das Problemszenario

"Peter möchte mit seiner Frau Lois und seinen Kindern in den Urlaub fahren. Da ihm das Wohl seiner Familie sehr am Herzen liegt, möchte er sich ausreichend über Unterkünfte, Aktivitäten und Risiken vorort informieren. Nun hat er jedoch das Problem, dass sich die gesuchten Informationen stark unterscheiden und er weiß nicht, welchen Quellen er trauen soll."

### Unsere Lösung

"Um sich überschneidene Informationen zu erhalten, nutzt Peter unsere API. Mit dieser kann er sich sowohl über die `Inzidenzwerte` und das `Wetter` informieren, als auch eine geeignete `Unterkunft` und damit verbundene `Aktivitäten` finden."

<br>

## Die Idee

Das Hauptproblem unseres Szenarios ist, dass es zu viele verschiedene Informationen zu simplen Suchanfragen, welche durch den Nutzer getätigt werden, gibt. Um dieses Problem zu lösen, wollen wir vertrauenswürdige Quellen recherchieren und die gewonnen Informationen gebündelt darstellen.

Dazu möchten wir eine einfache API entwickeln, welche nur nützliche und angeforderte Daten in Form eines `JSON-Objekts` zurückgibt, sodass eine weitere Verarbeitung durch den Nutzer stark vereinfacht wird.

<br>

## Domänenmodelle

### Deskriptives Domänenmodell

Um den Umfang unserer Domäne leicht darstellen zu können haben wir ein deskriptives Domänenmodell erstellt, welches über die Aspekte unserer Domäne hinaus, wichtige Informationen enthält.

<img src="./img/Descriptive-Domain-Model.svg" alt="Deskriptives Domänenmodell" style="border-radius: 25px;">

### Präskriptives Domänenmodell

Nachdem wir recherche zu möglichen Lösungsansätzen betrieben haben, haben wir unser deskriptives Domänenmodell nochmal überarbeitet und Aspekte die für unsere API nicht interessant sind ausgegraut. Auf diese Weise ist das präskripive Domänenmodell entstanden.

<img src="./img/Prescriptive-Domain-Model.svg" alt="Präskriptives Domänenmodell" style="border-radius: 25px;">

<br>

## Unsere Zielsetzung

- Statistiken zu `Covid` und `Wetter` sollen zurückgegeben werden
- `Hotels`, welche am Zielort liegen, sollen zurückgegeben werden
- `interessante Orte` für Aktivitäten sollen zurückgegeben werden
- die API soll leicht zu bedienen sein
- der Nutzer soll entscheiden können welche Informationen angezeigt werden

<br>

## Setup

Zunächst müssen Sie das Repository klonen. Dies können sie tun, indem sie den folgenden Befehl in Ihrem `Terminal` ausführen:

```console
git clone https://github.com/justin-penner/Strebinger_Mbengi_Penner_WS2223.git
```

<br>

Im nächsten Schritt müssen Sie `Node.js` initialisieren. Dies können sie tun, indem sie den folgenden Befehl in Ihrem `Terminal` ausführen:

```console
npm i
```

<br>

Anschließend müssen Sie noch die Datenbank aufbauen. Dies können sie tun, indem sie den folgenden Befehl in Ihrem `Terminal` ausführen:

```console
docker-compose up --build
```

<br>

Um das Projekt auszuführen, gehen sie mit `cd js` in das Verzeichnis `js` und führen sie den folgenden Command in ihrem Terminal aus:

```console
node app.js
```