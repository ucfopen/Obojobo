const express = require('express')
const fs = require('fs')
const router = express.Router()
const DraftModel = oboRequire('models/draft')
const logger = oboRequire('logger')
const db = oboRequire('db')
const xmlToDraftObject = require('obojobo-draft-xml-parser/xml-to-draft-object')
const draftTemplateXML = fs
	.readFileSync('./node_modules/obojobo-draft-document-engine/documents/empty.xml')
	.toString()
const draftTemplate = xmlToDraftObject(draftTemplateXML, true)

// Get a Draft Document Tree
// mounted as /api/drafts/:draftId
router.get('/:draftId', (req, res, next) => {
	const draftId = req.params.draftId

	return DraftModel.fetchById(draftId)
		.then(draftTree => {
			draftTree.root.yell('internal:sendToClient', req, res)
			res.success(draftTree.document)
		})
		.catch(err => {
			logger.error(err)
			res.missing('Draft not found')
		})
})

// Create a Draft
// mounted as /api/drafts/new
router.post('/new', (req, res, next) => {
	const newDraft = null
	let user = null

	return req
		.requireCurrentUser()
		.then(currentUser => {
			user = currentUser
			if (!currentUser.canCreateDrafts) throw 'Insufficent permissions'
			return DraftModel.createWithContent(user.id, draftTemplate, draftTemplateXML)
		})
		.then(newDraft => {
			res.success(newDraft)
		})
		.catch(err => {
			res.unexpected(err)
		})
})

// Update a Draft
// mounted as /api/drafts/:draftid
router.post('/:draftId', (req, res, next) => {
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
			}

			// Scan through json for identical ids
			const duplicateId = DraftModel.findDuplicateIds(reqInput)
			if (duplicateId !== null) {
				logger.error('Posting draft failed - duplicate id "' + duplicateId + '"')
				res.badInput('Posting draft failed - duplicate id "' + duplicateId + '"')
				return
			}

			return DraftModel.updateContent(req.params.draftId, reqInput, xml || null).then(id => {
				res.success({ id })
			})
		})
		.catch(error => {
			logger.error(error)
			res.unexpected(error)
		})
})

// Delete a Draft
// mounted as /api/drafts/:draftId
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
		})
		.catch(err => {
			res.unexpected(err)
		})
})

// List drafts
// mounted as /api/drafts
router.get('/', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			if (!currentUser.canViewDrafts) throw 'Insufficient permissions'
			return db.any(
				`
			SELECT DISTINCT ON (draft_id)
				draft_id AS "draftId",
				id AS "latestVersion",
				created_at AS "createdAt",
				content->'content'->>'title' AS "title"
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
		})
		.catch(err => {
			logger.error(err)
			res.unexpected(err)
		})
})

module.exports = router
