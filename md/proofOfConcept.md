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
<br>
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
<br>
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
<br>

Nun werden die responses der einzeln geschriebenen API's (die im Folgenden noch näher erklärt werden, siehe: [covid](###Covid), [weather](###Weather), [places](###Places) und [hotels](###hotels)) in ein JSON objekt geschrieben und mit einem res.send zurückgegeben.

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

## `Covid`

### 2.1 `/covid` - Aufbau










































<!-- <br>

In the following some points of intersection will be shown.

<br>

## CovidAPI

```console

    localhost:3000/covid?country=<param>

```

<br>

## PlacesAPI

```console

    localhost:3000/poi?lat=<param>&lon=<param>

```

<br>

## WeatherAPI

```console

    localhost:3000/weather?lat=<param>&lon=<param>&start=<YEAR-MONTH-DAY>&end=<YEAR-MONTH-DAY>

```

<br>

## GeoCodeAPI

```console

    localhost:3000/geocode?city=<param>

```

<br>

## Reverse GeoCodeAPI

```console

    localhost:3000/reversegeocode?lat=<param>&lon=<param>

``` -->