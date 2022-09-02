const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { email, password } = req.body;
    const found = await userSchema.findOne({ email });
    if (found) return res.status(409).json({ message: "User already exists!" });
    // const newUser = await userSchema.create({ email, password });

    // return res.status(201).json({ message: "User created!" });
    try {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt)
        await userSchema.create({
            email,
            password: hashedPass
        });
        return res.status(201).json({ message: "User created!" });
    } catch {
        return res.status(500);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Request body must have email and password properties" })
    }

    // Check if user in database
    let found;

    try {
        found = await userSchema.findOne({ email });
    } catch (err) {
        return res.status(400).json({ message: `Database is struggling to find user with email: ${email}` })
    }

    if (!found) {
        return res.status(400).json({ message: "User not found!" })
    }

    try {
        const matches = await bcrypt.compare(password, found.password);
        if (!matches) {
            return res.status(401).json({ message: "Bad email/password combo" });
        }
    } catch {
        return res.status(401).json({ message: "Bad email/password combo!" });
    }

    const user = { email };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.cookie("accessToken", accessToken, { httpOnly: true }); // , maxAge: 1000000
    return res.status(200).json({ message: "Successly logged in" });
}

const getAll = async (req, res) => {
    const users = await userSchema.find({});
    return res.status(200).json(users);
}

const getUser = async (req, res) => {
    const user = req.user;

    const found = await userSchema.findOne({ email: user.email });

    if (!found) return res.status(400).json({ message: "Can't find user!" })
    return res.status(200).json({ email: user.email });
}

const delUser = async (req, res) => {
    const user = req.user;

    const found = await userSchema.findOneAndDelete({ email: user.email });

    if (!found) return res.status(400).json({ message: "Can't delete user!" })
    
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Deleted user!" });
}

module.exports = {
    register,
    login,
    getAll,
    getUser,
    delUser,
}