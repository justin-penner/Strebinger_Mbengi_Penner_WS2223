const express = require('express');
const app = express();
const hotelApi = require('../js/hotelApi.js');

exports.hotels = async function (req, res) {
	hotelApi.hotels(req, res);
};

exports.cities = async function (req, res) {
	hotelApi.cities(req, res);
};
