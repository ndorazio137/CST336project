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
   let sql = "SELECT * FROM Products";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("index", { "rows": rows });
   });
});

app.get("/login", function(req, res) {
   res.render("login");
});

app.post("/login", async function(req, res) {
   let username = req.body.username;
   let password = req.body.password;
   let isAdmin  = 0;
   console.log("USERNAME: " + username);
   console.log("PASSWORD: " + password);
   let hashedPwd;

   let result = await checkUsername(username);
   console.dir(result);
   hashedPwd = "";
   
   let adminCheckRows = [];
   if (result.length > 0) {
      hashedPwd = result[0].password;
      adminCheckRows = await getIsAdminRows(username);
   }
   if (adminCheckRows.length > 0) {
         isAdmin = adminCheckRows[0].isAdmin;
   }
   console.log("isAdmin:  " + isAdmin);

   let passwordMatch = await checkPassword(password, hashedPwd);
   console.log("passwordMatch: " + passwordMatch.toString());
   //*******This is commented out for easy access to other pages while building*****//
   //** Do not delete.It will be used ** ** ** //
   if (isAdmin && passwordMatch) {
      req.session.authenticated = true;
      res.render("admin");
   }
   else if (passwordMatch) {
      req.session.authenticated = true;
      res.render("account");
   }
   else {
      res.render("login", { "loginError": true });
   }
});


function getIsAdminRows(username) {
   let sql = "SELECT isAdmin FROM Users WHERE username = ?";
   return new Promise(function(resolve, reject){
      pool.query(sql, [username], function (err, rows, fields) {
         if (err) throw err;
         console.log("getIsAdminRows: Rows found: " + rows.length);
         resolve(rows);
      });//query
   });//promise
}

/** 
 * Checks whether the username exists in the database.
 * if found, returns the corresponding record.
 * @param {string} username
 * @return {array of objects}
 */
function checkUsername(username) {
   let sql = "SELECT * FROM Users WHERE username = ?";
   return new Promise(function(resolve, reject){
      pool.query(sql, [username], function (err, rows, fields) {
         if (err) throw err;
         console.log("checkUsername: Rows found: " + rows.length);
         resolve(rows);
      });//query
   });//promise
}

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
      res.redirect("login");
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
   // res.render("potions");
   let sql = "SELECT * FROM Products WHERE type= 'Potion'";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("potions", { "rows": rows });
   });
});

app.get("/weapons", function(req, res) {
   let sql = "SELECT * FROM Products WHERE type= 'Weapon'";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("weapons", { "rows": rows });
   });
});

app.get("/armor", function(req, res) {
   // res.render("armor");
   let sql = "SELECT * FROM Products WHERE type= 'Armor'";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("armor", { "rows": rows });
   });
});

app.get("/wands", function(req, res) {
   let sql = "SELECT * FROM Products WHERE type= 'Wand'";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("wands", { "rows": rows });
   });
});

app.get("/crystals", function(req, res) {
   // res.render("crystals");
   let sql = "SELECT * FROM Products WHERE type= 'Crystal'";
   pool.query(sql, function(err, rows, fields) {
      if (err) throw err;
      //console.log(rows);
      res.render("crystals", { "rows": rows });
   });
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
app.get("/api/addToCart", function(req, res) {
   console.log("From URL: ");
   console.log("Product ID: " + req.query.product_id);
   console.log("Product name: " + req.query.product_name);
   console.log("Product price: " + req.query.product_price);
});


app.post("/addProduct", function(req, res) {
   let sql = "INSERT INTO Products (name, type, price, description, imageUrl, numberInStock) VALUES (?, ?, ?, ?, ?, ?)";
   let sqlParams = [req.body.product_name, req.body.product_category, req.body.product_price, req.body.product_description, req.body.product_image, req.body.product_quantity];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      // Render search results page, passing the results of the SQL query
      console.log(rows);
      console.log(sqlParams);
      // res.render("searchResults", { "rows": rows });
   });
});


app.get("/search", function(req, res) {

   // Set default values for type, name, and desc 
   // and get them from the form if applicable
   let type = "";
   if (req.query.type) {
      type = req.query.type;
   }
   let name = "";
   if (req.query.name) {
      name = req.query.name;
   }
   let desc = "";
   if (req.query.desc) {
      desc = req.query.desc;
   }

   // Run SQL query
   let sql = "SELECT * FROM Products WHERE type LIKE ? AND name LIKE ? AND description LIKE ?";
   let sqlParams = ["%"+type+"%", "%"+name+"%", "%"+desc+"%"];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      // Render search results page, passing the results of the SQL query
      console.log(rows);
      console.log(sqlParams);
      res.render("searchResults", { "rows": rows });
   });
});

// sql database path route. SQL statement goes here.

//store signup info

//store recepit

//database request for login existing user

//listener

app.listen(process.env.PORT || 8080, "0.0.0.0", function() {
   console.log("Running Express Server...");
});
