var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/view*', (req, res, next) => {
  res.render('viewer.pug', { title: 'Obojobo 3', paths: req.app.locals.paths, modules: req.app.locals.modules });
  next()
});

module.exports = router;
