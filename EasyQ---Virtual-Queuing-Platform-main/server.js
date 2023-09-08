const express = require('express');
const app = express();
const ejs = require('ejs');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'views')));

app.use(cookieParser());
app.use(session({
    secret:"awhjdasdashdgays1233345H$%$3",
    saveUninitialized: true,
    cookie:{maxAge:1000*60*60*24},
    resave: false
}));

app.use(express.urlencoded({extended:true}));
var registerUser = require("./routes/registerUser");
var loginUser = require("./routes/loginUser");

var registerAdmin = require("./routes/registerAdmin");
var loginAdmin = require("./routes/loginAdmin");

var dashboard = require("./routes/dashboard");
var logout = require("./routes/logout");
var logoutAdmin = require("./routes/logoutAdmin")

var registerOwner = require("./routes/homeAdmin");
var adminQueue = require("./routes/adminqueue");
var adminqlist = require("./routes/adminqlist");

var queueUser = require("./routes/jnqUser");
var usernameeml = require("./routes/usernmqjn");

var adminadduser = require("./routes/adduseradmin");
var rmvuser = require("./routes/rmvuser");

app.use('/',registerUser);
app.use('/',loginUser);

app.use('/',registerAdmin);
app.use('/',loginAdmin);

// dashboard is for after user logged in then it is redirected to dashboard

app.use('/',registerOwner);
app.use('/',adminQueue);
app.use('/',adminqlist);

app.use('/',adminadduser);
app.use('/',rmvuser);

app.use('/',queueUser);

app.use('/',usernameeml);

app.use('/',dashboard);
app.use('/',logout);
app.use('/',logoutAdmin);


app.listen(80,()=>{
    console.log("Server is running at port 80");
})