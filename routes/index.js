const express = require('express');
const router = express.Router();
const helper = require('../scripts/helper.js')

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Luovat | Etusivu' });
});

router.get('/login', (req,res,next) => {
  res.render('login',{title:'Luovat Login'})
})

router.get('/sitemap.xml', function(req, res) {
  var sitemap = helper.generateXmlSitemap(); // get the dynamically generated XML sitemap
  res.header('Content-Type', 'text/xml');
  res.send(sitemap);     
})

router.get('/logout',(req,res,next) => {
  res.redirect('/artists/logout')
})

module.exports = router;
