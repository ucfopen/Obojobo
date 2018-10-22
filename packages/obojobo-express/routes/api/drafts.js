const express = require('express')
const fs = require('fs')
const router = express.Router()
const DraftModel = oboRequire('models/draft')
const logger = oboRequire('logger')
const db = oboRequire('db')
const xmlToDraftObject = require('obojobo-document-xml-parser/xml-to-draft-object')
const {
	checkValidationRules,
	requireDraftId,
	requireCanCreateDrafts,
	requireCanDeleteDrafts,
	requireCanViewDrafts
} = oboRequire('express_validators')

const draftTemplateXML = fs
	.readFileSync('../../node_modules/obojobo-document-engine/documents/empty.xml')
	.toString()

const tutorialDraft = require('../../../obojobo-document-engine/src/scripts/oboeditor/documents/oboeditor-tutorial.json')

const draftTemplate = xmlToDraftObject(draftTemplateXML, true)

// Get a Draft Document Tree
// mounted as /api/drafts/:draftId
router
	.route('/:draftId')
	.get([requireDraftId, checkValidationRules])
	.get((req, res) => {
		const draftId = req.params.draftId

		return DraftModel.fetchById(draftId)
			.then(draftTree => {
				draftTree.root.yell('internal:sendToClient', req, res)
				res.success(draftTree.document)
			})
			.catch(error => {
				const QueryResultError = db.errors.QueryResultError
				const qrec = db.errors.queryResultErrorCode
				if (error instanceof QueryResultError && error.code === qrec.noData) {
					return res.missing('Draft not found')
				}
				res.unexpected(error)
			})
	})

// Create a Draft
// mounted as /api/drafts/new
router
	.route('/new')
	.post(requireCanCreateDrafts)
	.post((req, res) => {
		return DraftModel.createWithContent(req.currentUser.id, draftTemplate, draftTemplateXML)
			.then(newDraft => {
				res.success(newDraft)
			})
			.catch(res.unexpected)
	})
// Create an editable tutorial document
// mounted as /api/drafts/tutorial
router
	.route('/tutorial')
	.post(requireCanCreateDrafts)
	.post((req, res) => {
		return DraftModel.createWithContent(req.currentUser.id, tutorialDraft)
			.then(newDraft => {
				res.success(newDraft)
			})
			.catch(res.unexpected)
	})

// Update a Draft
// mounted as /api/drafts/:draftid
router
	.route('/:draftId')
	.post([requireCanCreateDrafts, requireDraftId, checkValidationRules])
	.post((req, res) => {
		return Promise.resolve()
			.then(() => {
				let xml
				let documentInput

				if (typeof req.body === 'string') {
					// req.body expected to be xml document
					try {
						xml = req.body
						const convertedXml = xmlToDraftObject(req.body, true)
						if (convertedXml && typeof convertedXml === 'object') {
							documentInput = convertedXml
						} else {
							logger.error('Parse XML non-error?', convertedXml)
						}
					} catch (e) {
						logger.error('Parse XML Failed:', e, req.body)
					}
				} else {
					// req.body expected to by json document
					documentInput = req.body
				}

				if (!documentInput || typeof documentInput !== 'object') {
					logger.error('Posting draft failed - format unexpected:', req.body)
					res.badInput('Posting draft failed - format unexpected')
					return
				}

				// Scan through json for identical ids
				const duplicateId = DraftModel.findDuplicateIds(documentInput)

				if (duplicateId !== null) {
					logger.error('Posting draft failed - duplicate id "' + duplicateId + '"')
					res.badInput('Posting draft failed - duplicate id "' + duplicateId + '"')
					return
				}

				return DraftModel.updateContent(req.params.draftId, documentInput, xml || null).then(id => {
					res.success({ id })
				})
			})
			.catch(res.unexpected)
	})

// Delete a Draft
// mounted as /api/drafts/:draftId
router
	.route('/:draftId')
	.delete([requireCanDeleteDrafts, requireDraftId, checkValidationRules])
	.delete((req, res) => {
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
			.then(res.success)
			.catch(res.unexpected)
	})

// List drafts
// mounted as /api/drafts
router
	.route('/')
	.get(requireCanViewDrafts)
	.get((req, res) => {
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
				{ userId: req.currentUser.id }
			)
			.then(res.success)
			.catch(res.unexpected)
	})

module.exports = router
