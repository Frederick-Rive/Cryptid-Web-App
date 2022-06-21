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

//Dynamic Array of all pins on the map
var pinList = [];

//ID of opened encounter
var encounterID;

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

// Post a comment to theb
function PostComment()
{

  const commentInput = document.getElementById("commmentCreation");

	const commentJSON = {
		text: commentInput.value,
		encounter: encounterID
	};

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "http://localhost:6069/comment");
  xhttp.setRequestHeader('Content-type', 'application/json');
	xhttp.send(JSON.stringify(commentJSON));
}

// New pin creation (map)
function OpenPinCreator() {
		NotifyUser();
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        account = JSON.parse(this.responseText);
        ClosePinDisplay();
        if (account.username != "NULL") {
            document.getElementById('pinCreation').style.display = "flex";
            creatingPin = true;
        }
        else {
            NotifyUser("Please Sign In to create a pin")
        }
    }
    xhttp.open("GET", "http://localhost:6069/account", true);
    xhttp.send();
}

function ClosePinCreator() {
		NotifyUser();
    document.getElementById('pinCreation').style.display = "none";
    pinName.value = ""
    pinCryptid.value = ""
    descriptionMap.value = ""
    pinLat.value = ""
    pinLng.value = ""
    pinTime.value = ""
    if (pinIndicator != undefined) {
        map.removeLayer(pinIndicator);
    }

    creatingPin = false;
}

function OpenPinDisplay() {
    ClosePinDisplay();
    document.getElementById('pinDisplay').style.display = "flex";
}

function ClosePinDisplay() {
		NotifyUser();
    document.getElementById('pinDisplay').innerHTML = '<h2>Pin Information</h2><hr style = "width: 60%; margin-left: 0;"><h2 id="pinTitle"></h2><h3 id="pinUser"></h3<p id="pinCryptid"></p><p id="pinLocation"></p><p id="pinTime"></p> <p id="pinInfo"></p>';
    document.getElementById('pinDisplay').style.display = "none";
}

function CreatePin() {
    var url = pinImages.value;
    console.log(url);
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

    if (pinImages.files && pinImages.files[0] && (ext == "png" || ext == "jpeg" || ext == "jpg")) {
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

            const xhttp = new XMLHttpRequest();

            xhttp.onload = function () {
                console.log("eh?");
            }

            xhttp.open("POST", "http://localhost:6069/pins", true);
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify(pinJSON));
						ClosePinCreator();
						GetPins();
        }

        reader.readAsDataURL(pinImages.files[0]);
    } else {
        var pinJSON = {
            title: pinName.value,
            cryptid: pinCryptid.value,
            description: descriptionMap.value,
            coordinates: [pinLat.value, pinLng.value],
            time: pinTime.value,
            images: "NULL"
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
        thisPin = JSON.parse(this.responseText);
        const xhttp2 = new XMLHttpRequest();

        xhttp2.onload = function () {
            ClosePinCreator();
            OpenPinDisplay();

            var thisEncounter = JSON.parse(this.responseText);
            var pinDisplay = document.getElementById('pinDisplay');

						document.getElementById('pinTitle').textContent = thisEncounter.title;
            document.getElementById('pinInfo').textContent = "Description: " + thisEncounter.description;
            document.getElementById('pinTime').textContent = "Time: " + thisEncounter.datetime;
            document.getElementById('pinLocation').textContent = "Location: " + thisEncounter.location;

						const xhttp3 = new XMLHttpRequest();
						xhttp3.onload = function () {
							var thisAccount = JSON.parse(this.responseText);
							document.getElementById('pinUser').innerHTML = "User: <a href='#'' onclick='toProfile(" + ('"' + thisAccount.username + '"') + ")'; style='color: black; text-decoration: none;'>" + thisAccount.username + "</a>"
						}
						xhttp3.open("GET", "http://localhost:6069/account?keyword=" + thisEncounter.user);
						xhttp3.send();

            for (i = 0; i < thisEncounter.images.length; i++) {
                const xhttp4 = new XMLHttpRequest();

                xhttp4.onload = function () {
                    var thisImage = JSON.parse(this.responseText);
                    pinDisplay.innerHTML += '<img id=pinImage src="' + thisImage.data + '">';
										document.getElementById('pinDisplay').innerHTML += "<div class='commentHead'> <h2>Comments:</h2> <hr style='width:99%;text-align:left; margin-left:0;'>";
										for (o = 0; o < thisEncounter.comments.length; o++)
										{
											GetComment(thisEncounter.comments[o], document.getElementById('pinDisplay'), "<hr style='width:50%;text-align:left; margin-left:0;'>", "black");
										}
									 document.getElementById('pinDisplay').innerHTML += "<input id='commmentCreation' type='text' name='createComment' placeholder='Enter comment here:' style='background-color: white; border-color: grey'><button type='button' onclick='PostComment()'>Post Comment</button>";
                }

                xhttp4.open("GET", "http://localhost:6069/image?keyword=" + thisEncounter.images[i], true);
                xhttp4.send();
            }

						encounterID = thisEncounter._id;
        }
        xhttp2.open("GET", "http://localhost:6069/encounter?keyword=" + thisPin.encounter, true);
        xhttp2.send();
    }

    xhttp.open("GET", "http://localhost:6069/pins?type=title&keyword=" + e.target.getPopup().getContent(), true);
    xhttp.send();
}

function PinSearch() {
    var searchQuery = document.getElementById("searchbar").value
    searchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
    GetPins(searchQuery);
}

function ClearMap() {
    for (i = 0; i < pinList.length; i++) {
        map.removeLayer(pinList[i])
    }
}

//Functions for communicating with the backend
function GetPins(search = "") {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.responseText != "NULL") {
            ClearMap();

            var pinArr = JSON.parse(this.responseText);
            for (i = 0; i < pinArr.length; i++) {
                var pin = pinArr[i];

                pinList[pinList.length] = L.marker(pin.coordinates).bindPopup(pin.title).on('dblclick', onMarkerClick).addTo(map);
            }
        }
        else {
            ClearMap();
            console.log("theres nothing here....");
        }
    }

    xhttp.open("GET", "http://localhost:6069/pins?type=cryptid&keyword=" + search, true);
    xhttp.send();
}

GetPins();
