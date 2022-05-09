//creating the map
var map = L.map('Mapid').setView([0, 0], 13);

//adding a tile layer to the map
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// NOTE: Work in progress
var Layer = OpenStreetMap_Mapnik

Layer.addTo(map);
