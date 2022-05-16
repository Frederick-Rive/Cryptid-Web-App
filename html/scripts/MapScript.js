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

function GetAccountsFromDatabase(search = "") {
    const xhttp = new XMLHttpRequest();

    var accountArr = [];

    xhttp.onload = function () {
        if (this.responseText != "NULL") {
            accountArr = JSON.parse(this.responseText);
            console.log(accountArr.length)
        }
        else {
            return "NULL";
        }
    }

    xhttp.open("GET", "http://localhost:6069/accounts?keyword=" + search, true);
    xhttp.send();

    console.log(accountArr.length);
    return accountArr;
}

function PushAccountToDatabase(account) {
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://localhost:6069/accounts", true);
    xhttp.send(JSON.stringify(account));
}

