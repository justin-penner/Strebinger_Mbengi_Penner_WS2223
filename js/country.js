const countries = require("../json/citiesOfCountries.json");

async function isCityInCountry(city, country) {
    return countries[country].includes(city);
}

module.exports = {isCityInCountry}