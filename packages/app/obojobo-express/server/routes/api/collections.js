const express = require('express')
const router = express.Router()
const CollectionModel = oboRequire('server/models/collection')

//gonna need to make collection equivalents for these permissions and validators
const { userHasPermissionToCollection } = require('obojobo-repository/server/services/permissions')
const { checkValidationRules, requireCanCreateDrafts } = oboRequire('server/express_validators')

// Create a Collection
// mounted as /api/collections/new
router
	.route('/new')
	.post([requireCanCreateDrafts, checkValidationRules])
	.post((req, res, next) => {
		return CollectionModel.createWithUser(req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

// Rename a Collection
// mounted as /api/collections/rename
router
	.route('/rename')
	.post([requireCanCreateDrafts, checkValidationRules])
	.post(async (req, res, next) => {
		const hasPerms = await userHasPermissionToCollection(req.currentUser.id, req.body.id)
		if (!hasPerms) {
			return res.notAuthorized('You must be the creator of this collection to rename it')
		}

		return CollectionModel.rename(req.body.id, req.body.title)
			.then(res.success)
			.catch(res.unexpected)
	})

module.exports = router
