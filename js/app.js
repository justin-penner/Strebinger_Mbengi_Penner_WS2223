const express = require('express');
const app = express();
const {covidHistory} = require("./covidApi.js");
const {getPlacesOfInterest} = require("./sightseeingApi.js")
const user = require("../controllers/userController.js");
var bodyParser = require('body-parser');
const {reverseGeoCoding, geoCoding} = require("./geocodeApi.js")
const {hotels} = require("./hotelApi.js");
const {getWeatherForecast} = require("./weatherApi.js");
const res = require('express/lib/response.js');

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
app.post('/delete', user.delete);
app.get('/delete', user.index);

//router for CovidApi
app.get('/covid', async function (req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      res.status(200).send(await covidHistory(req, res));
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
    
})

//router for HotelApi
app.get('/hotels', async function(req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      hotels(req, res);
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
})

//router for SightseeingApi
app.get('/poi', async function(req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      res.send(await getPlacesOfInterest(req, res));
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
 })

 // 48.864716, 2.349014 for Paris

 app.get('/reverseGeoCode', async function(req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      res.send(await reverseGeoCoding(req, res));
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
 })

 app.get('/geoCode', async function(req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      res.send(await geoCoding(req, res));
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
 })
 //router for WeatherApi
app.get('/weather', async function(req, res) {
   if(await checkApiKey(req, res, req.query.apikey)) {
      res.send(await getWeatherForecast(req, res));
   } else {
      res.status(400).send({"error":"Invalid API-Key"})
   }
})
//function to check if Api Key does exist
async function checkApiKey(req, res, apikey) {
   let boolean = false;
   let apikeys = await user.getAllApiKeys(req, res);
   await apikeys.forEach(element => {if(element.apikey == (apikey)) { boolean = true}});
   return boolean;
}

app.listen(3000);