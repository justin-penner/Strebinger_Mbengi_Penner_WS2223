const fetch = require('node-fetch');

async function reverseGeoCoding(request, givenCoordinates) {
	let coordinates;

	let latitude = (await request.query.lat)
		? request.query.lat
		: givenCoordinates.lat;
	let longitude = (await request.query.lon)
		? request.query.lon
		: givenCoordinates.lon;

	await fetch(
		'https://nominatim.openstreetmap.org/reverse?lat=' +
			latitude +
			'&lon=' +
			longitude +
			'&format=json&accept-language=en',
		{
			method: 'GET',
		}
	)
		.then((response) => response.json())
		.then((data) => {
			coordinates = {
				country: data.address.country,
				postcode: data.address.postcode,
				city: data.address.city,
				suburb: data.address.suburb,
				address: data.address.road,
			};
		})
		.catch((error) => console.log(error));

	return coordinates;
}

async function geoCoding(request) {
	let coordinates;

	await fetch(
		'https://nominatim.openstreetmap.org/search?city=' +
			request.query.city +
			'&format=json',
		{
			method: 'GET',
		}
	)
		.then((response) => response.json())
		.then(
			(data) =>
				(coordinates = {
					lat: data[0].lat,
					lon: data[0].lon,
				})
		)
		.catch((error) => console.log(error));

	return coordinates;
}

module.exports = { reverseGeoCoding, geoCoding };
