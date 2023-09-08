var express = require("express");
var router = express.Router();
var Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/queueUser/(:id)',(req,res,next)=>{
    if(req.session.loggedinUser){
        var nm = req.params.id;

        var qr = "select * from "+nm;
        pool.query(qr,(err,result)=>{
            if(err) console.log(err);
            else{
                var a = nm.substring(0,nm.length-5);
                var pre = a+"@gmail.com";

                console.log(pre);
                pool.query("select * from shopregistration where ownerid='"+pre+"'",(err,resl)=>{
                    if(err) console.log(err);
                    else{
                        console.log(resl.rows);
                        res.render('userq.ejs',{email:req.session.emailAddress,data:result.rows,tbname:nm,dt:resl.rows});
                    }
                })
            }
        })
    }else{
        res.redirect('/dashboard');
    }
});

router.get('/leavequser/(:id)',(req,res,next)=>{
    if(req.session.loggedinUser){
        var name = req.params.id;

        let qr = "delete from "+name+" where ids = '"+req.session.emailAddress+"'";

        console.log(qr);
        pool.query(qr,(err,result)=>{
            if(err) console.log(err);
            else{
                res.redirect('/dashboard');
            }
        });
    }else{
        res.redirect('/dashboard');
    }
})

module.exports = router;