# Idea

The idea was to build a simple API, which responds multiple data as JSON based on a destination the user wants to travel to.

## API's we use for our response

1. [CovidAPI](covidAPI.md) to get real time statistics about the covid situation in different countries, selected through a query
2. [WeatherAPI](weatherAPI.md) to get a forcasts of the next 7 days based on the location given through a query
3. [FlightAPI](flightAPI.md) to get flights in a chosen city to a specific destination
4. [SightSeeingAPI]

## Self Written API's

1. [Hotel in a city](hotelJSON.md), based on a JSON file, we get the returns and format them to get only the information needed to be seen
2. [Get the country based on the city](citiesOfCountries.md), based on the data we get from this, we can return every hotel in a country to give the user a selection of possible accomodations
