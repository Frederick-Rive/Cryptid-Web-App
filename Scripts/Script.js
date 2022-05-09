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

// NOTE: Marker Example
var testmark = L.marker([-41.2924, 174.7787]).bindPopup('I AM A MASSIVE TEST').addTo(map);
testmark.addTo(map);
