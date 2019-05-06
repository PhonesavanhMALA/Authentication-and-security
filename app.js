require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new Schema ({
    email: String,
    password: String
});



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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.email,
            password: hash
        });    
        newUser.save(function(err){
            if (!err){
                console.log("Successfuly to save a new User");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
      });    
});

app.post("/login", function(req, res){
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    User.findOne({email:userEmail}, function(err, foundUser){
        if (!err){
            if(foundUser){
                bcrypt.compare(userPassword, foundUser.password, function(err, result) {
                    if(result === true){
                        console.log("Login successfuly");
                        res.render("secrets");
                    } else{
                        console.log("There was wrong username or password of " + err);
                    }
                });
            } 
        } else {
            console.log(err);
        }
    });
});




app.listen(port, function () {
    console.log("Server is running on port " + port);
});