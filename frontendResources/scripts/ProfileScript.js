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

    var activityFeed = "<h2>PH-Activity Feed</h2>";
    var activitiesIDs = userAccount.encounterlog;
    for (i = 0; i < activitiesJSON.length; i++) {
        const xhttp = new XMLHttpRequest();
        activityFeed += "<div class='activityFeedItem'> <h3>" + activities[i].title + "</h3> <p>" + activities[i].description + "</p><p>" + activities[i].location + "<br>" + activities[i].datetime + "</p>";
    }

    activitylog.innerHTML = activityFeed;
}

GetUserAccount();