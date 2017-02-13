var router = require('../../router.js');
var db = require('../../db.js');

router.get('/sample', (req, res, next) => {
  req.app.getDraft("00000000-0000-0000-0000-000000000000")
    .then( (draftTree) => {
      draftTree.root.yell('internal:sendToClient', req, res)

      res.success(draftTree.document)
    })

    .catch( (error) => {
      console.error(error)
      res.missing('Draft not found0')
    })

});

router.get('/:draftId', (req, res, next) => {

  db
    .one("SELECT * from drafts where id = $1", req.params.draftId)
    .then(result => res.success(resultToDraft(result)))
    .catch(error => res.missing('Draft not found1'))

});

module.exports = router;
