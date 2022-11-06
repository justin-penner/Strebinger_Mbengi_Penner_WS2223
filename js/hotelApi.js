const error = require("../json/error.json");
const hotels = require("../json/hotels.json");
const countries = require("../json/citiesOfCountries.json");

exports.hotels = async function(req, res) {
    let searchCity = req.query.city;
    let searchCountry = req.query.country;


    if(searchCountry!=null && searchCity !=null) {
        isCityInCountry(req, res)?res.status(200).send(await getHotelsInCity(req, res)):res.status(400).send({error:"city is not in Country"})
    }
    else if(searchCity!=null) {
        res.status(200).send(await getHotelsInCity(req, res));
    } else {
        res.status(200).send(await getHotelsForEveryCity(req, res))
    }
}

async function isCityInCountry(req, res) {
    let searchCity = req.query.city;
    const citiesInCountry = await countries[req.query.country];
    console.log(searchCity)
    for(let i = 0; i < citiesInCountry.length; i++) {
        if(element == searchCity.toLowerCase()) {console.log("true");return true}
    }
    return false
}

async function getHotelsInCity(req, res) {
    try {
        let searchCity = req.query.city;
        let countries = new Array();
        hotels.forEach(element => {
            if(element.location.toLowerCase().includes(searchCity.toLowerCase())) {
                countries.push(element);
            }
        })
        return countries;
    } catch (err) {
        return err;
    }
}

async function getHotelsForEveryCity(req, res) {
    try {
        let searchCountry = req.query.country;
        const citiesInCountry = await countries[searchCountry];
        let hotels = new Array();
        for(let i = 0; i < citiesInCountry.length; i++) {
            let hotelsInCity = await getHotelsInCity(citiesInCountry[i], req, res)
            if(hotelsInCity != "") {
                hotels.push(await hotelsInCity);
            }
        }
        return hotels;
    } catch (err) {
        return err;
    }
}
