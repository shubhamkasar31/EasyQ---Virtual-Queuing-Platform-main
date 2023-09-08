var express = require('express');
var router = express.Router();
const Pool = require('pg').Pool;


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/dashboard', function(req, res, next) {
    if(req.session.loggedinUser){
        pool.query("select * from shopregistration where status=true",(err,result)=>{
            if(err) console.log(err);
            else{
                res.render('dashboard.ejs',{email:req.session.emailAddress,data:result.rows});
            }
        })
    }else{
        res.redirect('/loginUser');
    }
});
module.exports = router;