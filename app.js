//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = "salf4v2f424f4fgdyp93vds82g4580dfbd032s8dfkla92ks9r";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

////////////////////////GET

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

////////////////////////POST

app.post("/register", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: userName,
        password: password,
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.send("wrong password");
                }
            } else {
                res.send("wrong password");
            }
        }
    });
});

app.listen(3000, function () {
    console.log("the server is now running on 3000");
});
