var express = require("express");
var router = express.Router();
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/adminqueue',(req,res,next)=>{
    if(req.session.loggedinUser){

        pool.query("SELECT * FROM shopregistration where ownerid = ($1)",[req.session.emailAddress],(err,result)=>{
            if(err) console.log(err);
            else{
                // console.log(result.rows[0]);
                var shpnm = result.rows[0].shopname;
                var add = result.rows[0].addressline1+","+result.rows[0].addressline2;
                var mob = result.rows[0].mobileno;
                var dm = result.rows[0].bussinessdomain;
                var q;

                let s = req.session.emailAddress;
                var nm = s.substr(0,s.length-4);
                nm = nm.replace('@','');

                var qr = "select exists (select from pg_tables where schemaname='public' and tablename='"+nm+"')";
                pool.query(qr,(err,resl)=>{
                    if(err) console.log(err);
                    else{
                        if(resl.rows[0].exists) q = "View Queue";
                        else q = "Start Queue";
                        res.render("Admin1.ejs",{email:req.session.emailAddress,shopname:shpnm,Add1:add,contact:mob,domain:dm,q:q});
                    }
                })
            }
        })
    }else{
        res.redirect('/homeAdmin');
    }
});


module.exports = router;