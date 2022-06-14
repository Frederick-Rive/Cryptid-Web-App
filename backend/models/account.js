const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    bio: String,
    profilepic: mongoose.Schema.Types.ObjectId,
    is_admin: Boolean
}, {
    versionKey: false
});

module.exports = mongoose.model('Account', accountSchema, "Accounts");