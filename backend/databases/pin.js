const mongoose = require('mongoose');

//A schema is similar to a class, and looks like a UML diagram. It is the way that data will be stored in the database
const pinSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    coordinates: [Number],
    title: String,
    cryptid: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Pin', pinSchema, "Pins");