# The TravelAPI

Group - `Christian Mbengi`, `Justin Penner` & `Paul Strebinger`

<br>

## Table of contents

1. [Idea](md/idea.md)
2. [Domain models](md/domainModels.md)
3. [Setup](md/setup.md)
4. [CovidAPI](md/covidAPI.md)
5. [PlacesAPI](md/placesAPI.md)
6. [WeatherAPI](md/weatherAPI.md)
7. [GeoCodeAPI](md/geoCodeAPI.md)
8. [Proof of concept](md/proofOfConcept.md)

<br>

## A simple way to get information about a destination
... by getting Covid statistics <br>
... by getting hotels at destination <br>
... by getting places of interest at destination <br>
... by getting statics for destination (e.g. weather) <br>
[... read more](md/idea.md)

<br>

## API's we use
* [CovidAPI](https://rapidapi.com/api-sports/api/covid-193/) - to display Covid statistics for a certain day
* [PlacesAPI](https://rapidapi.com/opentripmap/api/places1) - to display places of interest
* [WeatherAPI](https://open-meteo.com/en/docs) - to display a weather forecast
* [GeoCodeAPI](https://nominatim.org/release-docs/latest/) - to translate coordinates and city names

<br>

## Data we add
- We get the country by the city with the help of a JSON object
- We display a list of hotels at the searched destination

<br>

## Domain (German)
"Peter möchte mit seiner Frau Lois und seinen Kindern in den Urlaub fahren. Da ihm die Gesundheit seiner Familie sehr am Herzen liegt, möchte er sich ausreichend über die Inzidenz vorort informieren. Außerdem hat er noch keine Unterkunft gefunden. Nun möchte er, um keine unterschiedlichen Informationen zu erhalten, sowohl die Inzidenzwerte, als auch Informationen über mögliche Unterkünfte an einem Ort suchen."