require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const Schema = mongoose.Schema;

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new Schema ({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret});

const User = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

////////////////////////////// Get method start from here
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/register", function (req, res) {
    res.render("register")
});

app.get("/login", function (req, res) {
    res.render("login");
});




////////////////////////////// Post method start from here

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(function(err){
        if (!err){
            console.log("Successfuly to save a new User");
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

app.post("/login", function(req, res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email:userEmail}, function(err, foundUser){
        if (!err){
            if(foundUser){
                console.log(foundUser);
                if(foundUser.password === userPassword){
                    console.log(foundUser);
                    console.log("success to login ");
                    res.render("secrets");
                } else {
                    console.log(err);
                }
            } 
        } else {
            console.log(err);
        }
    });
});




app.listen(port, function () {
    console.log("Server is running on port " + port);
});