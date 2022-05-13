const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    type: String,
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

module.export = mongoose.model('Account', accountSchema);