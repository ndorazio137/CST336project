// requirements
const express = require("express");
const request = require("request");
const pool = require("./dbPool.js");
const session = require('express-session');
const bcrypt = require('bcrypt');

// express app
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
   res.render("index");
});

app.get("/login", function(req, res) {
   res.render("login");
});

app.post("/login", async function(req, res) {
   let username = req.body.username;
   let password = req.body.password;
   console.log("USERNAME: " + username);
   console.log("PASSWORD: " + password);
   let hashedPwd = "$2a$10$AjnC509IqVfhQ06xYuOzQ.F1CSVAh7Fh4pGviPO3nd3glLvyX0Kg2";

   let passwordMatch = await checkPassword(password, hashedPwd);
   console.log("passwordMatch: " + passwordMatch.toString());
   //*******This is commented out for easy access to other pages while building*****//
   //** Do not delete.It will be used ** ** ** //
   // if (username == "admin" && passwordMatch) {
   //    req.session.authenticated = true;
   res.render("admin");
   // }
   // else {
   //    res.render("login", { "loginError": true });
   // }
});

function checkPassword(password, hashedValue) {
   return new Promise(function(resolve, reject) {
      bcrypt.compare(password, hashedValue, function(err, result) {
         console.log("Result: " + result.toString());
         resolve(result);
      });
   });
}

function isAuthenticated(req, res, next) {
   if (!req.session.authenticated) {
      res.redirect("account");
   }
   else {
      next();
   }
}

app.get("/myAccount", isAuthenticated, function(req, res) {
   if (req.session.authenticated) {
      res.render("account");
   }
   else {
      res.redirect("login");
   }
});

app.get("/logout", function(req, res) {
   req.session.destroy();
   res.redirect("/");
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

// unfinished post
app.post("/addToCart", function(req, res) {
   console.log("added to cart");
});

// unfinished search
app.get("/search", function(req, res) {

   let keyword = "";
   if (req.query.keyword) {
      keyword = req.query.keyword;
   }

   // implement what to do with search keyword here.

   res.send("You have used search! Now implement it!");
});

// sql database path route. SQL statement goes here.

//store signup info

//store recepit

//database request for login existing user

//listener

app.listen(process.env.PORT || 8080, "0.0.0.0", function() {
   console.log("Running Express Server...");
});
