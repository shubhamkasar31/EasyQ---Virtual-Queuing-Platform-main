var express = require('express');
var router = express.Router();
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/* GET users listing. */
router.get('/homeAdmin', function(req, res, next) {
    if(req.session.loggedinUser){
        // console.log(req.session.emailAddress);
        res.render('registerOwner.ejs',{email:req.session.emailAddress})
    }else{
        res.redirect('/loginUser');
    }
});

router.post('/homeAdmin',function(req,res,next){
    // console.log(req.session.emailAddress);
    var ownerName = req.body.ownername;
    var shopName = req.body.shopname;
    var domain = req.body.domain;
    var add1 = req.body.add1;
    var add2 = req.body.add2;
    var mobno = req.body.mobno;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;

    console.log(typeof starttime);

    pool.query("INSERT INTO SHOPREGISTRATION VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",[req.session.emailAddress,ownerName,domain,add1,add2,starttime,endtime,mobno,shopName],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Shop Regisered Successfully");
        }
    })

    res.render("registerOwner.ejs",{alertMsg:"Shop Registered Successfully",email:req.session.emailAddress});
})

module.exports = router;