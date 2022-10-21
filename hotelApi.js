const error = require("./error.json");
const hotels = require("./hotels.json");

async function hotelForCity(req, res) {
    let searchCity = req.query.city;
    let countries = new Array();

    hotels.forEach(element => {
        if(element.title.toLowerCase().includes(searchCity.toLowerCase())) {
            countries.push(element);
        }
    })
    res.send(countries);
}

module.exports = {hotelForCity};