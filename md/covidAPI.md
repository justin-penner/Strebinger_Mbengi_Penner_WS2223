# The CovidAPI

<br>

## Description of the API

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

We have removed non-essential returns from the API, so we only receive information relevant to us for further processing. We have achieved this by filling a separate object with the received information.

<br>

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

In addition, we have introduced the function to select Germany as default for an unspecified country and return the associated values.

<br>

## Further Rework on the Covid API

First we get the `current Date` and format the response to be able to use it in an algorithm. Based on this an algorithm can request all `JSON` data from the past 7 days and displays them all in an `Array`, every entry is formatted like above example.

* So the Response from our API is the History of statistics in a given Country for the past 7 days

<br>

## Why are we using this specific API

First of all, a great advantage of this API is that it is free and has as its only limitation a maximum of 60 requests per minute. Furthermore, no data of concern are collected. All you have to do is hand over a `country` as a parameter to get a specific response.

One drawback of this API is the fact that if data for the specified date is not available, the API responds with an empty object.