userAccount = {}

const name = document.getElementById("username");
const activitylog = document.getElementById("activityFeed");
const profilePic = document.getElementById("profilePic");
const bio = document.getElementById("profileBio");

function GetUserAccount() {
    const xhttp2 = new XMLHttpRequest();

    xhttp2.onload = function() {
        const xhttp = new XMLHttpRequest();
        var view = JSON.parse(this.responseText);
        xhttp.onload = function () {
          userAccount = JSON.parse(this.responseText);
          if (userAccount.username == "NULL")
          {
            toAccount();
          }
          UpdateProfilePage();
        }

        xhttp.open("GET", "http://localhost:6069/account?keyword=" + view.name + "&type=username", true);
        xhttp.send();
    }

    xhttp2.open("GET", "http://localhost:6069/viewAccount");
    xhttp2.send();
}

function UpdateProfilePage() {
  name.innerHTML = userAccount.username;

  if (userAccount.profilepic) {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
      var thisImage = JSON.parse(this.responseText);
      profilePic.src = thisImage.data;
    }

    xhttp.open("GET", "http://localhost:6069/image?keyword=" + userAccount.profilepic, true);
    xhttp.send();
  }

  if (userAccount.bio) {
    bio.textContent = userAccount.bio;
  }

  activitylog.innerHTML = "<h2>Activity Feed</h2>";

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    activities = JSON.parse(this.responseText);
    for (i = 0; i < activities.length; i++) {
      activitylog.innerHTML += "<div class='activityFeedItem'> <h3>" + activities[i].title + "</h3> <p>" + activities[i].description + "</p><p>" + activities[i].location + "<br>" + activities[i].datetime + "</p>";
      activitylog.innerHTML += "<div class='commentHead'> <h2>Comments:</h2> <hr style='width:75%; margin:0;border-color:green;'>";
      for (o = 0; o < activities[i].comments.length; o++) {
        GetComment(activities[i].comments[o], activitylog);
      }
    }
  }

  xhttp.open("GET", "http://localhost:6069/encounter?type=user&keyword=" + userAccount._id, true);
  xhttp.send();
}

GetUserAccount();
