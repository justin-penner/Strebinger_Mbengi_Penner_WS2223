const express = require('express')
const app = express()
const {covidHistory} = require("./covidApiController.js")
const {hotelForCity, getCities} = require("./hotelApiController.js");

const user = require("./userController.js")
//router for User
app.get('/users/index', user.index)

//router for CovidApi
app.get('/history-past-day', async function (req, res) {
    res.send(await covidHistory(req, res));
})

//router for HotelApi
app.get('/hotels-in-country', async function(req, res) {
   getCities(req, res);
})

app.listen(3000);