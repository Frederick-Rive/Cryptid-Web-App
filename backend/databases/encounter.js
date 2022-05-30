const mongoose = require('mongoose');

//A schema is similar to a class, and looks like a UML diagram. It is the way that data will be stored in the database
const encounterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    cryptid: String,
    location: String,
    datetime: String,
    images: [mongoose.Schema.Types.ObjectId],
    comments: [mongoose.Schema.Types.ObjectId],
    rating: Number,
    is_reported: Boolean
}, {
    versionKey: false
});

module.exports = mongoose.model('Encounter', encounterSchema, "Encounters");