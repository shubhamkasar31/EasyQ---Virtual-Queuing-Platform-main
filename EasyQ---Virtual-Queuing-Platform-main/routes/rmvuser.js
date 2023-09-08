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

router.get("/(:tbname)/(:name)/(:email)",(req,res,next)=>{
    if(req.session.loggedinUser){
        var nm = req.params.name;
        var eml = req.params.email;
        var tbname = req.params.tbname;

        var qr = "delete from "+tbname+" where ids='"+eml+"' and name='"+nm+"'";
        console.log(qr);
        pool.query(qr,(err,result)=>{
            if(err) console.log(err);
            else{
                console.log("User deleted Successfully..");
                res.redirect("/adminqlist");
            }
        })
    }else{
        res.redirect("/adminqueue");
    }

})


module.exports = router;