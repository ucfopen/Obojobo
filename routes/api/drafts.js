var router = require('../../router.js');
var db = require('../../db.js');
let DraftModel = require('../../models/draft')

router.get('/sample', (req, res, next) => {
  DraftModel.fetchById("00000000-0000-0000-0000-000000000000")
    .then(draftTree => {
      draftTree.root.yell('internal:sendToClient', req, res)
      res.success(draftTree.document)
      next()
    })
    .catch(error => {
      console.error(error)
      res.missing('Draft not found')
      next()
    })

});

router.get('/:draftId', (req, res, next) => {

  db
    .one("SELECT * from drafts where id = $1", req.params.draftId)
    .then(result => {
      res.success(resultToDraft(result))
      next()
    })
    .catch(error => {
      res.missing('Draft not found')
      next()
    })

});

module.exports = router;
