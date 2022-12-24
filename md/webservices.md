# Webservices, die wir nutzen

## Inhaltsverzeichis

1. [Die CovidAPI](#die-covidapi)

<br>

Um mit unserer API stets aktuelle Informationen zu erhalten, greifem wir auf ausgewählte Webservices zurück. Im folgenden sollen diese Services ausführlicher beschrieben werden.

<br>

## Die CovidAPI

<br>

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

First we get the `current date` and format the response to be able to use it. Based on this an algorithm we can request all data from the past 7 days and display it in an `Array`.

<br>

## Why are we using this specific API

First of all, a great advantage of this API is that it is free and has as its only limitation a maximum of 60 requests per minute. Furthermore, no data of concern are collected. All you have to do is hand over a `country` as a parameter to get a specific response.

One drawback of this API is the fact that if data for the specified date is not available, the API responds with an empty object.