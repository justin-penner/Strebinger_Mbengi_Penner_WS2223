# Proof of concept

<br>

In order to display example outputs, you have to generate an `API key`. This can be done by using the automatically generated admin account or you can register at `localhost:3000/register` / login at `localhost:3000/login` (e.g. with the admin account) to get an API key there.

<br>

| Email                 | Password | API-Key                                |
|-----------------------|----------|----------------------------------------|
| `admin@traveldb.mail` | `secret` | `d2eee56f-8b93-4436-a920-d8756a8f5972` |



<br>

Please note that before doing this, set up the project properly. You can find the instructions for this [here](setup.md).

<br>

In the following some points of intersection will be shown.

<br>

## CovidAPI

```console

    localhost:3000/covid?country=<param>&apikey=<API-KEY>

```

<br>

## PlacesAPI

```console

    localhost:3000/poi?lat=<param>&lon=<param>&apikey=<API-KEY>

```

<br>

## WeatherAPI

```console

    localhost:3000/weather?lat=<param>&lon=<param>&start=<YEAR-MONTH-DAY>&end=<YEAR-MONTH-DAY>&apikey=<API-KEY>

```

<br>

## GeoCodeAPI

```console

    localhost:3000/geocode?city=<param>&apikey=<API-KEY>

```

<br>

## Reverse GeoCodeAPI

```console

    localhost:3000/reversegeocode?lat=<param>&lon=<param>&apikey=<API-KEY>

```