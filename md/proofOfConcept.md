# Proof of concept

<br>

In order to display example outputs, you have to generate an `API key`. This can be done by using the automatically generated admin account and logging in at `localhost:3000/login`. There you can copy the individually created API key and add it to the respective query.

<br>

| **Email**             | **Password** |
|:---------------------:|:------------:|
| `admin@traveldb.mail` | `secret`     |


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