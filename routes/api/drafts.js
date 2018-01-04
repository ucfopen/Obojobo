const express = require('express')
const fs = require('fs')
const router = express.Router()
const DraftModel = oboRequire('models/draft')
const logger = oboRequire('logger')
const db = oboRequire('db')
const xmlToDraftObject = require('obojobo-draft-xml-parser/xml-to-draft-object')

const insertNewDraft = require('./drafts/insert_new_draft')
const updateDraft = require('./drafts/update_draft')

const draftTemplateXML = fs
	.readFileSync('./node_modules/obojobo-draft-document-engine/documents/empty.xml')
	.toString()
const draftTemplate = xmlToDraftObject(draftTemplateXML, true)

let oboEvents = oboRequire('obo_events')

router.get('/:draftId', (req, res, next) => {
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
			return insertNewDraft(user.id, draftTemplate, draftTemplateXML)
		})
		.then(newDraft => {
			res.success(newDraft)
		})
		.catch(err => {
			//@TODO have this call next with error
			res.unexpected(err)
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
			}

			return updateDraft(req.params[0], reqInput, xml || null).then(id => {
				res.success({ id })
			})
		})
		.catch(error => {
			logger.error(error)
			//@TODO call next with error
			res.unexpected(error)
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
		})
		.catch(err => {
			//@TODO call next with error
			res.unexpected(err)
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
		})
		.catch(err => {
			logger.error(err)
			//@TODO call next with error
			res.unexpected(err)
		})
})

oboEvents.on('client:nav:redAlert', (event, req) => {
	db.none(
		`
		INSERT INTO red_alert_status
		(user_id, draft_id, created_at, alert_enabled)
		VALUES($[userId], $[draftId], $[createdAt], $[alertEnabled])
		ON CONFLICT (user_id, draft_id) DO
			UPDATE
			SET
				alert_enabled = $[alertEnabled],
				created_at = $[createdAt]
			WHERE red_alert_status.user_id = $[userId]
				AND red_alert_status.draft_id = $[draftId]`,
		{
			userId: event.userId,
			draftId: event.draftId,
			createdAt: event.createdAt,
			alertEnabled: event.payload.alertStatus
		}
	)
})

module.exports = router
