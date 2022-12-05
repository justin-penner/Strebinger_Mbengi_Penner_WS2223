const fetch = require("node-fetch");

async function getWeatherForecast(request, result) {

    let data;
    let forecast = Array();

    await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + request.query.lat + "&longitude=" + request.query.lon + "&hourly=temperature_2m,rain,snowfall,snow_depth,cloudcover,soil_temperature_0cm&start_date=" + request.query.start + "&end_date=" + request.query.end, {
        method: "GET"
    })
    .then(response => response.json())
    .then(result => data = result)
    .catch(error => console.log(error));

    for(let index = 0; index < data.hourly.time.length; index++) {

        let time = data.hourly.time[index];
        let temperature = data.hourly.temperature_2m[index];
        let rain = data.hourly.rain[index];
        let snowfall = data.hourly.snowfall[index];
        let snowDepth = data.hourly.snow_depth[index];
        let cloudCover = data.hourly.cloudcover[index];
        let soilTemperature = data.hourly.soil_temperature_0cm[index];

        forecast.push({time, temperature, soilTemperature, rain, snowfall, snowDepth, cloudCover});

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
