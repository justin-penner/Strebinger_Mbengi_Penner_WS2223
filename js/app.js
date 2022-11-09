const express = require('express')
const app = express()
const {covidHistory} = require("./covidApi.js")
const {hotelForCity, getCities} = require("./hotelApi.js");
const {getPlacesOfInterest} = require("./poiApi.js")

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

//router for PlacesOfInterestApi
app.get('/poi', async function(req, res) {
    res.send(await getPlacesOfInterest(req, res));
 })

app.listen(3000);