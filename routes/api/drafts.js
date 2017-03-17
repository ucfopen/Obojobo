var express = require('express');
var app = express();
let DraftModel = oboRequire('models/draft')

var db = require('../../db.js')

app.get('/:draftId', (req, res, next) => {
	let draftId = (req.params.draftId === 'sample' ? "00000000-0000-0000-0000-000000000000" : req.params.draftId)

	DraftModel.fetchById(draftId)
	.then(draftTree => {
		draftTree.root.yell('internal:sendToClient', req, res)
		res.success(draftTree.document)
		next()
	})
	.catch(error => {
		res.missing('Draft not found')
		next()
	})

});

app.get('/', (req, res, next) => {
	// console.log('here')
	// res.success('good')
	db.any(`
		SELECT *
		FROM drafts
		ORDER BY created_at DESC
	`)
	.then( (result) => {
		res.success(result)
	})
});

module.exports = app;
