const express = require('express')
const app = express()
const {covidHistory} = require("./covidApi.js")
const {hotelForCity, getCities} = require("./hotelApi.js");
<<<<<<< HEAD
const {getPlacesOfInterest} = require("./poiApi.js")
=======
const {getPointsOfInterest} = require("./sightseeingApi.js")
>>>>>>> 50a819d823749d0693c1931883d134038f6467b9

const user = require("../controllers/userController.js")
//router for User
app.get('/index', user.index)

//router for CovidApi
app.get('/covid', async function (req, res) {
    res.send(await covidHistory(req, res));
})

//router for HotelApi
app.get('/hotels', async function(req, res) {
   getCities(req, res);
})

<<<<<<< HEAD
//router for PlacesOfInterestApi
app.get('/poi', async function(req, res) {
    res.send(await getPlacesOfInterest(req, res));
 })

=======
//router for SightseeingApi
app.get('/poi', async function(req, res) {
    res.send(await getPointsOfInterest(req, res));
 })

 // 48.864716, 2.349014 for Paris

>>>>>>> 50a819d823749d0693c1931883d134038f6467b9
app.listen(3000);