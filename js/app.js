const express = require('express');
const app = express();
const {covidHistory} = require("./covidApi.js");
const {hotelForCity, getCities} = require("./hotelApi.js");
const {getPlacesOfInterest} = require("./sightseeingApi.js")
const user = require("../controllers/userController.js");
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//router for User
app.get('/index', user.index);
app.get('/register', user.register);
app.post('/create', user.create);
app.post('/login', user.login);
app.get('/login', user.loginPage);
app.get('/update-email', user.updatePageEmail);
app.post('/update-email', user.updateEmail);
app.get('/update-password', user.updatePagePassword);
app.post('/update-password', user.updatePassword);
app.get('/user', user.info);
app.get('/logout', user.logout);
app.delete('/delete', user.delete);
app.get('/delete', user.index);

//router for CovidApi
app.get('/covid', async function (req, res) {
    res.status(200).send(await covidHistory(req, res));
})

//router for HotelApi
app.get('/hotels', async function(req, res) {
   hotelForCity(req, res);
})

//router for SightseeingApi
app.get('/poi', async function(req, res) {
    res.send(await getPlacesOfInterest(req, res));
 })

 // 48.864716, 2.349014 for Paris

app.listen(3000);