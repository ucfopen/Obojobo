var express = require('express')
var router = express.Router()
let DraftModel = oboRequire('models/draft')
let logger = require('../../logger')

const xmlToDraftObject = require('obojobo-draft-xml-parser/xml-to-draft-object')

var db = require('../../db')

let insertNewDraft = require('./drafts/insert_new_draft')
let updateDraft = require('./drafts/update_draft')

router.get('/:draftId', (req, res, next) => {
	let draftId = req.params.draftId

	return DraftModel.fetchById(draftId)
		.then(draftTree => {
			draftTree.root.yell('internal:sendToClient', req, res)
			res.success(draftTree.document)
			return next()
		})
		.catch(err => {
			logger.error(err)
			res.missing('Draft not found')
			next(err)
			return Promise.reject(err)
		})
})

//@TODO - Transactionify this
router.post('/new', (req, res, next) => {
	let newDraft = null
	let user = null

	return req
		.requireCurrentUser()
		.then(currentUser => {
			user = currentUser
			if (!currentUser.canCreateDrafts) throw 'Insufficent permissions'

			return db.none(`BEGIN`)
		})
		.then(() => {
			return insertNewDraft(user.id)
		})
		.then(newDraft => {
			res.success(newDraft)
			return next()
		})
		.catch(err => {
			res.unexpected(err)
			next(err)
			return Promise.reject(err)
		})
})

//@TODO - Ensure that you can't post to a deleted draft, ensure you can only delete your own stuff
router.post(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/, (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			if (!currentUser.canEditDrafts) throw 'Insufficent permissions'

			let xml
			let reqInput

			// req.body will either be an object if sent via application/json or
			// (hopefully) XML if sent as text
			switch (typeof req.body) {
				case 'object':
					reqInput = req.body
					break

				case 'string':
					try {
						xml = req.body
						const convertedXml = xmlToDraftObject(req.body, true)
						if (typeof convertedXml === 'object') {
							reqInput = convertedXml
							break
						}
					} catch (e) {
						logger.error('Parse XML Failed:', e, req.body)
						// continue to intentional fall through
					}

				// intentional fall through

				default:
					logger.error('Posting draft failed - format unexpected:', req.body)
					res.badInput('Posting draft failed - format unexpected')
					return next()
			}

			return updateDraft(req.params[0], reqInput, xml || null).then(id => {
				res.success({ id })
				return next()
			})
		})
		.catch(error => {
			logger.error(error)
			res.unexpected(error)
			next(error)
			return Promise.reject(error)
		})
})

router.delete('/:draftId', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			if (!currentUser.canDeleteDrafts) throw 'Insufficent permissions'

			return db.none(
				`
			UPDATE drafts
			SET deleted = TRUE
			WHERE id = $[draftId]
			AND user_id = $[userId]
		`,
				{
					draftId: req.params.draftId,
					userId: currentUser.id
				}
			)
		})
		.then(id => {
			res.success(id)
			return next()
		})
		.catch(err => {
			res.unexpected(err)
			next(err)
			return Promise.reject(err)
		})
})

router.get('/', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			if (!currentUser.canViewDrafts) throw 'Insufficent permissions'
			return db.any(
				`
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
		`,
				{ userId: currentUser.id }
			)
		})
		.then(result => {
			res.success(result)
			return next()
		})
		.catch(err => {
			logger.error(err)
			res.unexpected(err)
			next(err)
			return Promise.reject(err)
		})
})

module.exports = router
