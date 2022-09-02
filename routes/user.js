const userCont = require("../controllers/userCont");

const express = require("express");
const auth = require("./auth")
const router = express.Router();

// router.get("/users", userCont.getAll);
router.post("/login", userCont.login);
router.post("/register", userCont.register);
router.get("/user", auth.authenticateToken, userCont.getUser);
router.get("/del", auth.authenticateToken, userCont.delUser);
router.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Logged out" });
});

module.exports = router;