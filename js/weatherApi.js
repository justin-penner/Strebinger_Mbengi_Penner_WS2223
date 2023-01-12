const fetch = require('node-fetch');

// format a given date and add digits if needed
async function formatDate(date) {
	var year = date.getFullYear();
	var month = ('0' + (date.getMonth() + 1)).slice(-2);
	var day = ('0' + date.getDate()).slice(-2);

	return year + '-' + month + '-' + day;
}

async function getWeatherForecast(request, givenCoordinates, givenDates) {
	let data;
	let forecast = Array();
	let errorHandler = false;

	const date = new Date();

	let start;

	if (givenDates.start) {
		// validate given date
		if (Date.parse(givenDates.start)) {
			// format given date to fit API
			start = await formatDate(new Date(Date.parse(givenDates.start)));
		} else {
			start = await formatDate(date);
		}
	} else {
		start = await formatDate(date);
	}

	let end = givenDates.end
		? givenDates.end
		: await formatDate(
				new Date(new Date(start).getTime() + 60 * 60 * 24 * 1000)
		  );

	let latitude = (await request.query.lat)
		? request.query.lat
		: givenCoordinates.lat;
	let longitude = (await request.query.lon)
		? request.query.lon
		: givenCoordinates.lon;

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
		.catch((error) => {
			console.lof(error);
		});

	try {
		for (let index = 0; index < data.hourly.time.length; index++) {
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
	} catch (error) {
		return {
			error: 'Timespan is too large',
		};
	}

	return {
		coordinates: {
			lat: latitude,
			lon: longitude,
		},
		forecast: forecast,
	};
}

module.exports = { getWeatherForecast };
