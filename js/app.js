const express = require('express');
const app = express();
const {covidHistory} = require("./covidApi.js");
const user = require("../controllers/userController.js");
const hotels = require("../controllers/hotelController.js");
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//router for User
app.get('/index', user.index);
app.get('/register', user.register);
app.post('/create', user.create);
app.post('/login', user.login);
app.get('/login', user.loginPage);
app.get('/user', user.info);
app.get('/logout', user.logout);

//router for CovidApi
app.get('/covid', async function (req, res) {
    res.status(200).send(await covidHistory(req, res));
})

//router for HotelApi
app.get('/hotels', hotels.hotels);

app.listen(3000);