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

app.get('/accounts', (req, res) => {
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

app.listen(6069);
