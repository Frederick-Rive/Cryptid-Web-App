//getting buttons
var loginButton = document.getElementsByName('loginButton');
var registerButton = document.getElementsByName('registerButton');
var searchConfirm = document.getElementsByName('searchConfirm');
var profile = document.getElementsByName('PH-ProfileLink')

//getting inputs
var usernameInput = document.getElementById('uName');
var passwordInput = document.getElementById('pWord');
var searchInput = document.getElementsByName('searchbar');

//event functions
function toProfile() {
  window.location = "html/profile.html"
}

function logIn() {
    var username = usernameInput.value;
    var password = passwordInput.value;

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        console.log(this.responseText);
        accountArr = JSON.parse(this.responseText);
        console.log(accountArr);
        if (accountArr.length == 0) {
            console.log("Unable to find an account with that username");
            return;
        }
        for (i = 0; i < accountArr.length; i++) {
            thisAccount = accountArr[i];
            if (thisAccount.password == password) {
                console.log("Success! you have (hypothetically) logged in!");
                return;
            }
        }
        console.log("Your password was incorrect, sorry!");
    }

    console.log("http://localhost:6069/accounts?keyword=" + username);

    xhttp.open("GET", "http://localhost:6069/accounts?keyword=" + username, true);
    xhttp.send();
}

function register() {
    const xhttp = new XMLHttpRequest();

    var uN = usernameInput.value;
    var pW = passwordInput.value;

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
