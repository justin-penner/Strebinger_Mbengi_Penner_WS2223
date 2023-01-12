# REST-Schnittstellen

## search

| Typ | URI                                                                          | Beschreibung                                                    | zurückgegebener Datentyp | Codes    |
|-----|------------------------------------------------------------------------------|-----------------------------------------------------------------|--------------------------|----------|
| GET | /search?apikey=apikey&city=param&country=param                         | gibt alle Statistiken zurück, die unsere Anwendung leifern kann | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Covid           | gibt nur Statistiken über Covid zurück                          | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Places          | gibt nur Statistiken über interessante Orte zurück              | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Weather         | gibt nur Statistiken über das Wetter zurück                     | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Hotels          | gibt nur Statistiken über Hotels zurück                         | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=param,param | gibt gefragte Statistiken zurück                                | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Weather&start=date | gibt das Wetter für die nächsten 24h ab dem Start-Datum aus                                | JSON                     | 200, 400 |
| GET | /search?apikey=apikey&city=param&country=param&options=Weather&start=date&end=date | gibt das Wetter zwischen dem Start- und dem End-Datum aus                                | JSON                     | 200, 400 |
