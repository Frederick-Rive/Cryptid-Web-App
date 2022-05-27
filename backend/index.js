const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
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
const Pin = require('./databases/pin.js');
const Account = require('./databases/account.js');
const Encounter = require('./databases/encounter.js');
const Comment = require('./databases/comment.js');
const Image = require('./databases/image.js');

var userAccount = new Account({
    _id: new mongoose.Types.ObjectId,
    username: "NULL",
    password: "NULL",
    description: "NULL",
    encounterlog: [],
    is_admin: false
});

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

//communicate with the frontend
app.get('/pins', (req, res) => {
    if (req.query.keyword) {
        Pin.findOne({ title: req.query.keyword }, (err, pinResult) => {
            if (pinResult) {
                res.send(pinResult);
            } else {
                res.send("Error: Pin Not Found");
            }

        })
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

app.post('/pins', (req, res) => {
    console.log(req.body);
    PostPin(req.body);
})

app.get('/login', (req, res) => {
    if (req.query.keyword) {
        Account.findOne({ username: req.query.keyword }, (err, accountResult) => {
            res.send(accountResult);
        })
    }
    else {
        Account.find({}, (err, accountResult) => {
            res.send(accountResult);
        })
    }
});

app.post('/register', (req, res) => {
    var newAccount = new Account({
        _id: new mongoose.Types.ObjectId,
        username: req.body.username,
        password: req.body.password,
        description: req.body.description,
        is_admin: req.body.is_admin
    });
    newAccount.save();
    console.log("Account " + newAccount.username + " has been saved");
    res.send("Account " + newAccount.username + " has been saved")
});

app.get('/account', (req, res) => {
    if (req.query.keyword) {
        Account.findOne({ _id: req.query.keyword }, (err, accountResult) => {
            res.send(accountResult);
        })
    } else {
        res.send(userAccount);
    }
});

app.post('/account', (req, res) => {
    userAccount = new Account({
        _id: req.body._id,
        username: req.body.username,
        password: req.body.password,
        description: req.body.description,
        encounterlog: [mongoose.Types.ObjectId("6283134f14341abdb5db63c2")],
        is_admin: req.body.is_admin
    });
});

app.get('/encounter', (req, res) => {
    if (req.query.keyword) {
        Encounter.findOne({ _id: req.query.keyword }, (err, encounterResult) => {
            res.send(encounterResult);
        })
    }
});

app.post('/encounter', (req, res) => {
    var newEncounter = new Encounter({
        _id: mongoose.Types.ObjectId,
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

app.get('/comment', (req, res) => {
    if (req.query.keyword) {
        Comment.findOne({ _id: req.query.keyword }, (err, commentResult) => {
            res.send(commentResult);
        })
    }
});

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

app.post('/image', (req, res) => {
    newImage = new Image({
        _id: new mongoose.Types.ObjectId,
        data: req.body.data
    });
    newImage.save().then(result => {
        res.send(newImage._id)
    });
});

app.listen(6069);
