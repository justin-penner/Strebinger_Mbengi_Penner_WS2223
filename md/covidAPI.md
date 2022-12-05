# CovidAPI

<br>

## Description

The initial API responds with a `JSON`, which contains statistics, such as the `incidence` on a given day, in a given `country`. 

<br>

A sample output of the API looks like this:

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

## What we changed to get the information we want

We removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information.

<br>

The changed output:

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

In addition, we introduced the function to select Germany as default for an unspecified country and return the associated values.

<br>

## Further Rework

First we get the `current date` and format the response to be able to use it. Based on this an algorithm we can request all data from the past 7 days and display it in an `Array`.

<br>

## Why are we using this specific API

First of all, a great advantage of this API is that it is free and has as its only limitation a maximum of 60 requests per minute. Furthermore, no data of concern are collected. All you have to do is hand over a `country` as a parameter to get a specific response.

One drawback of this API is the fact that if data for the specified date is not available, the API responds with an empty object.