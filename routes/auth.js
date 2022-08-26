const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // Get authorization property of the request header
    const authHeader = req.headers.authorization;

    // console.log(req.cookies);

    const token = req.cookies.accessToken ?? (authHeader && authHeader.split(" ")[1]);
    if (!token) return res.sendStatus(401);

    // Try to verify token against our secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
}