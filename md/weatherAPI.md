# WeatherAPI

<br>

## Description

The initial API responds with a `JSON`, which contains weather forecasts based on given `coordinates` and a `time span`. 

<br>

A sample output of the API looks like this:

```JSON

    {
        "latitude": 52.52,
        "longitude": 13.419998,
        "generationtime_ms": 0.31304359436035156,
        "utc_offset_seconds": 0,
        "timezone": "GMT",
        "timezone_abbreviation": "GMT",
        "elevation": 38,
        "hourly_units": {
            "time": "iso8601",
            "temperature_2m": "°C"
        },
        "hourly": {
            "time": [
                "2022-12-03T00:00"
            ],
            "temperature_2m": [
                -1.1
            ]
        }
    }

```

<br>

## What we changed to get the information we want

We removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information.

<br>

The changed output:

```JSON

    {
        "coordinates": {
            "lat": 52.52,
            "lon": 13.379999
        },
        "forecasts": [
            {
                "time": "2022-12-03T00:00",
                "temperature": 3.5,
                "soilTemperature": 3.1,
                "rain": 0,
                "snowfall": 0,
                "snowdepth": 0,
                "cloudCover": 100
            }
        ]
    }

```

<br>

## Why are we using this specific API

First, a major benefit of the API is that it's free and publicly available. In addition, the forecasts are updated hourly so that you get the current status. Also, there is no limit as far as using the API is concerned.