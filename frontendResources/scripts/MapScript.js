//creating the map
var map = L.map('Mapid').setView([-41.2924, 174.7787], 13);

//adding a tile layer to the map
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
	worldCopyJump: true,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// adding the tile map to the map
// NOTE: needs to be added to a varible called 'Layer'(case-sensitive) before being added to map
var Layer = OpenStreetMap_Mapnik
Layer.addTo(map);

// Content for TestPinA
var coordinates = [-41.2913, 174.7886];
var title = "TestPinA";
// Gets the current pin information on the map page
var desc = document.getElementById('pinInfo');
var time = document.getElementById('pinTime');
var loc = document.getElementById('pinLocation');


function onMarkerClick(e) {
	//Updates the currently showing pin information the map page
	desc.textContent = "[PH] new description";
	time.textContent = "[PH] new time";
	loc.textContent = "[PH] new location";
	console.log('click confirmed');
}

//display Latitude and Longitude on map when clicked
map.on('click', function(e) {
		var test = L.popup().setLatLng(e.latlng).setContent(`Latitude: ${e.latlng.lat}<br> Longitude: ${e.latlng.lng}`).openOn(map);
	map.openPopup(test);
});

// NOTE: Marker Example
// Creates a map marker with the description update event added to it on the map
var testmark = L.marker(coordinates).bindPopup(title).on('dblclick', onMarkerClick).addTo(map);
testmark.addTo(map);

//Functions for communicating with the backend
function GetPinsFromDatabase() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        var pinArr = JSON.parse(this.responseText);
        for (i = 0; i < pinArr.length; i++) {
            var pin = pinArr[i];

            // NOTE: Marker Example
            var testmark = L.marker(pin.coordinates).bindPopup(pin.title).addTo(map);
            testmark.addTo(map);
        }
    }

    xhttp.open("GET", "http://localhost:6069/pins", true);
    xhttp.send();
}

GetPinsFromDatabase();
