//#region | Setup
require("dotenv").config();

const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const http = require('http');
const path = require("path");
const express = require('express');
const app = express();

const cors = require("cors");

const server = http.createServer(app);

const port = process.env.PORT ?? 8866;

console.log(`Listening on port: ${port}`);

server.listen(port);
//#endregion

//#region | Middleware
const userRoutes = require("./routes/user");

app.use(cors({ origin: ["http://localhost:3000", "https://whiteboardy-client.vercel.app"], credentials: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("", userRoutes);
//#endregion

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//#region | Connect to MongoDB
// console.log("Connecting...");
mongoose.connect(process.env.MONGO_URI)
    .then((ok) => {
        console.log("Connected!");
    })
    .catch((err) => {
        console.log(err);
    });
//#endregion

//#region | Socket Stuff
const whiteboards = [];

app.get('/whiteboard/:id', function (req, res) {
    const { id } = req.params;
    res.status(200).json({ has_id: whiteboards.includes(id) });
});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", socket => {
    console.log("connected");
    socket.on("emit-points", ({ id, data, color, width }) => {
        // console.log(data, color, width);
        // console.log(id, data);
        // console.log("get-points:" + id);
        socket.broadcast.emit("get-points:" + id, { data, color, width });
    });
    socket.on("drawing-request", ({ id }) => {
        socket.broadcast.emit(`get-drawing:${id}:host`);
    });
    socket.on("drawing-relay", ({ id, data, users }) => {
        socket.broadcast.emit(`get-drawing:${id}`, { data, users });
    });
    socket.on("open", ({ id }) => {
        console.log("New board!");
        whiteboards.push(id);
    })
    socket.on("close-whiteboard", ({ id }) => {
        console.log("Removing board...");

        socket.broadcast.emit("closed:" + id, null);

        if (!whiteboards.includes(id)) return;
        whiteboards.splice(
            whiteboards.indexOf(id), 1
        );
    });
});
//#endregion
