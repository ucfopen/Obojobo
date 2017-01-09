var express = require('express');
var router = express.Router();
var db = require('../../db.js')

resultToDraft = (result) => {
  let draft  = result.document
  draft._id  = result.id
  draft._rev = result.revision
  return draft
}

router.get('/sample', (req, res, next) => {

  console.log(req)

  db.one("SELECT * from drafts where id = $1", "00000000-0000-0000-0000-000000000000")
  .then( result => res.json(resultToDraft(result)))
  .catch( error => res.status(404).json({error:'Draft not found'}))

});

router.get('/:draftId', (req, res, next) => {

  db.one("SELECT * from drafts where id = $1", req.params.draftId)
  .then(result => res.json(resultToDraft(result)))
  .catch(error => res.status(404).json({error:'Draft not found'}))

});

module.exports = router;
