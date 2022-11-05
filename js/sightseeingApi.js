const fetch = require("node-fetch");

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9e901e3198msh328f043ebfacb97p100ef1jsnc64a274704d8',
		'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
	}
};

const lon = 2.3522219;
const lat = 48.856614;

fetch('https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=100&lon=' + lon + '&lat=' + lat + '', options)
	.then(response => response.json())
	.then(response => {


        const data = response.features;

        data.length = 10;

        console.log(data);


    })
	.catch(err => console.error(err));