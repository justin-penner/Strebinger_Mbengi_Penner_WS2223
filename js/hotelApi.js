const error = require("../json/error.json");
const hotels = require("../json/hotels.json");
const cities = require("../json/citiesOfCountries.json");

async function hotelForCity(req, res) {
    let searchCity = req.query.city;
    let countries = new Array();

    hotels.forEach(element => {
        if(element.title.toLowerCase().includes(searchCity.toLowerCase())) {
            countries.push(element);
        }
    })
    res.status(200).send(countries);
}

async function getCities(req, res) {
    res.status(200).send(cities);
}

module.exports = {hotelForCity, getCities};