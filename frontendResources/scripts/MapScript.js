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

//Pin display elements
var desc = document.getElementById('pinInfo');
var time = document.getElementById('pinTime');
var loc = document.getElementById('pinLocation');

//Pin addition elements
var newPin = document.getElementById('newPin');
var pinName = document.getElementById('pinName');
var pinCryptid = document.getElementById('pinCryptid');
var descriptionMap = document.getElementById('descriptionMap');
var pinLng = document.getElementById('Longitude');
var pinLat = document.getElementById('Latitude');
var pinTime = document.getElementById('Time');
var pinImages = document.getElementById('imageUpload');

//New Pin indicator
var pinIndicator;
var creatingPin = false;

//display Latitude and Longitude on map when clicked
map.on('click', function (e) {
    if (creatingPin) {
        pinLat.value = e.latlng.lat;
        pinLng.value = e.latlng.lng;
        if (pinIndicator != undefined) {
            map.removeLayer(pinIndicator);
        }
        pinIndicator = L.marker(e.latlng).addTo(map);
    }
});

// New pin creation (map)
function OpenPinCreator() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        account = JSON.parse(this.responseText);
        if (account.username != "NULL") {
            document.getElementById('pinCreation').style.display = "flex";
            creatingPin = true;
        }
        else {
            console.log("SIGN IN");
        }
    }
    xhttp.open("GET", "http://localhost:6069/account", true);
    xhttp.send();
}

function ClosePinCreator() {
    document.getElementById('pinCreation').style.display = "none";
    if (pinIndicator != undefined) {
        map.removeLayer(pinIndicator);
    }
    creatingPin = false;
}

function CreatePin() {
    var url = pinImages.value;
    console.log(url);
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

    if (pinImages.files && pinImages.files[0] && (ext == "png" || ext == "jpeg" || ext == "jpg") /*temp addition, remove*/ && false) {
        const reader = new FileReader();

        reader.onload = function () {
            var pinJSON = {
                title: pinName.value,
                cryptid: pinCryptid.value,
                description: descriptionMap.value,
                coordinates: [pinLat.value, pinLng.value],
                time: pinTime.value,
                images: reader.result
            };

            console.log(pinJSON);

            const xhttp = new XMLHttpRequest();

            xhttp.onload = function () {
                console.log(res.body);
                ClosePinCreator();
            }

            xhttp.open("POST", "http://localhost:6069/pins", true);
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify(pinJSON));
        }

        reader.readAsDataURL(pinImages.files[0]);
    } else {
        var pinJSON = {
            title: pinName.value,
            cryptid: pinCryptid.value,
            description: descriptionMap.value,
            coordinates: [pinLat.value, pinLng.value],
            time: pinTime.value,
            images: "haha"
        };

        console.log(pinJSON);

        const xhttp = new XMLHttpRequest();

        xhttp.onload = function () {
            console.log(res.body);
            ClosePinCreator();
        }

        xhttp.open("POST", "http://localhost:6069/pins", true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(pinJSON));
    }
}

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
