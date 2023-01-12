const countries = require('../json/citiesOfCountries.json');

async function isCityInCountry(city, country) {
	let countryFirstCharacter = country.charAt(0).toUpperCase();
	let cityFirstCharacter = city.charAt(0).toUpperCase();

	try {
		return countries[countryFirstCharacter + country.slice(1)].includes(
			cityFirstCharacter + city.slice(1)
		);
	} catch (error) {
		return false;
	}
}

module.exports = { isCityInCountry };
