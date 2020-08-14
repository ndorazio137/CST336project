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
   saveUninitialized: true,
   duration: 30 * 60 * 1000,
   activeDuration: 5 * 60 * 1000,
   httpOnly: true,
   secure: true,
   ephemeral: true
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
   let isAdmin = 0;
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
   if (isAdmin && passwordMatch) {
      req.session.authenticated = true;
      req.session.user = username;
      req.session.userId = await getCurrentUserId(username);
      res.render("admin");
   }
   else if (passwordMatch) {
      req.session.authenticated = true;
      req.session.user = username;
      req.session.userId = await getCurrentUserId(username);
      res.render("account");
   }
   else {
      res.render("login", { "loginError": true });
   }
});


function getIsAdminRows(username) {
   let sql = "SELECT isAdmin FROM Users WHERE username = ?";
   return new Promise(function(resolve, reject) {
      pool.query(sql, [username], function(err, rows, fields) {
         if (err) throw err;
         console.log("getIsAdminRows: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
}


app.post("/api/signup", async function(req, res) {
   let username = req.body.username;
   let usernameResult = await checkUsername(username);

   let email = req.body.email;
   let emailResult = await checkEmail(email);

   if (emailResult.length > 0 && usernameResult > 0) {
      console.log("USERNAME: " + username);
      console.log("EMAIL: " + email);
      res.redirect("/");
   }
   else if (usernameResult <= 0 && emailResult <= 0) {
      console.log("username does not exist");
      console.log("email does not exist");
      res.render("signup", { emailError: true });
   }
   else if (usernameResult <= 0) {
      console.log("username does not exist");
      console.log("EMAIL: " + email);
      res.render("signup", { usernameError: true });
   }
});


/** 
 * Checks whether the username exists in the database.
 * if found, returns the corresponding record.
 * @param {string} username
 * @return {array of objects}
 */
function checkUsername(username) {
   let sql = "SELECT * FROM Users WHERE username = ?";
   return new Promise(function(resolve, reject) {
      pool.query(sql, [username], function(err, rows, fields) {
         if (err) throw err;
         console.log("checkUsername: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
}

function checkEmail(email) {
   let sql = "SELECT * FROM Users WHERE email = ?";
   return new Promise(function(resolve, reject) {
      pool.query(sql, [email], function(err, rows, fields) {
         if (err) throw err;
         console.log("checkEmail: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
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

app.get("/myAccount", isAuthenticated, async function(req, res) {
   let adminRows;
   adminRows = await getIsAdminRows(req.session.user);
   let isAdmin = 0;

   if (adminRows.length > 0) {
      isAdmin = adminRows[0].isAdmin;
   }

   if (req.session.authenticated && isAdmin) {
      res.render("admin");
   }
   else if (req.session.authenticated && !isAdmin) {
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
   let sql = "SELECT name, price, imageUrl, description, quantity" +
      " FROM Products" +
      " JOIN Carts" +
      " ON Products.productId = Carts.productId" +
      " JOIN Users" +
      " ON Carts.userId = Users.userId" +
      " WHERE username = ?;";
   let sqlParams = [req.session.user];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      res.render("shoppingcart", { "rows": rows });
   });
});

app.post("/api/deleteProduct", function(req, res) {
   let sql = "DELETE FROM Products WHERE name=? LIMIT 1";
   let sqlParams = [req.body.product_name];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      console.log(sqlParams);
      res.render("admin", { "rows": rows });
   });
});

function deleteProductFromCart(product_name) {
   let sql = "SELECT FROM Products WHERE name= ?";
   return new Promise(function(resolve, reject) {
      pool.query(sql, [product_name], function(err, rows, fields) {
         if (err) throw err;
         console.log("deleteProduct: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
}

app.get("/checkout", function(req, res) {
   res.render("checkout");
});

app.get("/thankyou", function(req, res) {
   res.render("thankyou");
});

app.post("/api/removeFromCart", function(req, res) {
   let sql = "DELETE FROM Carts WHERE userId = ? AND productId = ?";
   let sqlParams = [req.session.userId, req.body.product_id];

   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      console.log("removeFromCart: Rows deleted: " + rows.length);
      res.redirect("/shoppingcart");
   }); //query
});


// unfinished post
app.post("/api/addToCart", async function(req, res) {
   console.log("From URL: ");
   console.log("Product ID: " + req.body.product_id);
   console.log("Product name: " + req.body.product_name);
   console.log("Product price: " + req.body.product_price);

   let isInCart = await isAlreadyInCart(req, req.body.product_id);
   
   if (isInCart.length > 0) {
      let sql = "UPDATE Carts SET quantity = ? WHERE userId = ? AND productId = ?";
      let sqlParams = [isInCart[0].quantity + 1, req.session.userId, req.body.product_id];
      // return new Promise(function(resolve, reject) {
         pool.query(sql, sqlParams, function(err, rows, fields) {
            if (err) throw err;
            console.log("getProduct: Rows found: " + rows.length);
            // resolve(rows);
            res.redirect("/shoppingcart");
         }); //query
      // }); //promise
   }
   else {
      let sql = "INSERT INTO Carts (userId, productId) VALUES (?, ?)";
      let sqlParams = [req.session.userId, req.body.product_id];
      // return new Promise(function(resolve, reject) {
         pool.query(sql, sqlParams, function(err, rows, fields) {
            if (err) throw err;
            console.log("getProduct: Rows found: " + rows.length);
            res.redirect("/shoppingcart");
         }); //query
      // }); //promise
   }
   
});

function isAlreadyInCart(req, productId) {
   let sql = "SELECT * FROM Carts WHERE userId = ? AND productId = ?";
   let sqlParams = [req.session.userId, productId];

   return new Promise(function(resolve, reject) {
      pool.query(sql, sqlParams, function(err, rows, fields) {
         if (err) throw err;
         console.log("getProduct: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise

}

function getCurrentUserId(username) {
   let sql = "SELECT userId FROM Users WHERE username = ?";
   let sqlParams = [username];
   return new Promise(function(resolve, reject) {
      pool.query(sql, sqlParams, function(err, rows, fields) {
         if (err) throw err;
         console.log("getProduct: Rows found: " + rows.length);
         resolve(rows[0].userId);
      }); //query
   }); //promise
}

app.post("/api/addProduct", function(req, res) {
   let sql = "INSERT INTO Products (name, type, price, description, imageUrl, numberInStock) VALUES (?, ?, ?, ?, ?, ?)";
   let sqlParams = [req.body.product_name, req.body.product_category, req.body.product_price, req.body.product_description, req.body.product_image, req.body.product_quantity];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      // Render search results page, passing the results of the SQL query
      console.log(rows);
      console.log(sqlParams);
      res.render("admin", { "rows": rows });
   });
});

app.post("/api/updateProduct", async function(req, res) {
   let productRows;
   productRows = await getProduct(req.body.product_name);

   if (productRows.length == 0) {
      // no existing product found...
      console.log("Product " + req.body.product_name + " not found.");
      res.render("admin", { "productUpdateError": true });
   }

   let product = [];
   product = productRows[0];

   let updateResults;
   updateResults = await updateProduct(req, product);

   console.log("Update returned...");
   console.log(updateResults);

   res.render("admin", { "rows": updateResults.changedRows });
});

function getProduct(product_name) {
   let sql = "SELECT name, type, price, description, imageUrl, " +
      "numberInStock FROM Products WHERE name = ?";
   let sqlParams = [product_name];

   return new Promise(function(resolve, reject) {
      pool.query(sql, sqlParams, function(err, rows, fields) {
         if (err) throw err;
         console.log("getProduct: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
}

function updateProduct(req, product) {
   let sql = "UPDATE Products " +
      "SET type = ?, price = ?, description = ?, imageUrl = ?, numberInStock = ? " +
      "WHERE name = ? LIMIT 1";

   let product_name = product.name;
   let product_category = product.type;
   let product_price = product.price;
   let product_description = product.description;
   let product_image = product.imageUrl;
   let product_quantity = product.numberInStock;

   if (req.body.product_category != "") {
      product_category = req.body.product_category
   }
   if (req.body.product_price != "") {
      product_price = req.body.product_price
   }
   if (req.body.product_description != "") {
      product_description = req.body.product_description
   }
   if (req.body.product_image != "") {
      product_image = req.body.product_image
   }
   if (req.body.product_quantity != "") {
      product_quantity = req.body.product_quantity
   }

   let sqlParams = [product_category, product_price, product_description, product_image, product_quantity, product_name];

   return new Promise(function(resolve, reject) {
      pool.query(sql, sqlParams, function(err, rows, fields) {
         if (err) throw err;
         console.log("updateProduct: Rows found: " + rows.length);
         resolve(rows);
      }); //query
   }); //promise
}

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
   let sqlParams = ["%" + type + "%", "%" + name + "%", "%" + desc + "%"];
   pool.query(sql, sqlParams, function(err, rows, fields) {
      if (err) throw err;
      // Render search results page, passing the results of the SQL query
      console.log(rows);
      console.log(sqlParams);
      res.render("searchResults", { "rows": rows });
   });
});

//listener
app.listen(process.env.PORT || 8080, "0.0.0.0", function() {
   console.log("Running Express Server...");
});
