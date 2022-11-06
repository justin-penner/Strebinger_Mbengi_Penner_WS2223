const error = require("../json/error.json");
const hotels = require("../json/hotels.json");
const countries = require("../json/citiesOfCountries.json");

exports.hotels = async function(req, res) {
    let searchCity = req.query.city;
    let searchCountry = req.query.country;


    if(searchCountry!=null && searchCity !=null) {
        if(await isCityInCountry(req, res)) {
            res.status(200).send(await getHotelsInCity(searchCity, req, res));
        } else {res.status(400).send({error:"city is not in Country"})}
    }
    else if(searchCity!=null) {
        res.status(200).send(await getHotelsInCity(searchCity, req, res));
    } else {
        res.status(200).send(await getHotelsForEveryCity(req, res))
    }
}

async function isCityInCountry(req, res) {
    let searchCity = req.query.city;
    let searchCountry = req.query.country;
    const citiesInCountry = await countries[searchCountry];
    for(let i = 0; i < await citiesInCountry.length; i++) {
        if(citiesInCountry[i].toLowerCase() == searchCity.toLowerCase()) {return true}
    }
    return false
}

async function getHotelsInCity(searchCity, req, res) {
    try {
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
