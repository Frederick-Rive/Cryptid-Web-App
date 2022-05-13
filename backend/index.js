const mongoose = require("mongoose");
const express = require("express");
const app = express();
//const bodyParsesr = require('body-parser');
//app.use(bodyParsesr.json);
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

mongoose.connect('mongodb+srv://Freddie:cryptids@cryptids.bekuf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    err => {
        if (!err) {
            console.log("Connection Succeeded")
        }
        else {
            console.log("Connection Error: " + err)
        }
    });

const Pin = require('./databases/pin.js');
const Account = require('./databases/account.js');

app.get('/pins', (req, res) => {
    Pin.findOne({cryptid: "mongoose"}, (err, pinResult) => {
        if (pinResult) {
            console.log(pinResult);
            res.send(pinResult);
        } else {
            res.send("Pin Not Found")
        }
        
    })
});

app.listen(6069);
