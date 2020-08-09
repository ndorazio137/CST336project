// requirements
const express = require("express");
const request = require("request");
const pool = require("./dbPool.js");
const session = require('express-session');
const bcrypt = require('bcrypt');

// 
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//session creation
app.use(session({
   secret: "top secret!",
   resave: true,
   saveUninitialized: true
}));

//to be able to parse POST
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", function(req, res) {
   res.render("login");
});

app.post("/", function(req, res) {
   let username = req.body.username;
   let password = req.body.password;
   console.log("USERNAME: " + username);
   console.log("PASSWORD: " + password);
   //*******This is commented out for easy access to other pages while building*****//
   //****Do not delete. It will be used ******//
   // if (username == "admin" && password == "secret") {
   res.render("admin");
   // }
   // else {
   //    res.render("login", { "loginError": true });
   // }
});

app.get("/potions", function(req, res) {
   res.render("potions");
});

app.get("/weapons", function(req, res) {
   res.render("weapons");
});

app.get("/armor", function(req, res) {
   res.render("armor");
});

app.get("/wands", function(req, res) {
   res.render("wands");
});

app.get("/crystals", function(req, res) {
   res.render("crystals");
});

app.get("/signup", function(req, res) {
   res.render("signup");
});

app.get("/shoppingcart", function(req, res) {
   res.render("shoppingcart");
});

app.get("/checkout", function(req, res) {
   res.render("checkout");
});

app.get("/thankyou", function(req, res) {
   res.render("thankyou");
});

// unfinished search
app.get("/search", function(req, res) {

   let keyword = "";
   if (req.query.keyword) {
      keyword = req.query.keyword;
   }

   // implement what to do with serach keyword here.

   res.send("You have used search! Now implement it!");
});

// sql database path route. SQL statement goes here.

//store signup info

//store recepit

//search for login existing user

//listener
app.listen(8080, "0.0.0.0", function() {
   console.log("Running Express Server...");
});
