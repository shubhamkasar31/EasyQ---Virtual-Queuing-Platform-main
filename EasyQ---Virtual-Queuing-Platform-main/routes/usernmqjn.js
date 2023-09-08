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

router.get('/joinquser/(:id)',(req,res,next)=>{
    if(req.session.loggedinUser){
        res.render("usernmqjn.ejs",{tbname:req.params.id,email:req.session.emailAddress});
    }else{
        res.redirect('/dashboard');
    }
});

router.post('/joinquser/(:id)',(req,res,next)=>{
    if(req.session.loggedinUser){
        var nm = req.body.nm;
        var eml = req.session.emailAddress;
        let s = req.params.id;
        var tb = s.substring(0,s.length-4);
        tb = tb.replace('@','');
        
        var qr = "insert into "+tb+" values("+"'"+nm+"','"+req.session.emailAddress+"')";
        
        pool.query("select * from "+tb+" where ids='"+eml+"'",(err,resl)=>{
            if(err) console.log(err);
            else{
                if(resl.rows.length==0){
                    console.log(qr);
                    pool.query(qr,(err,result)=>{
                        if(err) console.log(err);
                        else{
                            console.log("Queued successfully");
                            var url = "/queueUser/"+tb;
                            res.redirect(url);
                        }
                    })
                }else{
                    var url = "/queueUser/"+tb;
                    res.redirect(url);
                }
            }
        })

    }else{
        res.redirect('/dashboard');
    }
});

module.exports = router;