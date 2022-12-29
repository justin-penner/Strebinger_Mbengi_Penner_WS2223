# Proof of concept

Im folgenden sollen Handlungen mit unserer Anwendung aufgelistet werden. Exit-Kriterien, Fail-Kriterien

## `Search`

### 1.1  `/search` - Aufbau

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

### 1.2 `/search` - Funktionsweise
<hr>

Hierbei wird mit der Funktion `checkApiKey()` überprüft ob ein in der URI angegebener API-key in der Datenbank registriert wurde. So sichern wir, dass ein Nutzer sich anmelden müsste, um die Anwendung nutzen zu können. <br>
Die `checkApiKey()` Funktion holt sich aus der Datenbank alle API-keys und überprüft mit einer `for-Schleife`, ob es diesen darunter gibt:

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

Wenn der API-key nicht existiert, wird das JSON mit Fehlercode  `{Invalid Key}` zurückgegeben. Falls der API-key in der Datenbank gespeichert wurde, wird erst überprüft, ob eine Stadt und ein Land angegeben sind. Beim Fehlen dieser parameter würde das JSON mit Fehlercode `{Missing city or / and country}` zurückgegeben werden. <br>
In dem Fall das beide Parameter angegeben wurden, wird geschaut, ob die angegebene Stadt auch in dem jeweiligen angegebenen Land liegt. Dies machen wir mithilfe einer JSON File in der Länder mit den jeweiligen Städten drin stehen ([here](../json/citiesOfCountries.json))
<br>

Das JSON Objekt für die Städte in den Ländern sieht wie folgt aus:

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

Der Code für die Überprüfung ob eine Stadt in einem Land liegt so:

```Javascript
	async function isCityInCountry(city, country) {
		return countries[country].includes(city);
	}
```

Hierbei wird bei einer Stadt, die nicht in dem jeweiligen Land liegt ein JSON mit Fehlercode `{City is not in country}` zurückgegeben. Für den anderen Fall wird mit der Funktion fortgefahren,
wobei mit hilfe einer `Geo Code API` die Coordinaten der Stadt geholt werden und im späteren Verlauf für die `Wettervorhersage` und die `Places of Interest` genutzt werden.

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
Nachdem nun alle über die Query eingegebene Daten erfasst und überprüft wurden, werden die in der query angegebenen `options` in einer Reihe von `If-Abfragen` überprüft. <br>
Die Rückgabe kann also `covid`, `weather`, `places` (nach rating sortiert) und `hotels` in einem angegebenen Land enthalten und dabei ist noch wichtig, dass wenn keine options angegeben sind, alle vier dieser in der Rückgabe vorhanden sind.

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

Nun werden die responses der einzeln geschriebenen API's (die im Folgenden noch näher erklärt werden, siehe: [covid](#covid), [weather](#weather), [places](#places) und [hotels](#hotels)) in ein JSON objekt geschrieben und mit einem res.send zurückgegeben.

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

Hierzu wird eine JSON file erstellt, die eine `success message` als Objekt schon vorab reingeschrieben hat verwendet. Erst wird sichergestellt, die falls schon verhandenen Responses zu löschen und dann die neuen Responses als Objekt in die JSON File zu schreiben.

<br>

## API's für das zurückgegebene JSON Objekt
<hr> <br>

## `Covid`

### 2.1 `/covid` - Aufbau
<hr>
<br>

Die Abfrage an die Covid Api um einen Tag zu bekommen:

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

Die Abfrage um daraus eine Abfrage für die gesamte letzte Woche zu machen:

```Javascript
	async function covidHistory(req, res) {
		let returnedDays = new Array();
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let countDays = new Date(year, month - 1, 0).getDate();

		let counter = 0;
		for (let i = 1; i < 8; i++) {
			if (date.getDate() - i > 0) {
				let newDate = date.getDate() - i;
				let assembledDay;
				if (newDate.toString().length > 1) {
					assembledDay = year + '-' + month + '-' + newDate;
				} else {
					assembledDay = year + '-' + month + '-' + '0' + newDate;
				}

				returnedDays.push(await day(req, res, assembledDay));
			} else {
				let newDate = countDays - counter;
				let newMonth = month - 1;
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

### 2.2 `/covid` - Funktionsweise
<hr>
<br>

Die `day()` Funktion nimmt einen `Tag`, `req` und `res` (in der `req.query auch ein Land`) entgegen, womit dann ein Fetch-Request gestellt wird. 
Das Land für den Fetch automatisch auf Deutschland gesetzt:

```Javascript
	evalCountry(req.query.country)

	function evalCountry(country) {
		if (country == null) {
			return 'Germany';
		} else return country;
	}

```

Die `covidHistory()` Funktion sorgt dafür, dass mit einer `for-schleife` die `day()` Funktion sieben mal ausgeführt wird, wobei das Datum (`assembledDay`) immer um einen Tag zurückgesetzt wird. <br>
Dabei wird auch darauf geachtet das es passieren kann, das die sieben Tage in den letzen Monat reichen können, wobei dann der Monat auch einen zurückgesetzt wird.

```Javascript
	for (let i = 1; i < 8; i++) {
		if (date.getDate() - i > 0) {
			let newDate = date.getDate() - i;
			let assembledDay;
			if (newDate.toString().length > 1) {
				assembledDay = year + '-' + month + '-' + newDate;
			} else {
				assembledDay = year + '-' + month + '-' + '0' + newDate;
			}
			returnedDays.push(await day(req, res, assembledDay));

		} else {
			let newDate = countDays - counter;
			let newMonth = month - 1;
			let assembledDay = year + '-' + newMonth + '-' + newDate;
			counter++;
			returnedDays.push(await day(req, res, assembledDay));
		}
	}
```

Hiernach werden noch für unsere Zwecke nicht notwendige Informationen gestrichen und die wichtigen in ein JSON Objekt geschrieben und für das Nutzen in der `/search` query unserer API zurückgegeben.

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

## `Weather`

### 3.1 `/weather` - Aufbau
<hr>
<br>

Aufbau des Fetch-Requests:

```Javascript
	async function getWeatherForecast(request, givenCoordinates) {
		let data;
		let forecast = Array();

		const date = new Date();

		let start = await formatDate(date);
		let end = await formatDate(new Date(date.getTime() + 60 * 60 * 24 * 1000));

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

### 2.2 `/weather` - Funktionsweise
<hr>
<br>


<br>

## `Places`

### 3.1 `/places` - Aufbau
<hr>
<br>




<br>

### 3.2 `/places` - Funktionsweise
<hr>
<br>





<br>

## `Hotels`

### 3.1 `/hotels` - Aufbau
<hr>
<br>

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

### 3.2 `/hotels` - Funktionsweise
<hr>
<br>

Die Hotels werden aus einer JSON File geholt ([here](../json/hotels.json)), die ein Array von Hotels enthällt. Diese JSON file ist so aufgebaut:

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

Die JSON File wird mit einer `for-each-Schleife` durchlaufen und sucht alle Hotels raus, bei denen die angegebene `location` den in der query angegebenen Stadtnamen enthält (`.includes`)

```Javascript
	const hotels = require('../json/hotels.json');

	hotels.forEach((element) => {
		if (element.location.toLowerCase().includes(searchCity.toLowerCase())) {
			countries.push(element);
		}
	});
```

Die Daten, die wir aus der JSON File bekommen, werden auch wieder auf die wichtigsten gekürzt und für die Rückgabe für die `/search` query in ein JSON objekt umgewandelt