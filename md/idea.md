# Idea

The idea was to build a simple API, which responds usefull data as JSON based on a destination the user wants to travel to.

<br>

## API's we use for our response

1. [CovidAPI](covidAPI.md) - to get real time statistics about the covid situation in different countries, selected through a query
2. [PlacesAPI](placesAPI.md) - to get places of interest based on the location given through a query
3. [WeatherAPI](weatherAPI.md) - to get a forecast of the next 7 days based on the location given through a query
4. [GeoCodeAPI](geoCodeAPI.md) - to tranlate coordinates to a city name or reversed

<br>

## Data we add

1. Hotels - based on a JSON file, we filter the information we need, to display usefull information for the user
2. Countries - based on a JSON file, we get the country of the destination the user wants to travel to (we need this data to run some of the API's)
