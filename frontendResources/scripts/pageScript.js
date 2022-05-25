//getting buttons
var loginButton = document.getElementsByName('loginButton');
var registerButton = document.getElementsByName('registerButton');
var searchConfirm = document.getElementsByName('searchConfirm');
var profile = document.getElementsByName('PH-ProfileLink');
var newPin = document.getElementsByName('newPin');

//getting inputs
var usernameInput = document.getElementById('uName');
var passwordInput = document.getElementById('pWord');
var searchInput = document.getElementsByName('searchbar');

// New pin creation (map)
function OpenPinCreator() {
  document.getElementById('pinCreation').style.display = "flex";
}

function ClosePinCreator() {
  document.getElementById('pinCreation').style.display = "none";
}

//event functions
function toProfile() {
  window.location = "./profile.html"
}

function logIn() {
    var username = usernameInput.value;
    var password = passwordInput.value;

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        console.log(this.responseText);
        if (!this.responseText) {
            console.log("Unable to find an account with that username");
            return;
        }
        thisAccount = JSON.parse(this.responseText);
        if (thisAccount.password == password) {
            console.log("Success! you have (hypothetically) logged in!");

            const xhttp2 = new XMLHttpRequest();
            xhttp2.open("POST", "http://localhost:6069/account", true);
            xhttp2.setRequestHeader('Content-type', 'application/json');
            xhttp2.send(JSON.stringify(thisAccount));

            toProfile();
            return;
        }
        console.log("Your password was incorrect, sorry!");
    }

    xhttp.open("GET", "http://localhost:6069/login?keyword=" + username, true);
    xhttp.send();
}

function register() {
    var uN = usernameInput.value;
    var pW = passwordInput.value;

    const xhttp2 = new XMLHttpRequest();

    xhttp2.onload = function () {
        if (this.responseText) {
            console.log("That username has already been taken");
            return;
        }
        const xhttp = new XMLHttpRequest();

        var account = {
            username: uN,
            password: pW,
            description: "new one",
            is_admin: false
        };

        xhttp.onload = function () {
            console.log(this.responseText);
        }

        xhttp.open("POST", "http://localhost:6069/register", true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(account));
    }

    xhttp2.open("GET", "http://localhost:6069/login?keyword=" + username, true);
    xhttp2.send();
}
