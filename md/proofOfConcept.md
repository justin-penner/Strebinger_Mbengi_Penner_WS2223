# Proof of concept

Im Folgenden sollen mögliche Handlungen mit unserer Anwendung dargestellt und erläutert werden. Hierbei sollen auch die Exit- und Fail-Kriterien hervorgehoben werden.

<br>

## Inhaltsverzeichnis

1. [Search](#1-search)
	1. [Aufbau](#11---aufbau)
	2. [Funktionsweise](#12---funktionsweise)
2. [Covid](#2-covid)
	1. [Aufbau](#21---aufbau)
	2. [Funktionsweise](#22---funktionsweise)
3. [Weather](#3-weather)
	1. [Aufbau](#31---aufbau)
	2. [Funktionsweise](#32---funktionsweise)
4. [Places](#4-places)
	1. [Aufbau](#41---aufbau)
	2. [Funktionsweise](#42---funktionsweise)
5. [Hotels](#5-hotels)
	1. [Aufbau](#51---aufbau)
	2. [Funktionsweise](#52---funktionsweise)

<br>

## 1. Search

### 1.1 - Aufbau

```Javascript
app.get('/search', async function (request, result) {
	if (await checkApiKey(request, result, request.query.apikey)) {
		if (request.query.city && request.query.country) {
			if (await isCityInCountry(request.query.city, request.query.country)) {
				let covid, weather, placesOfInterest, hotels;
				let coordinates = await geoCoding(request);
				
				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('covid') 
				)
					covid = await covidHistory(request);

				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('weather')
				)
					weather = await getWeatherForecast(request, coordinates);

				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('places')
				) {
					placesOfInterest = await getPlacesOfInterest(request, coordinates);

					placesOfInterest = placesOfInterest.sort(sortByProperty('rating'));
					if (placesOfInterest.length > 10) placesOfInterest.length = 10;

					for (let index = 0; index < 10; index++) {
						placesOfInterest[index]['address'] = await reverseGeoCoding(
							request,
							placesOfInterest[index].coordinates
						);
					}
				}

				if (
					!request.query.options ||
					request.query.options.toLowerCase().includes('hotels')
				)
					hotels = await getHotels(request, result);

				const response = require('../json/response.json');

				delete response['covid'];
				delete response['weather'];
				delete response['places'];
				delete response['hotels'];

				if (!request.query.options) {
					response['covid'] = covid;
					response['weather'] = weather;
					response['places'] = placesOfInterest;
					response['hotels'] = hotels;
				} else {
					if (request.query.options.includes('covid'))
						response['covid'] = covid;
					if (request.query.options.includes('weather'))
						response['weather'] = weather;
					if (request.query.options.includes('places'))
						response['places'] = placesOfInterest;
					if (request.query.options.includes('hotels'))
						response['hotels'] = hotels;
				}

				result.send(response);
			} else {
				result.send('City is not in country');
			}
		} else {
			result.send('Missing city or / and country');
		}
	} else {
		result.send('Invalid key');
	}
});	
```
<br>

### 1.2 - Funktionsweise

Beim Aufruf von `/search` wird mit der Funktion `checkApiKey()` überprüft ob ein in der URI angegebener API-key in der Datenbank registriert wurde. So können wir uns absichern, dass ein Nutzer angemeldet sein muss, um die API nutzen zu können. <br>
Die `checkApiKey()`-Funktion liest alle API-Keys aus der Datenbank und überprüft mit einer `for-Schleife`, ob es den angegebenen Key darunter gibt. Die Funktion sieht so aus:

```Javascript
async function checkApiKey(req, res, apikey) {
	let boolean = false;
	let apikeys = await user.getAllApiKeys(req, res);
	apikeys.forEach((element) => {
		if (element.apikey == apikey) {
			boolean = true;
		}
	});
	return boolean;
}
``` 

<br>

Wenn der angegebene API-Key nicht existiert, wird das JSON mit dem Fehlercode `{Invalid Key}` zurückgegeben. Falls der API-Key in der Datenbank gespeichert wurde, wird erst überprüft, ob eine Stadt und ein Land angegeben sind. Beim Fehlen dieser Parameter würde das JSON mit dem Fehlercode `{Missing city or / and country}` zurückgegeben werden. <br>
In dem Fall, dass beide Parameter angegeben wurden, wird überprüft, ob die angegebene Stadt auch in dem jeweiligen angegebenen Land liegt. Dies machen wir mithilfe einer JSON-File, in welcher alle Länder mit den jeweils zugehörigen Städten hinterlegt sind. Die File finden sie  [hier](../json/citiesOfCountries.json).

<br>

Das JSON-Objekt für die Städte und Länder sieht wie folgt aus:

```JSON 
{
	"China": [
		"Guangzhou",
		"Fuzhou",
		"Beijing",
		"Baotou",
		"Hohhot",
		"Guiyang",
		"Yinchuan",
		"Nanjing",
		"Changzhou",
		"Chuzhou",
		"Hefei",
		"Jinan",
		"Qingdao",
		"Harbin",
		"Zhaodong",
		"Taiyuan",
		"Xi'an",
		"Xianyang",
		"Shenzhen",
        ...
    ],
    ...
}
```

<br>

Der Code für die Überprüfung, ob eine Stadt in einem Land liegt, sieht so aus:

```Javascript
async function isCityInCountry(city, country) {
	let countryFirstCharacter = country.charAt(0).toUpperCase();
	let cityFirstCharacter = city.charAt(0).toUpperCase();

	try {
		return countries[countryFirstCharacter + country.slice(1)].includes(cityFirstCharacter + city.slice(1));
	}
	catch(error) {
		return false;
	}
}
```

<br>

Hierbei wird bei einer Stadt, die nicht in dem jeweiligen Land liegt, ein JSON mit dem Fehlercode `{City is not in country}` zurückgegeben. Für den gegenteiligen Fall wird mit der Funktion fortgefahren, wobei mit hilfe einer `GeoCode API` die Koordinaten der Stadt ermittelt werden und im späteren Verlauf für die `Wettervorhersage` und die `Places of Interest` genutzt werden. Die Funktion, die dafür genutzt wird, sieht so aus:

```Javascript
async function geoCoding(request) {
	let coordinates;

	await fetch(
		'https://nominatim.openstreetmap.org/search?city=' +
			request.query.city +
			'&format=json',
		{
			method: 'GET',
		}
	)
		.then((response) => response.json())
		.then(
			(data) =>
				(coordinates = {
					lat: data[0].lat,
					lon: data[0].lon,
				})
		)
		.catch((error) => console.log(error));

	return coordinates;
}
```

<br>

Nachdem nun alle über die Query eingegebene Daten erfasst und überprüft wurden, werden die in der Query angegebenen `options` in einer Reihe von `if-Abfragen` überprüft. <br>
Die Rückgabe kann also `covid`, `weather`, `places` (nach dem Rating sortiert) und `hotels` in einem angegebenen Land enthalten. Wichtig hierbei ist noch, dass wenn der Parameter `options` nicht in der URI gesetzt wurde, alle Informationen zurückgegeben werden. Der Code sieht so aus:

```Javascript
if (
	!request.query.options ||
	request.query.options.toLowerCase().includes('covid') 
)
	covid = await covidHistory(request);

if (
	!request.query.options ||
	request.query.options.toLowerCase().includes('weather')
)
	weather = await getWeatherForecast(request, coordinates);

if (
	!request.query.options ||
	request.query.options.toLowerCase().includes('places')
) {
	placesOfInterest = await getPlacesOfInterest(request, coordinates);

	placesOfInterest = placesOfInterest.sort(sortByProperty('rating'));
	if (placesOfInterest.length > 10) placesOfInterest.length = 10;

		for (let index = 0; index < 10; index++) {
			placesOfInterest[index]['address'] = await reverseGeoCoding(
				request,
				placesOfInterest[index].coordinates
			);
		}
}

if (
	!request.query.options ||
	request.query.options.toLowerCase().includes('hotels')
)
	hotels = await getHotels(request, result);
```

<br>

Nun werden die Responses der einzeln geschriebenen API's (die im Folgenden noch näher erklärt werden, siehe: [covid](#covid), [weather](#weather), [places](#places) und [hotels](#hotels)) in ein JSON-Objekt geschrieben und mit `res.send` zurückgegeben:

```Javascript
const response = require('../json/response.json');

delete response['covid'];
delete response['weather'];
delete response['places'];
delete response['hotels'];

if (!request.query.options) {
	response['covid'] = covid;
	response['weather'] = weather;
	response['places'] = placesOfInterest;
	response['hotels'] = hotels;
} else {
	if (request.query.options.includes('covid'))
		response['covid'] = covid;
	if (request.query.options.includes('weather'))
		response['weather'] = weather;
	if (request.query.options.includes('places'))
		response['places'] = placesOfInterest;
	if (request.query.options.includes('hotels'))
		response['hotels'] = hotels;
}

result.send(response);
```

<br>

Um dies zu tun, wird eine JSON-File genutzt, die bereits eine `success message` als Objekt vorab beinhaltet. Zunächst werden bereits vorhandene Einträge aus dem Objekt gelöscht und anschließend wird das JSON mit den neu ermittelten Informationen gefüllt.

<br>

---

<br>

## API's, die genutzt werden

<br>

## 2. Covid

### 2.1 - Aufbau

So sieht die Funktion aus, welche die Covid-Werte für einen Tag zurückgibt:

```Javascript
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
		console.log(err);
		res.status(500).json({ msg: `Internal Server Error.` });
	}
}
```

<br>

So sieht die Funktion aus, mit welcher die Werte der letzten Woche abgefragt werden:

```Javascript
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
			if(newDate.toString().length == 1) newDate = "0" + newDate;
			if(month.toString().length == 1) month = "0" + month;
			let	assembledDay = year + '-' + month + '-' + newDate;
			
			returnedDays.push(await day(req, res, assembledDay));
		} else {
			let newDate = countDays - i;
			if(newMonth == 0) {year -= 1; newMonth = 12}
			if(newMonth.toString().length == 1) newMonth = "0" + newMonth;
			let assembledDay = year + '-' + newMonth + '-' + newDate;
			
			counter++;
			returnedDays.push(await day(req, res, assembledDay));
		}
	}

	let formatedReturnedDays = await formatJson(returnedDays);

	return formatedReturnedDays;
}
```

<br>

### 2.2 - Funktionsweise

Die `day()`-Funktion nimmt einen `Tag` sowie ein `Land` in der Query entgegen. Mit diesen Werten wird dann ein Request gestellt. Sollte kein Land übergeben werden, wird dieses standardmäßig auf Germany gesetzt:

```Javascript
evalCountry(req.query.country);

function evalCountry(country) {
	if (country == null) {
		return 'Germany';
	} else return country;
}
```

<br>

Die `covidHistory()`-Funktion sorgt dafür, dass mit einer `for-Schleife` die `day()`-Funktion sieben-mal ausgeführt wird, wobei das Datum (`assembledDay`) immer um einen Tag zurückgesetzt wird. <br>
Bei dieser Funktion wird außerdem darauf geachtet, dass es passieren kann, dass die sieben Tage in den letzten Monat hineinreichen können. In diesem Fall wird der Monat um 1 zurückgesetzt. Auch das Jahresende wurde hierbei berücksichtigt, sodass bei einem Jahreswechsel das Jahr um 1 verringert und der Monat auf 12 zurückgesetzt wird. Der Code sieht so aus:

```Javascript
for (let i = 1; i < 8; i++) {
	if (date.getDate() - i > 0) {
		let newDate = date.getDate() - i;
		if(!newDate.toString().length > 1) newDate = "0" + newDate;
		if(month.toString().length == 1) month = "0" + month;

		let	assembledDay = year + '-' + month + '-' + newDate;
		returnedDays.push(await day(req, res, assembledDay));
	} else {
		let newDate = countDays - i;
		if(newMonth == 0) {year -= 1; newMonth = 12}
		if(newMonth.toString().length == 1) newMonth = "0" + newMonth;
		
		let assembledDay = year + '-' + newMonth + '-' + newDate;
		counter++;
		returnedDays.push(await day(req, res, assembledDay));
	}
}
```

<br>

Nach Ablauf dieser Funktion werden noch für unsere Zwecke nicht notwendige Informationen entfernt und die wichtigen Daten in ein JSON-Objekt geschrieben. und für die weitere Nutzung  unserer API zurückgegeben. Die Funktion sieht so aus:

```Javascript
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
		}
	}
	return filteredjs;
}
```

<br>

## 3. Weather

### 3.1 - Aufbau

Aufbau des Requests:

```Javascript
async function getWeatherForecast(request, givenCoordinates) {
	let data;
	let forecast = Array();

	const date = new Date();

	let start;

	if(givenDates.start) {
		// validate given date
		if(Date.parse(givenDates.start)) {
			// format given date to fit API
			start = await formatDate(new Date(Date.parse(givenDates.start)));
		}
		else {
			start = await formatDate(date);
		}
	}
	else {
		start = await formatDate(date);
	}

	let end = (givenDates.end) ? givenDates.end : await formatDate(new Date(new Date(start).getTime() + 60 * 60 * 24 * 1000));

	let latitude = (await request.query.lat)
		? request.query.lat
		: givenCoordinates.lat;
	let longitude = (await request.query.lon)
		? request.query.lon
		: givenCoordinates.lon;

	await fetch(
		'https://api.open-meteo.com/v1/forecast?latitude=' +
			latitude +
			'&longitude=' +
			longitude +
			'&hourly=relativehumidity_2m,temperature_2m,rain,snowfall,snow_depth,cloudcover,soil_temperature_0cm&start_date=' +
			start +
			'&end_date=' +
			end,
		{
			method: 'GET',
		}
	)
		.then((response) => response.json())
		.then((result) => (data = result))
		.catch((error) => console.log(error));

	try {
		for (let index = 0; index < data.hourly.time.length; index++) {
			let time = data.hourly.time[index];
			let humidity = data.hourly.relativehumidity_2m[index] + '%';
			let temperature = data.hourly.temperature_2m[index] + '°C';
			let rain = data.hourly.rain[index] + 'mm';
			let snowfall = data.hourly.snowfall[index] + 'cm';
			let snowDepth = data.hourly.snow_depth[index] + 'm';
			let cloudCover = data.hourly.cloudcover[index] + '%';
			let soilTemperature = data.hourly.soil_temperature_0cm[index] + '°C';
	
			forecast.push({
				time,
				temperature,
				soilTemperature,
				rain,
				humidity,
				snowfall,
				snowDepth,
				cloudCover,
			});
		}
	}
	catch(error) {
		return {
			error: "Timespan is too large"
		}
	}

	return {
		coordinates: {
			lat: latitude,
			lon: longitude,
		},
		forecast: forecast,
	};
}
```

<br>

### 3.2 - Funktionsweise

Bei dieser Funktion wird standardmäßig eine Vorhersage für die nächsten 24h zurückgegeben. Daher wird zunächst das aktuelle Datum ermittelt. Anschließend wird das Datum in 24h ermittelt. Die `formatDate()`-Funktion formatiert das jeweilige Datum, sodass es für ein Request dieser API verwendet werden kann. Diese Funktion sieht so aus:

```Javascript
async function formatDate(date) {
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var day = ("0" + date.getDate()).slice(-2);

	return year + '-' + month + '-' + day;
}
```

<br>

Als optionale Parameter unserer API sind auch `start` (Start-Datum) und `end` (End-Datum) zugelassen. Um die Funktion des Requests zu gewährleisten, wird hier das Start-Datum ausreichend auf die Validität überprüft. Sollte das angegebene Datum nicht valide sein, wird mit dem Standard-Wert weitergemacht. 

<br>

Anschließend werden die Koordinaten festgelegt. Diese können entweder über die Query bei einem Aufruf von `/weather` oder über den Parameter `givenCoordinates` (Aufruf `/search`) übergeben werden. Mithilfe einer `if-Abfrage` wird entschieden, mit welchen Werten fortgefahren wird.

<br>

Wurde eine Antwort der API erhalten, wird diese in ihren Informationen auf unsere Anforderungen angepasst, indem ein neues JSON-Objekt gefüllt und zurückgegeben wird.

<br>

## 4. Places

### 4.1 - Aufbau

```Javascript
async function getPlacesOfInterest(request, givenCoordinates) {
	// define API key
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '9e901e3198msh328f043ebfacb97p100ef1jsnc64a274704d8',
			'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
		},
	};

	// public variables which will contain the data later
	let data;
	let result = Array();

	let latitude = (await request.query.lat)
		? request.query.lat
		: givenCoordinates.lat;
	let longitude = (await request.query.lon)
		? request.query.lon
		: givenCoordinates.lon;

	// fetch opentripmap API
	await fetch(
		'https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=250&lon=' +
			longitude +
			'&lat=' +
			latitude,
		options
	)
		.then((response) => response.json())
		.then((response) => {
			// response from opentripmap
			data = response.features;
		})
		.catch((err) => console.error(err));

	// filter given data to get what we really need
	for (let index = 0; index < data.length; index++) {
		if (
			data[index].properties.name.length > 0 ||
			data[index].properties.name.wikidata != undefined
		) {
			let coordinates = {
				lon: data[index].geometry.coordinates[0],
				lat: data[index].geometry.coordinates[1],
			};
			let name = data[index].properties.name;
			let wiki;

			if (data[index].properties.wikidata != undefined) {
				wiki =
					'https://www.wikidata.org/wiki/' + data[index].properties.wikidata;
			} else {
				wiki = 'undefined';
			}

			let rating = data[index].properties.rate;

			result.push({ name, coordinates, wiki, rating });
		}
	}

	return result;
}
```

<br>

### 4.2 - Funktionsweise

Um die API nutzen zu können, müssen die Koordinaten einer Stadt übergeben werden. Diese können entweder über die Query (`/places`) oder über den Parameter `givenCoordinates` übergeben werden. Mithilfe einer `if-Abfrage` wird entschieden, mit welchen Werten fortgefahren wird.

<br>

Wurde eine Antwort erhalten, wird diese auf die wichtigsten Informationen heruntergebrochen, indem ein neues JSON-Objekt gefüllt uund in ein Array geschrieben. Dieser Array wird zurückgegeben.

<br>

## 5. Hotels

### 5.1 - Aufbau

```Javascript
exports.getHotels = async function (req, res) {
	let object = Array();
	let data = await getHotelsInCity(req.query.city, req, res);

	data.forEach((element) => {
		object.push({
			location: element.location,
			name: element.name,
			address: element.address,
			phone: element.phone,
			email: element.email,
			url: element.url,
			currency: element.currency,
			price: element.price,
			content: element.content,
			geo: element.geo,
		});
	});

	return object;

};

async function getHotelsInCity(searchCity, req, res) {
	try {
		let countries = new Array();
		hotels.forEach((element) => {
			if (element.location.toLowerCase().includes(searchCity.toLowerCase())) {
				countries.push(element);
			}
		});
		return countries;
	} catch (err) {
		return err;
	}
}
```

<br>

### 5.2 - Funktionsweise

Die Hotels werden aus einer JSON-File gelesen (siehe [hier](../json/hotels.json)), welche ein Array bestehend aus Hotels enthält. Diese JSON-File ist wie folgt aufgebaut:

```JSON
{
	"location": "Brecon Beacons National Park",
	"name": "Beili Helyg Guest House",
	"alt": null,
	"address": "Cwm Cadlan, Penderyn, CF44 0YJ",
	"directions": "From Penderyn, follow Cwm Cadlan road from Lamb Hotel for 1.5 miles, you'll see sign and yellow grit bin at the gate on your left.",
	"phone": "+44 0 1685 813609",
	"tollfree": null,
	"email": "willow.walks@hotmail.co.uk",
	"fax": null,
	"url": "http://www.beilihelygguesthouse.co.uk",
	"hours": null,
	"checkin": null,
	"checkout": null,
	"image": null,
	"currency": "Pound",
	"price": 80,
	"content": "Fantastic little B&B with 3 rooms, all en-suite. Very comfortable beds, friendly hosts, delicious breakfasts. Ideally placed for waterfalls and mountains, Walkers and cyclists welcome.",
	"geo": {
		"lat": 51.7823,
		"lon": -3.4959
	},
	"activity": "sleep",
	"type": "landmark",
	"id": 4042
},
...
```

<br>

Die JSON-File wird mit einer `forEach-Schleife` durchlaufen und filtert alle Hotels heraus, bei denen die angegebene `location` dem in der Query angegebenen Stadtnamen entsprechen. Der Code sieht wie folgt aus:

```Javascript
const hotels = require('../json/hotels.json');

hotels.forEach((element) => {
	if (element.location.toLowerCase().includes(searchCity.toLowerCase())) {
		countries.push(element);
	}
});
```

<br>

Die Daten, die wir aus der JSON-File erhalten, werden auf die wichtigsten Informationen gekürzt und für die Rückgabe in ein JSON-Objekt umgewandelt.
