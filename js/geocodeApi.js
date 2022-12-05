const fetch = require("node-fetch");

async function reverseGeoCoding(request, result){

    let coordinates;
    
    await fetch("https://nominatim.openstreetmap.org/reverse?lat=" + request.query.lat + "&lon=" + request.query.lon + "&format=json", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => coordinates = {
        "city": data.address.city,
        "country": data.address.country
    })
    .catch(error => console.log(error));

    return coordinates;

}
 
async function geoCoding(request, result){

    let coordinates;
    
    await fetch("https://nominatim.openstreetmap.org/search?city=" + request.query.city + "&format=json", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => coordinates = {
        "latitude": data[0].lat, 
        "longitude": data[0].lon
    })
    .catch(error => console.log(error));

    return coordinates;

}

module.exports = {reverseGeoCoding, geoCoding};