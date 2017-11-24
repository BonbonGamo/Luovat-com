var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Luovat | Etusivu' });
});

router.get('/login', (req,res,next) => {
  res.render('login',{title:'Luovat Login'})
})

router.get('/logout',(req,res,next) => {
  res.redirect('/artists/logout')
})

module.exports = router;
