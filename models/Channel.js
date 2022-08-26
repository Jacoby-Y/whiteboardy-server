const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProp = (type, required=true)=> ({ type, required });

const channelSchema = new Schema({
    username: newProp(String),
    channel_id: newProp(String),
}, {});

module.exports = mongoose.model("Channel", channelSchema);