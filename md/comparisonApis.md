# Diskussion der Webservices

In den nächsten Abschnitten sollen verschiedene Alternativen zu den von uns genutzten Webservices aufgezeigt werden. Außerdem soll erklärt werden, warum wir uns für die genutzten API's entschieden haben.

## Inhaltsverzeichnis

1. [Covid](#1-covid)
	1. [Alternativen](#11---alternativen)
	2. [Konklusion](#12---konklusion)
2. [Weather](#2-weather)
	1. [Alternativen](#21---alternativen)
	2. [Konklusion](#22---konklusion)
3. [Places](#3-places)
	1. [Alternativen](#31---alternativen)
	2. [Konklusion](#32---konklusion)
4. [GeoCode](#4-geoCode)
	1. [Alternativen](#41---alternativen)
	2. [Konklusion](#42---konklusion)

<br>

## 1. Covid

Die von uns genutzte API ist die `Covid-19`-API von `API-SPORTS`, welche wir auf [RapidApi](https://rapidapi.com/api-sports/api/covid-193/) gefunden haben.

### 1.1 - Alternativen

Für diese API gibt es einige Alternativen, welche ebenfalls auf der Seite `RapidApi` gefunden werden können. Die Auswahl lautet wie folgt:

- `COVID-19 Coronavirus Statistics` von `Andrew Kish` ([Link](https://rapidapi.com/KishCom/api/covid-19-coronavirus-statistics/))
- `COVID-19 Statistics` von `Axisbits` ([Link](https://rapidapi.com/axisbits-axisbits-default/api/covid-19-statistics/))
- `COVID-19 News` von `Newscatcher API` ([Link](https://rapidapi.com/newscatcher-api-newscatcher-api-default/api/covid-19-news/))

### 1.2 - Konklusion

Der größte Vorteil der von uns gewählten API ist, dass diese eine Verifizierung durch RapidApi erhalten hat, wodurch eine hohe Qualität dieses Webservices gegeben ist. Ein zusätzlicher Vorteil dieser spezifischen API ist die Möglichkeit, Daten eines bestimmten Tages ausgeben zu können. Diese Funktion ist bei den Alternativen nicht vorhanden. Ein weiterer wichtiger Punkt ist, dass diese API völlig kostenlos ist.

<br>

## 2. Weather

Die von uns genutzte API ist die `Weather Forecast API` von [Open-Meteo](https://open-meteo.com/en/docs).

### 2.1 - Alternativen

Auch für diese API gab es einige Alternativen, welche im Folgenden aufgelistet werden:

- `Weather API` von `Meteum` ([Link](https://b2b.meteum.ai/api?utm_medium=cpc&utm_source=google&utm_term=weather%20api&utm_campaign=Google_Search_Meteum_B2B_api_tier1&utm_content=144519232442&hsa_acc=4164713119&hsa_cam=18729943627&hsa_grp=144519232442&hsa_ad=631264225636&hsa_src=g&hsa_tgt=kwd-40383213246&hsa_kw=weather%20api&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gclid=CjwKCAiAkrWdBhBkEiwAZ9cdcHrLEJtT3EkzSqWWJSDLhc8nVrl7IatmdM1dq06BLZUqNJcLh652YRoCF2EQAvD_BwE))
- `Weather API` von `OpenWeather` ([Link](https://openweathermap.org/api))
- `Weather API` von `Weather API` ([Link](https://www.weatherapi.com/docs/))

### 2.2 - Konklusion

Der größte Vorteil der von uns genutzten API ist, dass diese völlig kostenlos ist und zudem keine Beschränkung der Aufrufe enthält. Diesen Aspekt besitzen die Alternativen nicht. Zudem hat uns die Quantität sowie die Qualität der Rückgabe sehr überzeugt.

<br>

## 3. Places

Die von uns genutzte API ist die `Places`-API von `opentripmap`, welche wir auf [RapidApi](https://rapidapi.com/opentripmap/api/places1/) gefunden haben.

### 3.1 - Alternativen

- `Geoapify API` von `Geoapify` ([Link](https://www.geoapify.com/places-api))
- `Places API` von `FOURSQUARE` ([Link](https://location.foursquare.com/developer/reference/places-api-overview))
- `Places API` von `SAFE GRAPH` ([Link](https://www.safegraph.com/products/places))

### 3.2 - Konklusion

Wir haben uns für die Places-API von opentripmap entschieden, da diese einen völlig kostenlosen Plan beinhaltet und dafür lediglich ein Tageslimit an Aufrufen aufweist. Die Alternativen weisen keine wirklich kostenlosen Pläne auf und haben sogar sich skalierende Kosten in Bezug auf die Anforderungen. Außerdem weist die von uns gewählte API einen großen und qualitativ hochwertigen Datenbestand auf, sodass wir uns für diese entschieden haben.

<br>

## 4. GeoCode

Die von uns genutzte API ist die `Nominatim`-API von [OpenStreetMap](https://nominatim.openstreetmap.org/ui/search.html).

### 4.1 - Alternativen

- `Geocodinh API` von `Geocode.xyz` ([Link](https://geocode.xyz/api))
- `Geocoding API` von `OpenWeather` ([Link](https://openweathermap.org/api/geocoding-api))
- `Geocoding API` von `Geoapify` ([Link](https://www.geoapify.com/geocoding-api))

### 4.2 - Konklusion

Wir haben uns für die `Nominatim`-API entschieden, da diese im Gegensatz zu den Alternativen völlig kostenlos ist und keine Einschränkung der Aufrufe hat. Zudem gibt diese API genau die von uns benötigten Daten aus und hat eine sehr kurze Antwortzeit.