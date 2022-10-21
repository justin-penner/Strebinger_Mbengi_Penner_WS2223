const express = require('express');
const app = express();
const fetch = require("node-fetch");
const error = require("./error.json");


/**
 * function to get cases from a day in a Country
 * @param {*} req URL with country
 * @param {*} res 
 * @param {*} assembledDay assembled day from new Date()
 * @returns cases of from a Single day in a Specific Country
 */
async function day(req, res) {
    const url = 'https://covid-193.p.rapidapi.com/history?day=' + evalDay(req.query.day) +'&country='+ evalCountry(req.query.country);

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'af2100d539mshc675720ecb65707p101b6djsnf2a14fe329ad',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };

    function evalCountry(country) {
        if(country==null) {
            return "Germany";
        } else return country;
    }

    function evalDay(day) {
        if(day==null) {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dayOfMonth = date.getDate();
            assembledDay = year + "-" + month + "-" + dayOfMonth;
            return assembledDay;
        } else return day;
    }

    fetch(url, options)
    	.then(res => res.json())
    	.then(json => {return json.response})
    	.catch(err => console.error('error:' + err));

    try {
        let response = await fetch(url, options);
        response = await response.json();
        if(response.response[0] != 0) {return response.response[0]} else {return response.response[1]}
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: `Internal Server Error.`});
    }
}

module.exports = {day};