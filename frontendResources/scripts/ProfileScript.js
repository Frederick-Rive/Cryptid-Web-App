userAccount = {}

const name = document.getElementById("username");
const activitylog = document.getElementById("activityFeed");
const profilePic = document.getElementById("profilePic");
const bio = document.getElementById("profileBio");

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

    if (userAccount.profilepic) {
        profilePic.src = "";
        profilePic.url = userAccount.profilepic;
    }

    if (userAccount.bio) {
        bio.textContent = userAccount.bio;
    }

    activitylog.innerHTML = "<h2>PH-Activity Feed</h2>";

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        activities = JSON.parse(this.responseText);
        for (i = 0; i < activities.length; i++) {
            activitylog.innerHTML += "<div class='activityFeedItem'> <h3>" + activities[i].title + "</h3> <p>" + activities[i].description + "</p><p>" + activities[i].location + "<br>" + activities[i].datetime + "</p>";
            activitylog.innerHTML += "<div class='comments'><h2> comments:</h2><hr style='width:75%; margin:0;border-color:green;'>";
            for (o = 0; o < activities[i].comments.length; o++) {
                GetComment(activities[i].comments[o], activitylog);
            }
        }
    }

    xhttp.open("GET", "http://localhost:6069/encounter?type=user&keyword=" + userAccount._id, true);
    xhttp.send();
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