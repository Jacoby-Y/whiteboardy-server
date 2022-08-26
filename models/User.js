const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProp = (type, required = true) => ({ type, required });

const userSchema = new Schema({
    email: newProp(String),
    password: newProp(String),
}, {});

module.exports = mongoose.model("User", userSchema);