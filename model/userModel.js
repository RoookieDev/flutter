const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    refreshToken:String,
});

const User = mongoose.model("UserData",UserSchema);
module.exports = User;