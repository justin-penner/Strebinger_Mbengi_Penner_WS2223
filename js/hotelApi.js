const error = require('../json/error.json');
const hotels = require('../json/hotels.json');
const countries = require('../json/citiesOfCountries.json');

exports.getHotels = async function (req, res) {
	let object = Array();
	let data = await getHotelsInCity(req.query.city, req, res);

	data.forEach((element) => {
		object.push({
			location: element.location,
			name: element.name,
			address: element.address,
			phone: element.phone,
			email: element.email,
			url: element.url,
			currency: element.currency,
			price: element.price,
			content: element.content,
			geo: element.geo,
		});
	});

	if(data.length == 0) {
		object.push({
			error: "No hotels found in this city"
		});
	}

	return object;

};

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