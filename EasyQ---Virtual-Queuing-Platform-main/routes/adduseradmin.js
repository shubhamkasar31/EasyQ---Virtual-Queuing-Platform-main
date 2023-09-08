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

router.get('/adduseradmin',(req,res,next)=>{
    if(req.session.loggedinUser){
        let s = req.session.emailAddress;
        var nm = s.substring(0,s.length-4);
        nm = nm.replace('@','');

        console.log(nm);
        res.render('adduseradmin.ejs',{email:req.session.emailAddress,tbname:nm});
    }else{
        res.redirect("/adminqueue");
    }
});


router.post('/adduseradmin/(:id)',(req,res,next)=>{
    if(req.session.loggedinUser){
        var tb = req.params.id;
        
        var nm = req.body.nm;
        var eml = req.body.eml;
        

        var qr = "insert into "+tb+" values ('"+nm+"','"+eml+"')";
        console.log(qr);

        pool.query(qr,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log("User added Successfully..");
                res.redirect('/adminqlist');
            }
        })

    }else{
        res.redirect("/adminqlist");
    }
});


module.exports = router;