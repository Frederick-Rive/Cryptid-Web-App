//header files
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploads)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now)
    }
});
const upload = multer({ storage: storage });
const bcrypt = require('bcrypt');
const salt = 10;

//connect to the database
mongoose.connect('mongodb+srv://Freddie:cryptids@cryptids.bekuf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    err => {
        if (!err) {
            //print success message to console if successful
            console.log("Connection Succeeded")
        }
        else {
            //print failure message if unsuccessful
            console.log("Connection Error: " + err)
        }
    });

//get schemas from other files
const Pin = require('./models/pin.js');
const Account = require('./models/account.js');
const Encounter = require('./models/encounter.js');
const Comment = require('./models/comment.js');
const Image = require('./models/image.js');

//the users account is stored here. storing it like this allows us to keep this data saved even if the user reloads their page
var userAccount = new Account({
    _id: new mongoose.Types.ObjectId,
    username: "NULL",
    password: "NULL",
    description: "NULL",
    encounterlog: [],
    is_admin: false
});
var viewName = {
  name: ""
}

//Creates a pin, along with an encounter and image to go with it, then saves them all to the database
async function PostPin(objectData) {
    var image = new Image({
        _id: new mongoose.Types.ObjectId,
        data: objectData.images
    });

    image.save().then(result => {
        var newEncounter = new Encounter({
            _id: new mongoose.Types.ObjectId,
            user: userAccount._id,
            title: objectData.title,
            description: objectData.description,
            cryptid: objectData.cryptid,
            location: "New Zealand",
            datetime: objectData.time,
            images: [image._id],
            comments: [],
            rating: -1,
            is_reported: false
        });
        newEncounter.save().then(result => {
            Account.findOneAndUpdate({
                _id: userAccount._id
            }, {
                $push: {
                    encounterlog: newEncounter._id
                },
            })

            var newPin = new Pin({
                _id: new mongoose.Types.ObjectId,
                coordinates: objectData.coordinates,
                title: objectData.title,
                cryptid: objectData.cryptid,
                encounter: newEncounter._id
            });
            newPin.save();
        });
    });
}

//app.get: returns data from the database
//app.post: saves data to the database

//return a
app.get('/pins', (req, res) => {
    if (req.query.keyword) {
        if (req.query.type == "title") {
            Pin.findOne({ title: req.query.keyword }, (err, pinResult) => {
                if (pinResult) {
                    res.send(pinResult);
                } else {
                    res.send("NULL");
                }

            })
        } else if (req.query.type == "cryptid") {
            Pin.findOne({ cryptid: req.query.keyword }, (err, pinResult) => {
                if (pinResult) {
                    res.send(pinResult);
                } else {
                    res.send("NULL");
                }

            })
        }
    } else {
        Pin.find({}, (err, pinResult) => {
            if (pinResult) {
                res.send(pinResult);
            } else {
                res.send("Error: Pins Not Found");
            }

        })
    }
});

//Calls the PostPin function to save a pin to the database
app.post('/pins', (req, res) => {
    PostPin(req.body);
});

//Returns an account with a supplied username.
app.get('/login', (req, res) => {
    Account.findOne({ username: req.query.username }, (err, accountResult) => {
        if (accountResult) {
            if (bcrypt.compareSync(req.query.password, accountResult.password)) {
                res.send(accountResult);
            }
            else {
                res.send("N-PASSWORD");
            }
        }
        else {
            res.send("N-USERNAME");
        }
    })
});

//sets users account, saves account to the database
app.post('/register', (req, res) => {
    var hash = bcrypt.hashSync(req.body.password, salt);
    var newAccount = new Account({
        _id: new mongoose.Types.ObjectId,
        username: req.body.username,
        password: hash,
        description: req.body.description,
        is_admin: req.body.is_admin
    });
    newAccount.save();
    res.send("Account " + newAccount.username + " has been saved")
});

//gets an account based on its ID
app.get('/account', (req, res) => {
    if (req.query.keyword && req.query.keyword != "{}") {
      if (req.query.type == "username") {
        Account.findOne({ username: req.query.keyword }, (err, accountResult) => {
          if (accountResult){
            res.send(accountResult);
          }
        })
      }
      else {
        Account.findOne({ _id: req.query.keyword }, (err, accountResult) => {
          if (accountResult){
            res.send(accountResult);
          }
        })
      }
    } else {
        res.send(userAccount);
    }
});

app.patch('/account', (req, res) => {
    if (req.body.profilepic) {
        var newImage = new Image({
            _id: new mongoose.Types.ObjectId,
            data: req.body.profilepic
        });
        newImage.save().then(result => {
            var updates = {
              bio: req.body.bio,
              profilepic: result._id
            }
            Account.updateOne({ _id: userAccount._id }, updates)
            .then(result => {
              res.send(result);
            }).catch(err => res.send(err));
        })
    }
    else {
        var accountUpdate = {
            bio: req.body.bio
        }
        Account.updateOne({ _id: userAccount._id }, accountUpdate)
    }
});

//sets the users account.
app.post('/account', (req, res) => {
    userAccount = req.body;
});

//gets an ecnounter based on its ID
app.get('/encounter', (req, res) => {
    if (req.query.keyword) {
        if (req.query.type == "user") {
            Encounter.find({ user: req.query.keyword }, (err, encounterResult) => {
                res.send(encounterResult);
            })
        }
        else {
            Encounter.findOne({ _id: req.query.keyword }, (err, encounterResult) => {
                res.send(encounterResult);
            })
        }
    }
});

//saves a new encounter
app.post('/encounter', (req, res) => {
    var newEncounter = new Encounter({
        _id: new mongoose.Types.ObjectId,
        user: userAccount._id,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        datetime: req.body.datetime,
        images: req.body.images,
        comments: req.body.comments,
        rating: -1,
        is_reported: false
    })
    newEncounter.save().then(result => {
        res.send(newEncounter._id)
    });
});

//gets a comment based on its ID
app.get('/comment', (req, res) => {
    if (req.query.keyword) {
        Comment.findOne({ _id: req.query.keyword }, (err, commentResult) => {
            res.send(commentResult);
        })
    }
});

app.post('/comment', (req, res) => {
  if (userAccount.username != "NULL")
  {
    var newComment = new Comment ({
      _id: new mongoose.Types.ObjectId,
      user: userAccount._id,
      text: req.body.text,
      is_reported: false
    });
    newComment.save().then(result => {
      const commentUpdate = {
        $push: {
          comments: result._id
        }
      }
      Encounter.updateOne({_id: req.body.encounter}, commentUpdate).then(result => {
        res.send(result);
      }).catch(err => res.send(err));
    });
  }
})

app.get('/viewAccount', (req, res) => {
    res.send(viewName);
})

app.post('/viewAccount', (req, res) => {
    viewName = {
      name: req.body.name
    };
    res.send("success");
})

//gets an image based on its ID
app.get('/image', (req, res) => {
    if (req.query.keyword) {
        Image.findOne({ _id: req.query.keyword }, (err, imageResult) => {
            if (err) {
                console.log(err);
            } else {
                res.send(imageResult);
            }
        })
    } else {
        Image.findOne({}, (err, imageResult) => {
            if (err) {
                console.log(err);
            } else {
                res.send(imageResult);
            }
        })
    }
});

//saves a new image
app.post('/image', (req, res) => {
    newImage = new Image({
        _id: new mongoose.Types.ObjectId,
        data: req.body.data
    });
    newImage.save().then(result => {
        res.send(newImage._id)
    });
});

//fetches any commands sent on port 6069
app.listen(6069);
