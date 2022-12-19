const fetch = require('node-fetch');

async function formatDate(date) {

	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();

	return year + "-" + month + "-" + day;

}

async function getWeatherForecast(request, givenCoordinates) {
	let data;
	let forecast = Array();

	const date = new Date();

	let start = await formatDate(date);
	let end = await formatDate(new Date(date.getTime() + 60 * 60 * 24 * 1000));

	let latitude = await (request.query.lat) ? request.query.lat : givenCoordinates.latitude;
	let longitude = await (request.query.lon) ? request.query.lon : givenCoordinates.longitude;

	await fetch(
		'https://api.open-meteo.com/v1/forecast?latitude=' +
			latitude +
			'&longitude=' +
			longitude +
			'&hourly=relativehumidity_2m,temperature_2m,rain,snowfall,snow_depth,cloudcover,soil_temperature_0cm&start_date=' +
			start +
			'&end_date=' +
			end,
		{
			method: 'GET',
		}
	)
	.then((response) => response.json())
	.then((result) => (data = result))
	.catch((error) => console.log(error));

	for(let index = 0; index < data.hourly.time.length; index++) {
		let time = data.hourly.time[index];
		let humidity = data.hourly.relativehumidity_2m[index] + '%';
		let temperature = data.hourly.temperature_2m[index] + '°C';
		let rain = data.hourly.rain[index] + 'mm';
		let snowfall = data.hourly.snowfall[index] + 'cm';
		let snowDepth = data.hourly.snow_depth[index] + 'm';
		let cloudCover = data.hourly.cloudcover[index] + '%';
		let soilTemperature = data.hourly.soil_temperature_0cm[index] + '°C';

		forecast.push({
			time,
			temperature,
			soilTemperature,
			rain,
			humidity,
			snowfall,
			snowDepth,
			cloudCover,
		});
	}

	return {
		"coordinates": {
			"lat": (request.query.lat) ? request.query.lat : givenCoordinates.latitude,
			"lon": (request.query.lon) ? request.query.lon : givenCoordinates.longitude
		},
		"forecast": forecast,
	};
}

module.exports = { getWeatherForecast };
