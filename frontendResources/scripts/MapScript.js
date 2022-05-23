//creating the map
var map = L.map('Mapid').setView([-41.2924, 174.7787], 13);

//adding a tile layer to the map
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// adding the tile map to the map
// NOTE: needs to be added to a varible called 'Layer'(case-sensitive) before being added to map
var Layer = OpenStreetMap_Mapnik
Layer.addTo(map);

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


const desc = document.getElementById('pinInfo');
const time = document.getElementById('pinTime');
const loc = document.getElementById('pinLocation');

// NOTE: Marker Example
// Creates a map marker with the description update event added to it on the map
var testmark = L.marker(coordinates).bindPopup(title).on('dblclick', onMarkerClick).addTo(map);
testmark.addTo(map);

function onMarkerClick(e) {
    //Updates the currently showing pin information the map page
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        console.log(this.responseText);
        thisPin = JSON.parse(this.responseText);
        const xhttp2 = new XMLHttpRequest();

        xhttp2.onload = function () {
            console.log(this.responseText);
            thisEncounter = JSON.parse(this.responseText);
            desc.textContent = "Description: " + thisEncounter.description;
            time.textContent = "Time: " + thisEncounter.datetime;
            loc.textContent = "Location: " + thisEncounter.location;
            console.log('click confirmed');
        }

        xhttp2.open("GET", "http://localhost:6069/encounter?keyword=" + thisPin.encounter, true);
        xhttp2.send();
    }

    console.log(e.target.getPopup().getContent());

    xhttp.open("GET", "http://localhost:6069/pins?keyword=" + e.target.getPopup().getContent(), true);
    xhttp.send();
}

//Functions for communicating with the backend
function GetPinsFromDatabase() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        var pinArr = JSON.parse(this.responseText);
        for (i = 0; i < pinArr.length; i++) {
            var pin = pinArr[i];

            var marker = L.marker(pin.coordinates).bindPopup(pin.title).on('dblclick', onMarkerClick).addTo(map);
            marker.addTo(map);
        }
    }

    xhttp.open("GET", "http://localhost:6069/pins", true);
    xhttp.send();
}

GetPinsFromDatabase();
