var express = require('express');
var router = express.Router();

router.get('/logoutAdmin', function(req, res, next) {
    req.session.destroy();
    res.redirect('/homeAdmin');
});

module.exports = router;