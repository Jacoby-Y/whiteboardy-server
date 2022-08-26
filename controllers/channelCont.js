const channelSchema = require("../models/Channel");

const get = async (req, res)=>{
    const user = req.user;

    const channels = await channelSchema.find({ username: user.username });
    return res.status(200).json(channels);
}

const post = async (req, res)=>{
    const { channel_id } = req.body;
    const user = req.user;

    if (!channel_id) {
        return res.status(404).json({ message: "Missing body property: `channel_id`" })
    }

    const result = await channelSchema.create({
        username: user.username,
        channel_id
    });

    // console.log(result);
    if (!result) {
        return res.status(400).json({ message: "Can't add channel!" });
    }
    return res.status(200).json(result);
}

const del = async (req, res)=>{
    const user = req.user;
    const { channel_id } = req.body;

    if (!channel_id) {
        return res.status(404).json({ message: "Missing body property: `channel_id`" })
    }

    const deleted = await channelSchema.findOneAndDelete({ channel_id });

    if (!deleted) {
        return res.status(404).json({ message: "Couldn't find channel with that ID" });
    }

    return res.status(200).json(deleted);
}

module.exports = {
    get,
    post,
    del
}