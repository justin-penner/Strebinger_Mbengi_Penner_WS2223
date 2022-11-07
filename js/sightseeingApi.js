const fetch = require("node-fetch");

async function getPointsOfInterest(req, res) {

	let pointsOfInterest = Array();

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '9e901e3198msh328f043ebfacb97p100ef1jsnc64a274704d8',
			'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
		}
	};
	
	await fetch('https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=100&lon=' + req.query.lon + '&lat=' + req.query.lat, options)
	.then(response => response.json())
	.then(response => {
	
		const data = response.features;

		for(let index = 0; index < data.length; index++) {

				let name = data[index].properties.name;
				let coordinates = data[index].geometry.coordinates;
				let information = "https://www.wikidata.org/wiki/" + data[index].properties.wikidata;
				let distance = data[index].properties.dist.toFixed(2) + "km";

				pointsOfInterest.push({name, coordinates, distance, information});

		}		
	
	})
	.catch(err => console.error(err));

	return pointsOfInterest;

}

module.exports = {getPointsOfInterest};