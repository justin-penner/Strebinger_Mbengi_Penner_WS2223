const fetch = require('node-fetch');

/**
 *
 * @param {*} req to get parameters from the URI
 * @param {*} res
 * @returns a list of places of interest
 */
async function getPlacesOfInterest(request, givenCoordinates) {
	// define API key
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '9e901e3198msh328f043ebfacb97p100ef1jsnc64a274704d8',
			'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
		}
	};

	// public variables which will contain the data later
	let data;
	let result = Array();

	let latitude = await (request.query.lat) ? request.query.lat : givenCoordinates.latitude;
	let longitude = await (request.query.lon) ? request.query.lon : givenCoordinates.longitude;

	// fetch opentripmap API
	await fetch(
		'https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=250&lon=' +
			longitude +
			'&lat=' +
			latitude,
		options
	)
		.then((response) => response.json())
		.then((response) => {
			// response from opentripmap
			data = response.features;
		})
		.catch((err) => console.error(err));

	// filter given data to get what we really need
	for (let index = 0; index < data.length; index++) {
		if (
			data[index].properties.name.length > 0 ||
			data[index].properties.name.wikidata != undefined
		) {
			let coordinates = {
				"lon": data[index].geometry.coordinates[0],
				"lat": data[index].geometry.coordinates[1],
			};
			let name = data[index].properties.name;
			let wiki;

			if (data[index].properties.wikidata != undefined) {
				wiki =
					'https://www.wikidata.org/wiki/' + data[index].properties.wikidata;
			} else {
				wiki = 'undefined';
			}

			let rating = data[index].properties.rate;

			result.push({ name, coordinates, wiki, rating });
		}
	}

	return result;
}

module.exports = { getPlacesOfInterest };
