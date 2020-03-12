const express = require('express')
const router = express.Router()
const CollectionModel = oboRequire('server/models/collection')

//gonna need to make collection equivalents for these permissions and validators
const { userHasPermissionToCollection } = require('obojobo-repository/server/services/permissions')
const { checkValidationRules, requireCanCreateDrafts, requireCanDeleteDrafts } = oboRequire(
	'server/express_validators'
)

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

// Delete a collection
// mounted as api/collections/:id
router
	.route('/:id')
	.delete([requireCanDeleteDrafts, checkValidationRules])
	.delete(async (req, res, next) => {
		const hasPerms = await userHasPermissionToCollection(req.currentUser.id, req.params.id)
		if (!hasPerms) {
			return res.notAuthorized('You must be the creator of this collection to delete it')
		}

		return CollectionModel.delete(req.params.id)
			.then(res.success)
			.catch(res.unexpected)
	})

// Add a module to a collection
// mounted as api/collections/:id/module/add
router
	.route('/:id/module/add')
	.post([requireCanCreateDrafts, checkValidationRules])
	.post(async (req, res, next) => {
		const hasPerms = await userHasPermissionToCollection(req.currentUser.id, req.params.id)
		if (!hasPerms) {
			return res.notAuthorized('You must be the creator of this collection to add modules to it')
		}

		return CollectionModel.addModule(req.params.id, req.body.draftId, req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

// Remove a module from a collection
// mounted as api/collections/:id/module/remove
router
	.route('/:id/module/remove')
	.delete([requireCanDeleteDrafts, checkValidationRules])
	.delete(async (req, res, next) => {
		const hasPerms = await userHasPermissionToCollection(req.currentUser.id, req.params.id)
		if (!hasPerms) {
			return res.notAuthorized(
				'You must be the creator of this collection to remove modules from it'
			)
		}

		return CollectionModel.removeModule(req.params.id, req.body.draftId)
			.then(res.success)
			.catch(res.unexpected)
	})

module.exports = router
