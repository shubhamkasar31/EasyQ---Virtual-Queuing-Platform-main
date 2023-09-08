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

router.get('/loginAdmin', function(req,res,next){
    res.render('loginAdmin.ejs');
})

router.post('/loginAdmin', (req,res)=>{
    var username = req.body.un;
    var password = req.body.pwd;
    var msg;
    pool.query("select * from admins where email=($1)",[username],(err,result)=>{
        if(result==undefined){
            msg = "Admin doesn't exists";
            console.log(msg);
            res.render("loginAdmin.ejs",{alertMsg:msg});
        }
        if(result.rows.length == 1 && result.rows[0].email==username){
            bcrypt.compare(password,result.rows[0].password,(err,resl)=>{
                if(resl==true){
                    req.session.loggedinUser = true;
                    req.session.emailAddress = username;
                    req.session.isstart = false;
                    res.redirect("/homeAdmin");
                }else{
                    res.render("loginAdmin.ejs",{alertMsg:"Wrong password"});
                }
            })
        }else{
            msg = "Admin doesn't exists";
            res.render("loginAdmin.ejs",{alertMsg:msg});
        }
    })
});
module.exports = router;