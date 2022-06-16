//getting inputs
var usernameInput = document.getElementById('uName');
var passwordInput = document.getElementById('pWord');
var searchInput = document.getElementsByName('searchbar');

//event functions
function toProfile() {
    window.location = "./profile.html";
}

function toSettings() {
    window.location = "./settings.html";
}

function toMap() {
    window.location = "./map.html";
}

function toAccount() {
    window.location = "./Login.html";
}

function logIn() {
    var usernameInput = document.getElementById('loginUsername');
    var passwordInput = document.getElementById('loginPassword');
    var username = usernameInput.value;
    var password = passwordInput.value;

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.responseText[0] == 'N') {
            console.log(this.responseText);
            return;
        }
        thisAccount = JSON.parse(this.responseText);
        console.log("Success! you have (hypothetically) logged in!");

        const xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", "http://localhost:6069/account", true);
        xhttp2.setRequestHeader('Content-type', 'application/json');
        console.log(thisAccount);
        xhttp2.send(JSON.stringify(thisAccount));

        toSettings();
        return;
    }

    xhttp.open("GET", "http://localhost:6069/login?username=" + username + "&password=" + password, true);
    xhttp.send();
}

function register() {
    var usernameInput = document.getElementById('registerUsername');
    var passwordInput = document.getElementById('registerPassword');
    var uN = usernameInput.value;
    var pW = passwordInput.value;

    const xhttp2 = new XMLHttpRequest();

    xhttp2.onload = function () {
        if (this.responseText != "N-USERNAME") {
            console.log("That username has already been taken");
            return;
        }
        const xhttp = new XMLHttpRequest();

        var account = {
            username: uN,
            password: pW,
            bio: "",
            is_admin: false
        };

        xhttp.onload = function () {
            console.log(this.responseText);
        }

        xhttp.open("POST", "http://localhost:6069/register", true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(account));
    }

    xhttp2.open("GET", "http://localhost:6069/login?username=" + uN + "&password=" + pW, true);
    xhttp2.send();
}

function UpdateProfile() {
    const imageInput = document.getElementById('profilePicUpload');
    const bioInput = document.getElementById('bio');

    if (imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function () {
            const xhttp = new XMLHttpRequest();

            var updates = {
                bio: bioInput.value,
                profilepic: reader.result
            };

            xhttp.onload = function () {
                console.log("by the end of the week i want real popups please");
            }

            console.log(JSON.stringify(updates));

            xhttp.open("PATCH", "http://localhost:6069/account");
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify(updates));
        }
        reader.readAsDataURL(imageInput.files[0]);
    }
    else {
        const xhttp = new XMLHttpRequest();

        xhttp.onload = function () {
            console.log("by the end of the week i want real popups please");
        }

        var updates = {
            bio: bioInput.value
        };

        xhttp.open("PATCH", "http://localhost:6069/account");
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(updates));
    }
}
