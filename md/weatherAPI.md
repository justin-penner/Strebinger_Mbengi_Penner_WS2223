# WeatherAPI

<br>

## Description

The initial API responds with a `JSON`, which contains statistics, such as the `temperature` between a start date and an end date, based on given `coordinates`. 

<br>

A sample output of the API looks like this:

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

## What we changed to get the information we want

We removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information. We have also implemented an order that makes more sense for us and have added the units in each case.

<br>

The changed output:

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

## Why are we using this specific API

First of all, a major advantage of this particular API is that it is completely free and open source. In addition, the results are updated every hour, so that we can always return current data as an response.