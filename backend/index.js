const mongoose = require("mongoose");
const express = require("express");
const app = express();
//const bodyParsesr = require('body-parser');
//app.use(bodyParsesr.json);
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
const account = require("./databases/account.js");

//communicate with the frontend
app.get('/pins', (req, res) => {
    Pin.find({}, (err, pinResult) => {
        if (pinResult) {
            console.log(pinResult);
            res.send(pinResult);
        } else {
            res.send("Error: Pins Not Found");
        }
        
    })
});

app.get('/accounts', (req, res) => {
    if (req.query.keyword) {
        Account.find({ username: req.query.keyword }, (err, accountResult) => {
            console.log(accountResult);
            if (accountResult) {
                console.log(accountResult);
                res.send(accountResult);
            }
            else {
                res.send("NULL");
            }
        })
    }
    else {
        Account.find({}, (err, accountResult) => {
            if (accountResult) {
                console.log(accountResult);
                res.send(accountResult);
            }
            else {
                res.send("NULL");
            }
        })
    }
});

app.post('/accounts', (req, res) => {
    var newAccount = new Account;
    newAccount.username = req.body.username;
    newAccount.password = req.body.password;
    newAccount.description = "new account";
    newAccount.is_admin = false;
    newAccount.save();
    console.log("Account " + newAccount.username + " has been saved");
});

app.listen(6069);
