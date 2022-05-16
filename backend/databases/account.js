const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    description: String,
    is_admin: Boolean
}, {
    versionKey: false
});

//Functions need to be added to schemas before they are compiled into models
accountSchema.methods.checkPassword = function checkPassword(input) {
    return input == this.password;
}

module.exports = mongoose.model('Account', accountSchema, "Accounts");