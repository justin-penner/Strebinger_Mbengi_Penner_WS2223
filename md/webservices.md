# Webservices, die wir nutzen

## Inhaltsverzeichis

1. [Die CovidAPI](#die-covidapi)
2. [Die PlacesAPI](#die-placesapi)
3. [Die WeatherAPI](#die-weatherapi)
4. [Die GeoCodeAPI](#die-geocodeapi)

<br>

Um mit unserer API stets aktuelle Informationen zu erhalten, greifen wir auf ausgewählte Webservices zurück. Im folgenden sollen diese Services ausführlicher beschrieben werden.

<br>

## Die CovidAPI

## Beschreibung

Die ursprüngliche API antwortet mit einem `JSON-Objekt`, welches Statistiken, wie die `Inzidenz` an einem bestimmten Tag, in einem bestimmten `Land` entält.

<br>

Eine Antwort sieht z.B. so aus:

```JSON

    [
        {
            "continent": "Europe",
            "country": "Germany",
            "population": 84400420,
            "cases": { 
                "new": null,
                "active": 1740911,
                "critical": 1406,
                "recovered": 33279300,
                "1M_pop": "416736",
                "total": 35172693
            },
            "deaths": {
                "new": null,
                "1M_pop": "1807",
                "total": 152482},
            "tests": {
                "1M_pop": "1449429",
                "total": 122332384
            },
            "day": "2022-10-23",
            "time": "2022-10-23T05:30:03+00:00"
        }
    ]

```

<br>

## Was haben wir verändert, um diese API für uns nutzbar zu machen?

Wir haben nicht-essentielle Daten aus der Antwort der API entfernt, um nur die für uns wichtigen Daten für den weiteren Verlauf leichter verfügbar zu machen. Dies haben wir geschafft, indem wir ein neues Objekt mit den relevanten Informationen gefüllt und zurückgegeben haben.

<br>

Die veränderte Antwort sieht nun so aus:

```JSON

    {
        "country": "Germany",
        "population": 84400420,
        "cases": {
            "new": null,
            "active": 1740911,
            "critical": 1406,
            "recovered": 33279300,
            "1M_pop": "416736",
            "total": 35172693
        },
        "day": "2022-10-23"
    }

```

<br>

Außerdem haben wir eine Funktion hinzugefügt, die Deutschland als Standardwert setzt, falls kein Land angegeben wurde.

<br>

## Weitere Veränderungen

Zunächst erhalten wir das `aktuelle Datum` und formatieren dieses, um es für die API benutzen zu können. Basierend auf diesem Algorithmus, können wir die Daten der letzten sieben Tage abfragen und in einem `Array` abspeichern.

<br>

## Warum benutzen wir diese API?

Zunächst einmal ist der größte Vorteil dieser API, dass sie vollkommen kostenlos ist und als einzige Einschränkung 60 Aufrufe pro Minute aufweist. Außerdem werden keine Datenschutzrechtlich relevante Daten erfasst. Es wird lediglich das `Land` als Übergabeparamter erwartet.

Ein Nachteil dieser API ist, dass bei nicht vorhandenen Einträgen kein Fehlercode, sondern ein leeres Objekt zurückgegeben wird.

[Hier](./comparisonApis.md) können sie eine Auflistung von möglichen Alternativen sowie die Diskussion dieser sehen.

<br>

# Die PlacesAPI

## Beschreibung

Die ursprüngliche API antwortet mit einem `JSON-Objekt`, welches interessante Orte enthält. Als Übergabeparameter sind die `Koordinaten` notwendig.

<br>

Eine Antwort sieht z.B. so aus:

```JSON

    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "15135220",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        13.4225502,
                        52.5196991
                    ]
                },
                "properties": {
                    "xid": "Q105756510",
                    "name": "Aus dem Leben der Völker der Sowjetunion",
                    "dist": 176.41618618,
                    "rate": 2,
                    "wikidata": "Q105756510",
                    "kinds": "historic,cultural,urban_environment,monuments_and_memorials,interesting_places,sculptures,monuments"
                }
            }
        ]
    }

```

<br>

## Was haben wir verändert, um diese API für uns nutzbar zu machen?

Wir haben nicht-essentielle Daten entfernt, sodass wir nur Informationen zurückgegeben bekommen, welche wir im weiteren Verlauf nutzen können. Dies haben wir erreicht, indem wir ein neues Objekt mit den für uns wichtigen Informationen gefüllt haben.

<br>

Die veränderte Antwort sieht nun so aus:

```JSON

    [
        {
            "name": "Aus dem Leben der Völker der Sowjetunion",
            "coordinates": {
                "lon": 13.4225502,
                "lat": 52.5196991
            },
            "wiki": "https://www.wikidata.org/wiki/Q105756510",
            "rating": 1
        }
    ]

```

<br>

## Warum benutzen wir diese API?

Ein großer Vorteil dieser API ist, dass Orte, welche sich in der nahen Umgebung der übergebenen Koordinaten befinden, mit Parametern wie den Koordinaten und einer Bewertung zurückgegeben werden. Auch die Tatsache, dass diese API vollkommen kostenlos nutzbar ist und das einzige Limit bei 5000 Aufrufen pro Monat liegt, ist ein großer Vorteil.

[Hier](./comparisonApis.md) können sie eine Auflistung von möglichen Alternativen sowie die Diskussion dieser sehen.

<br>

# Die WeatherAPI

## Beschreibung

Die ursprüngliche API antwortet mit einem `JSON-Objekt`, welches Statistiken wie die Temperatur zwischen einem Start-Datum und einem End-Datum beinhaltet. Als Übergabeparameter werden `Koordinaten` benötigt. 

<br>

Eine Antwort sieht z.B. so aus:

```JSON

    {
        "latitude": 52.52,
        "longitude": 13.379999,
        "generationtime_ms": 0.6519556045532227,
        "utc_offset_seconds": 0,
        "timezone": "GMT",
        "timezone_abbreviation": "GMT",
        "elevation": 48.0,
        "hourly_units": {
            "time": "iso8601",
            "relativehumidity_2m": "%",
            "temperature_2m": "°C",
            "rain": "mm",
            "snowfall": "cm",
            "snow_depth": "m",
            "cloudcover": "%",
            "soil_temperature_0cm": "°C"
        },
        "hourly": {
            "time": [
                "2022-11-28T00:00"
            ],
            "relativehumidity_2m": [
                87
            ],
            "temperature_2m": [
                3.5
            ],
            "rain": [
                0.00
            ],
            "snowfall": [
                0.00
            ],
            "snow_depth": [
                0.00
            ],
            "cloudcover": [
                100
            ],
            "soil_temperature_0cm": [
                3.1
            ]
        }
    }

```

<br>

## Was haben wir verändert, um diese API für uns nutzbar zu machen?

Wir haben nicht-essentielle Informationen entfernt, um nur für uns wichtige Daten zu erhalten. Dies haben wir erreicht, indem wir ein neues Objekt mit diesen wichtigen Informationen gefüllt haben. Außerdem haben wir die Reihenfolge der Daten verändert, sodass diese unserer Ansicht nach sinnvoller sortiert sind. Zuletzt haben wir außerdem noch die Einheiten hinzugefügt, um die Daten verständlicher zu machen.

<br>

Die veränderte Antwort sieht so aus:

```JSON

    {
        "coordinates": {
            "lat": 52.52,
            "lon": 13.379999
        },
        "forecast": [
            {
                "time": "2022-11-28T00:00",
                "temperature": "3.5°C",
                "soilTemperature": "3.1°C",
                "rain": "0mm",
                "humidity": "87%",
                "snowfall": "0cm",
                "snowDepth": "0m",
                "cloudCover": "100%"
            }
        ]
    }

```

<br>

## Warum benutzen wir diese API?

Zunächst ist ein großer Vorteil dieser API, dass sie vollkommen kostenlos und Open-Source ist. Außerdem werden die Ergebnisse jede Stunde aktualisiert, sodass wir stets aktuelle Daten erhalten.

[Hier](./comparisonApis.md) können sie eine Auflistung von möglichen Alternativen sowie die Diskussion dieser sehen.

<br>

# Die GeoCodeAPI

## Beschreibung

Wir nutzen diese API, um die Adresse anhand von gegebenen Koordinaten oder umgekehrt herauszufinden. Die API antwortet mit einem `JSON-Objekt`, welches noch weitere Informationen enthält.

<br>

Eine Antwort der `Reverse-Funktion` dieser API sieht z.B. so aus:

```JSON

    {
        "place_id": 40683122,
        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
        "osm_type": "node",
        "osm_id": 3213714484,
        "lat": "52.5199026",
        "lon": "13.4200479",
        "display_name": "6, Jacobystraße, Mitte, Berlin, 10179, Deutschland",
        "address": {
            "house_number": "6",
            "road": "Jacobystraße",
            "suburb": "Mitte",
            "borough": "Mitte",
            "city": "Berlin",
            "ISO3166-2-lvl4": "DE-BE",
            "postcode": "10179",
            "country": "Deutschland",
            "country_code": "de"
        },
        "boundingbox": [
            "52.5198526",
            "52.5199526",
            "13.4199979",
            "13.4200979"
        ]
    }

```

<br>

## Was haben wir verändert, um diese API für uns nutzbar zu machen?

Wir haben nicht-essentielle Informationen entfernt, sodass wir diese API lediglich als Übersetzer von Koordinaten bzw. Adressen nutzen können. Dies haben wir erreicht, indem wir ein neues Objekt mit den wichtigen Informationen gefüllt haben.

<br>

Die veränderte Antwort sieht so aus:

```JSON

    {
        "city": "Berlin",
        "country": "Deutschland"
    }

```

<br>

## Warum benutzen wir diese API?

Zunächst ist ein großer Vorteil der API, dass sie kostenlos ist und man ohne Registrierung auf diese zugreifen kann. Zudem basiert die API auf `OpenStreetMap`, sodass alle Adressen vorhanden sind. Außerdem hat diese API, was die Aufrufe angeht, kein Limit.

[Hier](./comparisonApis.md) können sie eine Auflistung von möglichen Alternativen sowie die Diskussion dieser sehen.