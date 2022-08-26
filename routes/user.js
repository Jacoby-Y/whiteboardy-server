// const channelCont = require("../controllers/channelCont");
const userCont = require("../controllers/userCont");

const express = require("express");
const auth = require("./auth")
const router = express.Router();

// router.get("/users", userCont.getAll);
router.post("/login", userCont.login);
router.post("/register", userCont.register);
router.get("/user", auth.authenticateToken, userCont.getUser);
router.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Logged out" });
});

// router.get("/channel", auth.authenticateToken, channelCont.get);
// router.post("/channel", auth.authenticateToken, channelCont.post);
// router.delete("/channel", auth.authenticateToken, channelCont.del);

module.exports = router;