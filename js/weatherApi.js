const fetch = require("node-fetch");

async function getWeatherForecast(request, result) {

    let data;
    let forecast = Array();

    await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + request.query.lat + "&longitude=" + request.query.lon + "&hourly=relativehumidity_2m,temperature_2m,rain,snowfall,snow_depth,cloudcover,soil_temperature_0cm&start_date=" + request.query.start + "&end_date=" + request.query.end, {
        method: "GET"
    })
    .then(response => response.json())
    .then(result => data = result)
    .catch(error => console.log(error));

    for(let index = 0; index < data.hourly.time.length; index++) {

        let time = data.hourly.time[index];
        let humidity = data.hourly.relativehumidity_2m[index] + "%";
        let temperature = data.hourly.temperature_2m[index] + "°C";
        let rain = data.hourly.rain[index] + "mm";
        let snowfall = data.hourly.snowfall[index] + "cm";
        let snowDepth = data.hourly.snow_depth[index] + "m";
        let cloudCover = data.hourly.cloudcover[index] + "%";
        let soilTemperature = data.hourly.soil_temperature_0cm[index] + "°C";

        forecast.push({time, temperature, soilTemperature, rain, humidity, snowfall, snowDepth, cloudCover});

    }

    return {
        "coordinates": {
            "lat": data.latitude,
            "lon": data.longitude
        },
        "forecast": forecast
    };

}

module.exports = {getWeatherForecast};
