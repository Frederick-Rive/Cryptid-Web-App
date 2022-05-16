//getting buttons
var loginButton = document.getElementsByName('loginButton');
var registerButton = document.getElementsByName('registerButton');
var searchConfirm = document.getElementsByName('searchConfirm');
var profile = document.getElementsByName('PH-ProfileLink')

//getting inputs
var usernameInput = document.getElementsByName('uName');
var passwordInput = document.getElementsByName('pWord');
var searchInput = document.getElementsByName('searchbar');

//event functions
function toProfile() {
  window.location = "html/profile.html"
}

function logIn() {
    var username = usernameInput.value;
    var password = passwordInput.value;

    var acccountArr = GetAccountsFromDatabase(username);
    if (acccountArr.length == 0) {
        console.log("Unable to find an account with that username");
        return;
    }
    for (i = 0; i < accountArr.length; i++) {
        thisAccount = accountArr[i];
        if (thisAccount.password = password) {
            console.log("Success! you have (hypothetically) logged in!");
            return;
        }
    }
    console.log("Your password was incorrect, sorry!");
}

function register() {

}

GetPinsFromDatabase();