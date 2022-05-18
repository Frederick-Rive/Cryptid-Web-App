const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

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
const Encounter = require('./databases.encounter.js');
const Comment = require('./databases.comment.js');

var userAccount = new Account({
    _id: new mongoose.Types.ObjectId,
    username: "Temp",
    password: "Temp",
    description: "Temp",
    encounterlog: [mongoose.Types.ObjectId("6283134f14341abdb5db63c2")],
    is_admin: false
});

//communicate with the frontend
app.get('/pins', (req, res) => {
    Pin.find({}, (err, pinResult) => {
        if (pinResult) {
            res.send(pinResult);
        } else {
            res.send("Error: Pins Not Found");
        }

    })
});

app.get('/login', (req, res) => {
    if (req.query.keyword) {
        Account.find({ username: req.query.keyword }, (err, accountResult) => {
            console.log(req.query.keyword);
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
    res.send(userAccount);
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

app.listen(6069);
