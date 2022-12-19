const error = require('../json/error.json');
const hotels = require('../json/hotels.json');
const countries = require('../json/citiesOfCountries.json');

exports.getHotels = async function (req, res) {

	let searchCity = req.query.city;
	return await getHotelsInCity(searchCity, req, res);

	// let searchCountry = req.query.country;

	// if (searchCountry != null && searchCity != null) {
	// 	if (await isCityInCountry(req, res)) {
	// 		return await getHotelsInCity(searchCity, req, res);
	// 	} else {
	// 		return { error: 'city is not in Country' };
	// 	}
	// } else if (searchCity != null) {
	// 	return await getHotelsInCity(searchCity, req, res);
	// } else {
	// 	return await getHotelsForEveryCity(req, res);
	// }
};

// async function isCityInCountry(req, res) {
// 	let searchCity = req.query.city;
// 	let searchCountry = req.query.country;
// 	const citiesInCountry = await countries[
// 		searchCountry[0].toUpperCase() + searchCountry.substring(1)
// 	];
// 	for (let i = 0; i < (await citiesInCountry.length); i++) {
// 		if (citiesInCountry[i].toLowerCase() == searchCity.toLowerCase()) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

async function getHotelsInCity(searchCity, req, res) {
	try {
		let countries = new Array();
		hotels.forEach((element) => {
			if (element.location.toLowerCase().includes(searchCity.toLowerCase())) {
				countries.push(element);
			}
		});
		return countries;
	} catch (err) {
		return err;
	}
}

async function getHotelsForEveryCity(req, res) {
	try {
		let searchCountry = req.query.country;
		const citiesInCountry = await countries[
			searchCountry[0].toUpperCase() + searchCountry.substring(1)
		];
		let hotels = new Array();
		for (let i = 0; i < citiesInCountry.length; i++) {
			let hotelsInCity = await getHotelsInCity(citiesInCountry[i], req, res);
			if (hotelsInCity != '') {
				hotels.push(await hotelsInCity);
			}
		}
		return hotels;
	} catch (err) {
		return err;
	}
}
