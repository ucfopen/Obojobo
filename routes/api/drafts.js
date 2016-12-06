var express = require('express');
var router = express.Router();
var rp = require('request-promise');

var cdb = 'http://localhost:5984'


router.get('/sample', (req, res, next) => {

  let getRequest = {
    uri: cdb + '/drafts/_all_docs?include_docs=true&limit=1',
    method: 'GET',
    json: true
  }

  rp(getRequest)
  .then( allDocs => {
    res.json(allDocs.rows[0].doc);
  })
  .catch( () => {
    res.status(404).json({error:'Draft not found'});
  })

});

router.get('/:draftId', (req, res, next) => {

  let getRequest = {
    uri: cdb + '/drafts/' + req.params.draftId,
    method: 'GET',
    json: true
  }

  rp(getRequest)
  .then( draft => {
    res.json(draft);
  })
  .catch( () => {
    res.status(404).json({error:'Draft not found'});
  })

});

module.exports = router;
