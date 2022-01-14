const express = require('express')
const router = express.Router()
const Visit = oboRequire('server/models/visit')
const insertEvent = oboRequire('server/insert_event')
const oboEvents = require('../obo_events')
const ltiLaunch = oboRequire('server/express_lti_launch')
const { checkValidationRules, requireCurrentDocument, requireCurrentUser } = oboRequire(
	'server/express_validators'
)

// launch lti view of draft - redirects to visit route
// mounted as /view/:draftId/:page
router
	.route('/')
	.post([ltiLaunch.assignment, requireCurrentUser, requireCurrentDocument, checkValidationRules])
	.post((req, res, next) => {
		// Send instructors to a page listing the modules students will be split between
		if (!req.currentUser.hasPermission('canViewAsStudent')) {
			// Currently only two options are allowed, but maybe in the future we can allow more?
			const moduleOptionIds = [req.oboLti.body.draftA, req.oboLti.body.draftB]

			return oboEvents.emit('SPLIT_RUN_PREVIEW', { req, res, next, moduleOptionIds })
		}

		let createdVisitId
		// fire an event and allow nodes to alter node visit
		// Warning - I don't thinks async can work in any listeners
		oboEvents.emit(Visit.EVENT_BEFORE_NEW_VISIT, { req })

		const nodeVisitOptions = req.visitOptions ? req.visitOptions : {}

		return Visit.createVisit(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.oboLti.body.resource_link_id,
			req.oboLti.launchId,
			nodeVisitOptions
		)
			.then(({ visitId, deactivatedVisitId }) => {
				createdVisitId = visitId
				return insertEvent({
					action: 'visit:create',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {}, // we should probably put something in here indicating that this was an A/B testing launch, dunno what would be useful though
					draftId: req.currentDocument.draftId,
					contentId: req.currentDocument.contentId,
					isPreview: false,
					payload: {
						visitId,
						deactivatedVisitId
					},
					resourceLinkId: req.oboLti.body.resource_link_id,
					eventVersion: '1.1.0',
					visitId
				})
			})
			.then(req.saveSessionPromise)
			.then(() => {
				res.redirect(`/view/${req.currentDocument.draftId}/visit/${createdVisitId}`)
			})
			.catch(res.unexpected)
	})

module.exports = router
