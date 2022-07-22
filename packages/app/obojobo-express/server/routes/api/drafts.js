const express = require('express')
const fs = require('fs')
const router = express.Router()
const DraftModel = oboRequire('server/models/draft')
const logger = oboRequire('server/logger')
const pgp = require('pg-promise')
const xmlToDraftObject = require('obojobo-document-xml-parser/xml-to-draft-object')
const emptyXmlPath = require.resolve('obojobo-document-engine/documents/empty.xml')
const draftTemplateXML = fs.readFileSync(emptyXmlPath).toString()
const tutorialDraft = require('obojobo-document-engine/src/scripts/oboeditor/documents/oboeditor-tutorial.json')
const draftTemplate = xmlToDraftObject(draftTemplateXML, true)
const DraftPermissions = require('obojobo-repository/server/models/draft_permissions')
const {
	checkValidationRules,
	requireDraftId,
	requireCanViewEditor,
	requireCanCreateDrafts,
	requireCanDeleteDrafts,
	checkContentId
} = oboRequire('server/express_validators')
const Media = oboRequire('server/models/media')
const mime = require('mime')

const isNoDataFromQueryError = e => {
	return (
		e instanceof pgp.errors.QueryResultError && e.code === pgp.errors.queryResultErrorCode.noData
	)
}

// Get a complete Draft Document Tree (for editing)
// optional query variable: contentId=<draftContentId>
// mounted as /api/drafts/:draftId/full
router
	.route('/:draftId/full')
	.get([requireDraftId, requireCanViewEditor, checkContentId, checkValidationRules])
	.get(async (req, res) => {
		try {
			// @TODO: checking permissions should probably be more dynamic, not hard-coded to the repository
			const hasPerms = await DraftPermissions.userHasPermissionToDraft(
				req.currentUser.id,
				req.params.draftId
			)

			if (!hasPerms) {
				return res.notAuthorized(
					'You must be the author of this draft to retrieve this information'
				)
			}

			let draftModel
			if (req.query.contentId) {
				// a specific verion is requested
				draftModel = await DraftModel.fetchDraftByVersion(req.params.draftId, req.query.contentId)
			} else {
				// get the current version
				draftModel = await DraftModel.fetchById(req.params.draftId)
			}
			const draftDocument = draftModel.document
			res.format({
				'application/xml': async () => {
					let xml = await draftModel.xmlDocument
					if (!xml) {
						const jsonToXml = require('obojobo-document-json-parser/json-to-xml-parser')
						xml = jsonToXml(draftDocument)
					}
					res.set('Obo-DraftContentId', draftDocument.contentId)
					res.send(xml)
				},
				default: () => {
					res.set('Obo-DraftContentId', draftDocument.contentId)
					res.success(draftDocument)
				}
			})
		} catch (e) {
			if (isNoDataFromQueryError(e)) {
				return res.missing('Draft not found')
			}

			res.unexpected(e)
		}
	})

// Get a Draft Document Tree (for viewing by a student)
// mounted as /api/drafts/:draftId
router
	.route('/:draftId')
	.get([requireDraftId, checkValidationRules])
	.get(async (req, res) => {
		try {
			const draftModel = await DraftModel.fetchById(req.params.draftId)

			// Dispatch the "internal:sendToClient" event - this allows any installed OboNode to
			// alter the data before the document is returned (for example, to remove assessment
			// questions)
			draftModel.root.yell('internal:sendToClient', req, res)

			return res.success(draftModel.document)
		} catch (e) {
			if (isNoDataFromQueryError(e)) {
				return res.missing('Draft not found')
			}

			res.unexpected(e)
		}
	})

async function traverse(o, func) {
	for (let i in o) {
		await func.apply(this, [i, o[i], o])
		if (o[i] !== null && typeof o[i] === 'object') {
			//going one step down in the object tree!!
			await traverse(o[i], func)
		}
	}
}

const extractAndUploadEmbeddedImages = async (draftJson, userId) => {
	await traverse(draftJson, async (key, val, obj) => {
		if (
			key === 'type' &&
			val === 'ObojoboDraft.Chunks.Figure' &&
			typeof obj?.content?.imageBinary === 'string'
		) {
			// use the filename to determine the mimetype
			const mimetype = mime.getType(obj.content.filename)
			// load the base64 data into a buffer
			const buf = Buffer.from(obj.content.imageBinary, 'base64')

			// mock the fileInfo needed by Media
			const mockFileInfo = {
				originalname: obj.content.filename,
				mimetype,
				size: buf.length,
				buffer: buf
			}

			// save the media asset to the db
			const mediaRecord = await Media.createAndSave(userId, mockFileInfo)

			// update the json
			obj.content.url = mediaRecord.media_id
			delete obj.content.imageBinary
		}
	})
	return draftJson
}

// Create a Draft
// mounted as /api/drafts/new
router
	.route('/new')
	.post(requireCanCreateDrafts)
	.post(async (req, res, next) => {
		const content = req.body.content
		const format = req.body.format

		let draftJson = !format ? draftTemplate : null
		let draftXml = !format ? draftTemplateXML : null

		if (format === 'application/json') {
			try {
				const jsonContent = typeof content === 'string' ? JSON.parse(content) : content
				draftJson = await extractAndUploadEmbeddedImages(jsonContent, req.currentUser.id)
			} catch (e){
				logger.error('Parse JSON Failed:', e, content)
				return res.unexpected(e)
			}
		} else if (format === 'application/xml') {
			draftXml = content
			try {
				const convertedXml = xmlToDraftObject(draftXml, true)
				if (convertedXml) {
					draftJson = convertedXml
				} else {
					logger.error('Parse XML non-error?', convertedXml)
					return res.unexpected()
				}
			} catch (e) {
				logger.error('Parse XML Failed:', e, content)
				return res.unexpected(e)
			}
		}

		try {
			const draft = await DraftModel.createWithContent(req.currentUser.id, draftJson, draftXml)
			res.set('Obo-DraftContentId', draft.content.id)
			res.success({ id: draft.id, contentId: draft.content.id })
		} catch (error) {
			res.unexpected(error)
		}
	})
// Create an editable tutorial document
// mounted as /api/drafts/tutorial
router
	.route('/tutorial')
	.post(requireCanCreateDrafts)
	.post((req, res) => {
		return DraftModel.createWithContent(req.currentUser.id, tutorialDraft)
			.then(draft => {
				res.set('Obo-DraftContentId', draft.content.id)
				res.success({ id: draft.id, contentId: draft.content.id })
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
					const msg = 'Posting draft failed - format unexpected'
					logger.error(msg, req.body)
					res.badInput(msg)
					return
				}

				// Scan through json for identical ids
				const duplicateId = DraftModel.findDuplicateIds(documentInput)

				if (duplicateId !== null) {
					const msg = `Posting draft failed - duplicate id "${duplicateId}"`
					logger.error(msg)
					res.badInput(msg)
					return
				}

				return DraftModel.updateContent(
					req.params.draftId,
					req.currentUser.id,
					documentInput,
					xml || null
				).then(id => {
					res.set('Obo-DraftContentId', id)
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
		return DraftModel.deleteByIdAndUser(req.params.draftId, req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

// Restore a Draft
// mounted as /api/drafts/restore/:draftId
router
	.route('/restore/:draftId')
	.put([requireCanDeleteDrafts, requireDraftId, checkValidationRules])
	.put((req, res) => {
		return DraftModel.restoreByIdAndUser(req.params.draftId, req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

module.exports = router
