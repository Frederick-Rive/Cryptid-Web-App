userAccount = {}

const name = document.getElementById("username");
const activitylog = document.getElementById("activityFeed");

function GetUserAccount() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        userAccount = JSON.parse(this.responseText);
        console.log(userAccount);
        UpdateProfilePage();
    }

    xhttp.open("GET", "http://localhost:6069/account", true);
    xhttp.send();
}

function UpdateProfilePage() {
    name.innerHTML = userAccount.username;

    activitylog.innerHTML = "<h2>PH-Activity Feed</h2>";
    for (i = 0; i < userAccount.encounterlog.length; i++) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            thisActivity = JSON.parse(this.responseText);
            console.log(thisActivity);
            activitylog.innerHTML += "<div class='activityFeedItem'> <h3>" + thisActivity.title + "</h3> <p>" + thisActivity.description + "</p><p>" + thisActivity.location + "<br>" + thisActivity.datetime + "</p>";
        }
        xhttp.open("GET", "http://localhost:6069/encounter?keyword=" + userAccount.encounterlog[i], true);
        xhttp.send();
    }
}

GetUserAccount();