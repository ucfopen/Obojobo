var express = require('express');
var router = express.Router();
var db = require('../db')

router.all('/', (req, res, next) => {
	// let oboGlobals = new OboGlobals();

	req.getCurrentUser(true)
	.then(user => {
		if(user.isGuest()) return Promise.reject(new Error('Login Required'))
		if(!user.canViewEditor) {
			res.status(404)
			return next()
		}

		db.any(`
			SELECT DISTINCT ON (draft_id)
				draft_id AS "draftId",
				id AS "latestVersion",
				created_at AS "createdAt",
				content
			FROM drafts_content
			WHERE draft_id IN (
				SELECT id
				FROM drafts
				WHERE deleted = FALSE
				AND user_id = $[userId]
			)
			ORDER BY draft_id, id desc
		`, {
			userId: user.id
		})
		.then( drafts => {
			res.render('editor.pug', {
				title: 'Obojobo 3',
				drafts: drafts
			})

			next()
		})

	})
	.catch(error => {
		next(error)
	})
});

module.exports = router;
