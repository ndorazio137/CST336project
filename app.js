const express = require("express");
const app = express();
const pool = require("./dbPool.js");
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", function(req, res) {
   res.render("index.ejs");
});

app.get("/potions", function(req, res) {
   res.render("potions.ejs");
});

app.get("/weapons", function(req, res) {
   res.render("weapons.ejs");
});

app.get("/armor", function(req, res) {
   res.render("armor.ejs");
});

app.get("/wands", function(req, res) {
   res.render("wands.ejs");
});

app.get("/crystals", function(req, res) {
   res.render("crystals.ejs");
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

app.get("/login", function(req, res) {
   res.render("login.ejs");
});

app.get("/signup", function(req, res) {
   res.render("signup.ejs");
});

app.get("/shoppingcart", function(req, res) {
   res.render("shoppingcart.ejs");
});

app.get("/checkout", function(req, res) {
   res.render("checkout.ejs");
});

app.get("/thankyou", function(req, res) {
   res.render("thankyou.ejs");
});

// sql database path route. SQL statement goes here.

//store signup info

//store recepit

//search for login existing user

// starting server
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Express server is running...");
});
