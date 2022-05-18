const mongoose = require('mongoose');

//A schema is similar to a class, and looks like a UML diagram. It is the way that data will be stored in the database
const encounterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    title: String,
    text: String,
    is_reported: bool
}, {
    versionKey: false
});

module.exports = mongoose.model('Comment', encounterSchema, "Comments");