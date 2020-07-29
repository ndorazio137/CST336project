const express = require("express");
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));

//routes
app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.get("/potions", function(req, res) {
    res.render("potions.ejs");
});

// starting server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running...");
});
