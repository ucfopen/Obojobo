var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index.pug', { title: 'Obojobo 3', paths: req.app.locals.paths });
  next()
});

/* GET home page. */
router.get('/view', (req, res, next) => {
  res.render('viewer.pug', { title: 'Obojobo 3', paths: req.app.locals.paths });
  next()
});

module.exports = router;
