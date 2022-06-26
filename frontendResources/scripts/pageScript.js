//getting inputs
var usernameInput = document.getElementById('uName');
var passwordInput = document.getElementById('pWord');
var searchInput = document.getElementsByName('searchbar');
var notifyText = document.getElementById('notifyText');
var userAccount;

//event functions
function NotifyUser(text = ""){
  notifyText.textContent = text;
}

function GetUserAccount()
{
  return userAccount();
}

function FindUserAccount()
{
  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    userAccount = JSON.parse(this.responseText);
  }

  xhttp.open("GET", "http://localhost:6069/account", true);
  xhttp.send();
}

function toProfile(account = "") {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        window.location = "./profile.html";
    }

    var viewJSON = {
      name: account
    }

    console.log (viewJSON);
    xhttp.open("POST", "http://localhost:6069/viewAccount", true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(viewJSON));
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
        notifyText.textContent = "Success!";

        const xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", "http://localhost:6069/account", true);
        xhttp2.setRequestHeader('Content-type', 'application/json');
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

    if (uN == "") {
      notifyText.textContent = "Please give your account a username.";
      return;
    } else if (pW == "") {
      notifyText.textContent = "Please give your account a password.";
      return;
    }

    const xhttp2 = new XMLHttpRequest();

    xhttp2.onload = function () {
        if (this.responseText != "N-USERNAME") {
            notifyText.textContent = "That username has already been taken by another user. Please use another username.";
            return;
        }
        const xhttp = new XMLHttpRequest();

        var account = {
            username: uN,
            password: pW,
            bio: "",
            is_admin: false
        };

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
                toProfile();
            }

            xhttp.open("PATCH", "http://localhost:6069/account");
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify(updates));
        }
        reader.readAsDataURL(imageInput.files[0]);
    }
    else {
        const xhttp = new XMLHttpRequest();

        xhttp.onload = function () {
          toProfile();
        }

        var updates = {
            bio: bioInput.value
        };

        xhttp.open("PATCH", "http://localhost:6069/account");
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(updates));
    }
}

function GetComment(commentID, wrapper, bar = "<hr style='width:50%; margin:0;border-color: green;'>", colour = "green") {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    var thisComment = JSON.parse(this.responseText);
    const xhttp2 = new XMLHttpRequest();
    xhttp2.onload = function () {
      var thisAccount = JSON.parse(this.responseText);
      wrapper.innerHTML += "<a href='#'' onclick='toProfile(" + ('"' + thisAccount.username + '"') + ")'; style='color: " + colour + "; text-decoration: none;'><div class='comments'><h3>" + thisAccount.username + "</h3><p>" + thisComment.text + "</p></div></a>" + bar;
    }
    xhttp2.open("GET", "http://localhost:6069/account?keyword=" + thisComment.user, true);
    xhttp2.send();
  }
  xhttp.open("GET", "http://localhost:6069/comment?keyword=" + commentID, true);
  xhttp.send();
}
