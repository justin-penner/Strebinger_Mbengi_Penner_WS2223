# WeatherAPI

<br>

## Description

The initial API responds with a `JSON`, which contains places of interest based on given `coordinates`. 

<br>

A sample output of the API looks like this:

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

## What we changed to get the information we want

We removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information.

<br>

The changed output:

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

## Why are we using this specific API

A big advantage of this API is that locations that are in close proximity to the given coordinates are returned along with parameters like coordinates and a rating. The fact that the API is free and the daily limit is only reached at 5000 calls is also a great advantage.