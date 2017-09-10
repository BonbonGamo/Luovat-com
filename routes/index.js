var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Luovat | Etusivu' });
});

router.get('/login', function(req,res,next){
  res.render('login',{title:'Luovat Login'})
})

module.exports = router;
