//creating the map
var map = L.map('Mapid').setView([-41.2924, 174.7787], 13);

//adding a tile layer to the map
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// adding the tile map to the map
var Layer = OpenStreetMap_Mapnik
Layer.addTo(map);

var coordinates = [-41.2913, 174.7886];
var title = "TestPinA";

// NOTE: Marker Example
var testmark = L.marker(coordinates).bindPopup(title).addTo(map);
testmark.addTo(map);

const xhttp = new XMLHttpRequest();

xhttp.onload = function () {
    var pin = JSON.parse(this.responseText);
    coordinates = pin.coordinates;
    title = pin.title;
    console.log(title);
    // NOTE: Marker Example
    var testmark = L.marker(coordinates).bindPopup(title).addTo(map);
    testmark.addTo(map);
}

xhttp.open("GET", "http://localhost:6069/pins", true);
xhttp.send();

