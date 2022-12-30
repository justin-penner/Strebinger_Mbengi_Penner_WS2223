# Die Anwendungslogik

Unserer Anwendung soll ein Standort, bestehend aus `Stadt` und `Land`, übergeben werden. Die Daten werden überprüft. Unsere Anwendung fährt fort, wenn sowohl Stadt und Land existieren, als auch in Beziehung zueinander stehen. Auf Basis der übergebenen Daten ermittelt unsere Anwendung folgende Statistiken:

- Inzidenzwerte der letzten 7 Tage
- eine Wettervorhersage für die nächsten 24 Stunden oder für eine angegebene Zeitspanne
- Unterkünfte, welche in der direkten Umgebung des Standortes liegen
- gut bewertete und sehenswerte Orte

Die ermittelten Informationen werden dem Nutzer geordnet und reduziert ausgegeben, sodass diese leicht verständlich sind. Zudem hat der Nutzer die Möglichkeit anzugeben, welche Informationen er erhalten möchte. Auf diese Weise kann er unsere Anwendung auf seinen Nutzungsbereich `anpassen`.

Aus dem Domänenmodell und der beschriebenen Vorgehensweise unserer Anwendung gehen somit folgende Anwendungsobjekte hervor:

- Covid (Population / aktuelle Fälle / kritische Fälle / genesene Patienten / Gesamtzahl aller Fälle)
- Aktivitäten (Name / Koordinaten / URL zu Website / Bewertung / Adresse)
- Wetter (Temperatur / Niederschlag / Luftfeuchtigkeit / Schnee / Bewölkung)
- Unterkunft (Name / Adresse / Bewertung / Kontakt / Kosten)