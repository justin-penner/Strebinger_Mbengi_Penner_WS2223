# WeatherAPI

<br>

## Description

We use this API to get cities by coordinates or vice versa. The API responds with a `JSON` containing extensive information. 

<br>

Sample output from the reverse function of the API looks like this:

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

## What we changed to get the information we want

We removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information.

<br>

The changed output:

```JSON

    {
        "city": "Berlin",
        "country": "Deutschland"
    }

```

<br>

## Why are we using this specific API

First, a major benefit of the API is that it's free and publicly available. In addition, this API is based on the openstreetmap, which covers every address. Also, there is no limit as far as using the API is concerned.