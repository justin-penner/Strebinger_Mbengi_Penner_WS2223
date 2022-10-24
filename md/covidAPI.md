# CovidApi 

## Initial API
The initial API returns a JSON with statistics about a spesific day in a spesific country, <br>
more details:

<details>
<summary>Example return or "localhost:3000/history-for-day"</summary>

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
</details>

## Our API overwrite
Our response (as an intermediate) will only contain the information we will later need to write our JSON <br>
more details:

<details>
<summary>Example return or "localhost:3000/history-for-day"</summary>

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
</details>