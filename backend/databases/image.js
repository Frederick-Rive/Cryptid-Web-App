const mongoose = require('mongoose');

//A schema is similar to a class, and looks like a UML diagram. It is the way that data will be stored in the database
const imageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    data: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Image', imageSchema, "Images");