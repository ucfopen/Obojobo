const express = require('express')
const fs = require('fs')
const router = express.Router()
const DraftModel = oboRequire('models/draft')
const logger = oboRequire('logger')
const db = oboRequire('db')
const xmlToDraftObject = require('obojobo-draft-xml-parser/xml-to-draft-object')
const {
	checkValidation,
	requireDraftId,
	requireCanCreateDrafts,
	requireCanDeleteDrafts,
	requireCanViewDrafts
} = oboRequire('express_validators')
const insertNewDraft = require('./drafts/insert_new_draft')
const updateDraft = require('./drafts/update_draft')
const getDuplicateId = require('./drafts/get_duplicate_obo_node_id')
const draftTemplateXML = fs
	.readFileSync('./node_modules/obojobo-draft-document-engine/documents/empty.xml')
	.toString()
const draftTemplate = xmlToDraftObject(draftTemplateXML, true)

// Get a Draft Document Tree
// mounted as /api/drafts/:draftId
router
	.route('/:draftId')
	.get([requireDraftId, checkValidation])
	.get((req, res, next) => {
		let draftId = req.params.draftId

		return DraftModel.fetchById(draftId)
			.then(draftTree => {
				draftTree.root.yell('internal:sendToClient', req, res)
				res.success(draftTree.document)
			})
			.catch(err => {
				logger.error(err)
				//@TODO call next with error
				res.missing('Draft not found')
			})
	})

// Create a Draft
// mounted as /api/drafts/new
router
	.route('/new')
	.post(requireCanCreateDrafts)
	.post((req, res, next) => {
		let newDraft = null

		return DraftModel.createWithContent(req.currentUser.id, draftTemplate, draftTemplateXML)
			.then(newDraft => {
				res.success(newDraft)
			})
			.catch(err => {
				//@TODO have this call next with error
				res.unexpected(err)
			})
	})

//@TODO - Ensure that you can't post to a deleted draft, ensure you can only delete your own stuff
// Update a Draft
// mounted as /api/drafts/:draftid
router
	.route('/:draftId')
	.post([requireDraftId, checkValidation, requireCanCreateDrafts])
	.post((req, res, next) => {
		return Promise.resolve()
			.then(() => {
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
				let duplicateId = DraftModel.findDuplicateIds(reqInput)
				if (duplicateId !== null) {
					logger.error('Posting draft failed - duplicate id "' + duplicateId + '"')
					res.badInput('Posting draft failed - duplicate id "' + duplicateId + '"')
					return
				}

				return DraftModel
					.updateContent(req.params[0], reqInput, xml || null)
					.then(id => {
						res.success({ id })
					})
			})
			.catch(error => {
				logger.error(error)
				//@TODO call next with error
				res.unexpected(error)
			})
	})

// Delete a Draft
// mounted as /api/drafts/:draftId
router
	.route('/:draftId')
	.delete([requireDraftId, checkValidation, requireCanDeleteDrafts])
	.delete((req, res, next) => {
		return db
			.none(
				`
			UPDATE drafts
			SET deleted = TRUE
			WHERE id = $[draftId]
			AND user_id = $[userId]
			`,
				{
					draftId: req.params.draftId,
					userId: req.currentUser.id
				}
			)
			.then(id => {
				res.success(id)
			})
			.catch(err => {
				//@TODO call next with error
				res.unexpected(err)
			})
	})

// List drafts
// mounted as /api/drafts
router
	.route('/')
	.get(requireCanViewDrafts)
	.get((req, res, next) => {
		return db
			.any(
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
			.then(result => {
				res.success(result)
			})
			.catch(err => {
				logger.error(err)
				//@TODO call next with error
				res.unexpected(err)
			})
	})

module.exports = router
