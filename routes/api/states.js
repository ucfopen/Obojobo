var express = require('express');
var router = express.Router();
var rp = require('request-promise');

router.get('/:draftId-:revision', (req, res, next) => {
  let currentUserId = 4

  let getRequest = {
    uri: req.app.locals.cdb + '/view_state/' + [currentUserId, req.params.draftId, req.params.revision].join(':'),
    method: 'GET',
    json: true
  }

  rp(getRequest)
  .then( viewState => {
    res.json(viewState);
  })
  .catch( () => {
    res.status(404).json({error:'No View State not found'});
  })

});

module.exports = router;
