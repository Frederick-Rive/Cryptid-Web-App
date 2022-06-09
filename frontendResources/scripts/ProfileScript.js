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

    console.log(userAccount);

    activitylog.innerHTML = "<h2>PH-Activity Feed</h2>";
    for (i = 0; i < userAccount.encounterlog.length; i++) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            thisActivity = JSON.parse(this.responseText);
            activitylog.innerHTML += "<div class='activityFeedItem'> <h3>" + thisActivity.title + "</h3> <p>" + thisActivity.description + "</p><p>" + thisActivity.location + "<br>" + thisActivity.datetime + "</p>";
            activitylog.innerHTML += "<div class='comments'><h2> comments:</h2><hr style='width:75%; margin:0;border-color:green;'>";
            for (o = 0; o < thisActivity.comments.length; o++) {
                GetComment(thisActivity.comments[o], activitylog);
            }
        }
        activitylog.innerHTML += "</div>";
        xhttp.open("GET", "http://localhost:6069/encounter?keyword=" + userAccount.encounterlog[i], true);
        xhttp.send();
    }
}

function GetComment(commentID) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        thisComment = JSON.parse(this.responseText);
        const xhttp2 = new XMLHttpRequest();
        xhttp2.onload = function () {
            thisAccount = JSON.parse(this.responseText);
            activitylog.innerHTML += "<div class='comment'><h1>" + thisAccount.username + "</h1><p>" + thisComment.text + "</p></div>"
        }
        xhttp2.open("GET", "http://localhost:6069/account?keyword=" + thisComment.user, true);
        xhttp2.send();
    }
    xhttp.open("GET", "http://localhost:6069/comment?keyword=" + commentID, true);
    xhttp.send();
}

GetUserAccount();