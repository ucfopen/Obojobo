const express = require('express')
const router = express.Router()
const Visit = oboRequire('server/models/visit')
const insertEvent = oboRequire('server/insert_event')
const createCaliperEvent = oboRequire('server/routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('server/routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('server/routes/api/events/caliper_utils')
const ltiLaunch = oboRequire('server/express_lti_launch')
const { assetForEnv, webpackAssetPath } = oboRequire('server/asset_resolver')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireVisitId,
	requireCurrentUser
} = oboRequire('server/express_validators')

// launch lti view of draft - redirects to visit route
// mounted as /view/:draftId/:page
router
	.route('/:draftId/:page?')
	.post([ltiLaunch.assignment, requireCurrentUser, requireCurrentDocument, checkValidationRules])
	.post((req, res) => {
		// Non students get redirected to preview mode
		// This will prevent LTI users with a role of Learner
		// from submitting scores back via LTI
		// which Canvas doesn't support
		if (!req.currentUser.canViewAsStudent) {
			res.redirect(`/preview/${req.params.draftId}`)
			return Promise.resolve()
		}

		let createdVisitId

		return Visit.createVisit(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.oboLti.body.resource_link_id,
			req.oboLti.launchId
		)
			.then(({ visitId, deactivatedVisitId }) => {
				createdVisitId = visitId
				const { createVisitCreateEvent } = createCaliperEvent(null, req.hostname)
				return insertEvent({
					action: 'visit:create',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {},
					draftId: req.currentDocument.draftId,
					contentId: req.currentDocument.contentId,
					isPreview: false,
					payload: {
						visitId,
						deactivatedVisitId
					},
					resourceLinkId: req.oboLti.body.resource_link_id,
					eventVersion: '1.0.0',
					caliperPayload: createVisitCreateEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						sessionIds: getSessionIds(req.session),
						visitId,
						extensions: { deactivatedVisitId }
					}),
					visitId
				})
			})
			.then(req.saveSessionPromise)
			.then(() => {
				res.redirect(`/view/${req.params.draftId}/visit/${createdVisitId}`)
			})
			.catch(res.unexpected)
	})

// MAIN VISIT ROUTE
// mounted as /view/:draftId/visit/:visitId
router
	.route('/:draftId/visit/:visitId*')
	.get([requireCurrentUser, requireCurrentDocument, requireVisitId, checkValidationRules])
	.get((req, res) => {
		let currentVisit
		return Visit.fetchById(req.params.visitId, false)
			.then(visit => {
				currentVisit = visit
				return req.currentDocument.yell('internal:sendToClient', req, res)
			})
			.then(() => {
				const { createViewerOpenEvent } = createCaliperEvent(null, req.hostname)
				return insertEvent({
					action: 'viewer:open',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {},
					draftId: req.currentDocument.draftId,
					contentId: req.currentDocument.contentId,
					visitId: req.params.visitId,
					payload: { visitId: req.params.visitId },
					eventVersion: '1.1.0',
					isPreview: currentVisit.is_preview,
					caliperPayload: createViewerOpenEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						sessionIds: getSessionIds(req.session),
						visitId: req.params.visitId
					})
				})
			})
			.then(() => {
				const draft = req.currentDocument
				res.render('viewer', {
					assetForEnv,
					webpackAssetPath,
					draftTitle:
						draft &&
						draft.root &&
						draft.root.node &&
						draft.root.node.content &&
						draft.root.node.content.title
							? draft.root.node.content.title
							: ''
				})
			})
			.catch(res.unexpected)
	})

module.exports = router
