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

router.get('/adminqlist',(req,res,next)=>{
    if(req.session.loggedinUser){

        // If the isstart variable is true then list is already created
        if(req.session.isstart == true){
            let s = req.session.emailAddress;
            var nm = s.substr(0,s.length-4);
            nm = nm.replace('@','');

            var qr = "select * from "+nm;
            pool.query(qr,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    qr = "select * from shopregistration where ownerid='"+req.session.emailAddress+"'";
                    // console.log("QR: " + qr);
                    pool.query(qr,(err,rsl)=>{
                        if(err) console.log(err);
                        else{
                            res.render("Admin2.ejs",{email:req.session.emailAddress,data:result.rows,tbname:nm,dt:rsl.rows});
                        }
                    })
                }
            })
        }else{
            // query building
            let s = req.session.emailAddress;
            var nm = s.substr(0,s.length-4);
            nm = nm.replace('@','');
            var qr = "create table "+nm+"(name varchar(1000),ids varchar(1000));";

            var tr = "select exists (select from pg_tables where schemaname='public' and tablename='"+nm+"')";
            console.log(tr);
            pool.query(tr,(err,result)=>{
                if(err) console.log(err);
                else{
                    if(result.rows[0].exists == true){
                        req.session.isstart = true;
                        res.redirect('/adminqlist');
                    }else{


                        pool.query(qr,(err,resl)=>{
                            if(err) {
                                console.log(err);
                            }
                            else{
                                req.session.isstart = true;
                                var s = "update shopregistration set status=true where ownerid='"+req.session.emailAddress+"'";
            
                                console.log(s);
                                pool.query(s,(err,result)=>{
                                    if(err) console.log(err);
                                    else{
                                        console.log('status updated successfully');
                                    }
                                })
                                res.redirect('/adminqlist');
                            }
                        });

                    }
                }
            })
            
        }
    }else{
        res.redirect('/homeAdmin');
    }
});

router.get('/stopqueue',(req,res,next)=>{
    if(req.session.loggedinUser==true){
        req.session.isstart = false;
        let s = req.session.emailAddress;
        var nm = s.substr(0,s.length-4);
        nm = nm.replace('@','');

         
        pool.query('drop table '+nm,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log("Queue stopped successfully..");
            }
        });
        var t = "update shopregistration set status=false where ownerid='"+req.session.emailAddress+"'";
        pool.query(t,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log("status changed to false");
            }
        })

        res.redirect('/adminqueue');
    }else{
        res.redirect('/homeAdmin');
    }
})
module.exports = router;