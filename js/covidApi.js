const express = require('express');
const fetch = require('node-fetch');
const error = require('../json/error.json');

/**
 * Api returns covid statistics in a spesific country for the past 7 days
 */

/**
 * function to get cases from a day in a Country
 * @param {*} req URL with country
 * @param {*} res
 * @param {*} assembledDay assembled day from new Date()
 * @returns cases of from a Single day in a Specific Country
 */
async function day(req, res, assembledDay) {
	const url =
		'https://covid-193.p.rapidapi.com/history?day=' +
		assembledDay +
		'&country=' +
		evalCountry(req.query.country);

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'af2100d539mshc675720ecb65707p101b6djsnf2a14fe329ad',
			'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
		},
	};

	function evalCountry(country) {
		if (country == null) {
			return 'Germany';
		} else return country;
	}

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => {
			return json.response;
		})
		.catch((err) => console.error('error:' + err));

	try {
		let response = await fetch(url, options);
		response = await response.json();
		if (response.response[0] != 0) {
			return response.response[0];
		} else {
			return response.response[1];
		}
	} catch (err) {
		res.status(500).send({ msg: `Internal Server Error.` });
	}
}

/**
 * to get cases from a whole week from a spesific country
 * @param {*} req
 * @param {*} res
 * @returns the cases from a whole week
 */
async function covidHistory(req, res) {
	let returnedDays = new Array();
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let countDays = new Date(year, month - 1, 0).getDate();
	let newMonth = month - 1;

	let counter = 0;
	for (let i = 1; i < 8; i++) {
		if (date.getDate() - i > 0) {
			let newDate = date.getDate() - i;
			if (newDate.toString().length == 1) newDate = '0' + newDate;
			if (month.toString().length == 1) month = '0' + month;
			let assembledDay = year + '-' + month + '-' + newDate;

			returnedDays.push(await day(req, res, assembledDay));
		} else {
			let newDate = countDays - i;
			if (newMonth == 0) {
				year -= 1;
				newMonth = 12;
			}
			if (newMonth.toString().length == 1) newMonth = '0' + newMonth;
			let assembledDay = year + '-' + newMonth + '-' + newDate;

			counter++;
			returnedDays.push(await day(req, res, assembledDay));
		}
	}

	let formatedReturnedDays = await formatJson(returnedDays);

	return formatedReturnedDays;
}

/**
 * @param {*} json json to format into important info json
 * @returns json with only the infos we need, also gives back an Error msg, if the current day has no Entry yet
 */
async function formatJson(json) {
	let filteredjs = new Array();
	for (let i = 0; i < json.length; i++) {
		let response = json[i];
		if (response != null) {
			let country = response.country;
			let population = response.population;
			let cases = response.cases;
			let day = response.day;
			filteredjs.push({ country, population, cases, day });
		} else {
			filteredjs.push({ error });
		}
	}
	return filteredjs;
}

module.exports = { covidHistory };
