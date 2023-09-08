const express = require("express");
const ejs = require("ejs");
const app = express();
const bcrypt = require("bcrypt");

app.set('view engine','ejs');

const Pool = require("pg").Pool;
const { application } = require("express");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

var router = express.Router();

router.get('/loginUser', function(req,res,next){
    res.render('loginUser.ejs');
})

router.post('/loginUser', (req,res)=>{
    var username = req.body.un;
    var password = req.body.pwd;
    var msg;
    pool.query("select * from users where email=($1)",[username],(err,result)=>{
        if(result.rows.length == 1 && result.rows[0].email==username){
            bcrypt.compare(password,result.rows[0].password,(err,result)=>{
                if(result==true){
                    req.session.loggedinUser = true;
                    req.session.emailAddress = username;
                    res.redirect("/dashboard");
                }else{
                    res.render("loginUser.ejs",{alertMsg:"Wrong password"});
                }
            })
        }else{
            msg = "User doesn't exists";
            res.render("loginUser.ejs",{alertMsg:msg});
        }
    })
});
module.exports = router;