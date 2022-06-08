const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    description: String,
    profilepic: mongoose.Schema.Types.ObjectId,
    encounterlog: [mongoose.Schema.Types.ObjectId],
    is_admin: Boolean
}, {
    versionKey: false
});

//Functions need to be added to schemas before they are compiled into models
accountSchema.methods.checkPassword = function checkPassword(input) {
    return input == this.password;
}

module.exports = mongoose.model('Account', accountSchema, "Accounts");