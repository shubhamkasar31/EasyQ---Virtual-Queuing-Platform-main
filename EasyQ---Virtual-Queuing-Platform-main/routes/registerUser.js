const express = require("express");
require('dotenv').config();
const bcrypt = require("bcrypt");
const {v4 : uuidv4} = require('uuid');
const ejs = require("ejs");
const app = express();

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

router.get('/registerUser', function(req,res,next){
    res.render('registerUser.ejs');
})

router.post('/registerUser',async (req,res,next)=>{
    var pwd;
    try{
        pwd = await bcrypt.hash(req.body.password,10);
    }catch(e){
        console.log(e);
    }
    
    pool.query("Select * from users where email=($1)",[req.body.username],(err,results)=>{
        var msg;
        if(err){
            console.log(err);
        }else if(results.rows.length>0 && results.rows[0].email.length>1){
            msg = "User Already exists";
        }else{
            pool.query("INSERT INTO USERS VALUES($1,$2,$3)",[uuidv4(),req.body.username,pwd],(err,result)=>{
                if(err){
                    msg = "Error occured while creating the user";
                }
            });
            msg = "User created successfully";
        }
        res.render('registerUser',{alertMsg:msg});
    });
    // res.redirect('/register');
    
});
module.exports = router;