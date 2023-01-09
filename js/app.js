// imports
const express = require('express');
const app = express();
const { covidHistory } = require('./covidApi.js');
const { getPlacesOfInterest } = require('./placesApi.js');
const user = require('../controllers/userController.js');
var bodyParser = require('body-parser');
const { reverseGeoCoding, geoCoding } = require('./geocodeApi.js');
const { getHotels } = require('./hotelApi.js');
const { getWeatherForecast } = require('./weatherApi.js');
const res = require('express/lib/response.js');
const { isCityInCountry } = require('./country.js');

// setting up express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//router for user
app.get('/', user.index);
app.get('/index', user.index);
app.get('/register', user.register);
app.post('/create', user.create);
app.post('/login', user.login);
app.get('/login', user.loginPage);
app.get('/update-email', user.updatePageEmail);
app.post('/update-email', user.updateEmail);
app.get('/update-password', user.updatePagePassword);
app.post('/update-password', user.updatePassword);
app.get('/user', user.info);
app.get('/logout', user.logout);
app.post('/delete', user.delete);
app.get('/delete', user.index);

// endpoint
app.get('/search', async function (request, result) {
	// check for key
	if (await checkApiKey(request, result, request.query.apikey)) {
		// check for city and country
		if (request.query.city && request.query.country) {
			// check if city is in country
			if (await isCityInCountry(request.query.city, request.query.country)) {
				// define response variables
				let covid, weather, placesOfInterest, hotels;

				// define query variables
				let dates = {};

				// geoCode API
				let coordinates = await geoCoding(request);

				// check if dates are given
				if (request.query.start) dates['start'] = request.query.start;
				if (request.query.end) dates['end'] = request.query.end;

				// covid API
				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('covid')
				)
					covid = await covidHistory(request);

				// weather API
				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('weather')
				)
					weather = await getWeatherForecast(request, coordinates, dates);

				// places API
				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('places')
				) {
					placesOfInterest = await getPlacesOfInterest(request, coordinates);

					placesOfInterest = placesOfInterest.sort(sortByProperty('rating'));
					if (placesOfInterest.length > 10) placesOfInterest.length = 10;

					for (let index = 0; index < 10; index++) {
						placesOfInterest[index]['address'] = await reverseGeoCoding(
							request,
							placesOfInterest[index].coordinates
						);
					}
				}

				// hotel API
				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('hotels')
				)
					hotels = await getHotels(request, result);

				// get reponse json
				const response = require('../json/response.json');

				// clear response
				delete response['covid'];
				delete response['weather'];
				delete response['places'];
				delete response['hotels'];

				// fill response
				if (!request.query.options) {
					response['covid'] = covid;
					response['weather'] = weather;
					response['places'] = placesOfInterest;
					response['hotels'] = hotels;
				} else {
					if (request.query.options.includes('covid'))
						response['covid'] = covid;
					if (request.query.options.includes('weather'))
						response['weather'] = weather;
					if (request.query.options.includes('places'))
						response['places'] = placesOfInterest;
					if (request.query.options.includes('hotels'))
						response['hotels'] = hotels;
				}

				result.status(200).send(response);
			} else {
<<<<<<< HEAD
				result.send({
=======
				result.status(400).send({
>>>>>>> main
					error: 'City is not in country / country does not exist (please note spelling)'
				});
			}
		} else {
<<<<<<< HEAD
			result.send({
=======
			result.status(400).send({
>>>>>>> main
				error: 'Missing city or / and country'
			});
		}
	} else {
<<<<<<< HEAD
		result.send({
			error:'Invalid key'
=======
		result.status(400).send({
			error: 'Missing apikey'
>>>>>>> main
		});
	}
});

// sort data
function sortByProperty(property) {
	return function (a, b) {
		if (a[property] > b[property]) return -1;
		else if (a[property] < b[property]) return 1;

		return 0;
	};
}

//function to check if apikey exists
async function checkApiKey(req, res, apikey) {
	let boolean = false;
	let apikeys = await user.getAllApiKeys(req, res);
	apikeys.forEach((element) => {
		if (element.apikey == apikey) {
			boolean = true;
		}
	});
	return boolean;
}

app.listen(3000);



// proof of concept

//router for CovidApi
app.get('/covid', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		res.status(200).send(await covidHistory(req, res));
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});

//router for HotelApi
app.get('/hotels', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		getHotels(req, res);
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});

//router for SightseeingApi
app.get('/poi', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		res.status(200).send(await getPlacesOfInterest(req, res));
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});

// 48.864716, 2.349014 for Paris

app.get('/reverseGeoCode', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		res.status(200).send(await reverseGeoCoding(req));
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});

app.get('/geoCode', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		res.status(200).send(await geoCoding(req));
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});
//router for WeatherApi
app.get('/weather', async function (req, res) {
	if (await checkApiKey(req, res, req.query.apikey)) {
		res.status(200).send(await getWeatherForecast(req, res));
	} else {
		res.status(400).send({ error: 'Invalid API-Key' });
	}
});
