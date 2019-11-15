const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('routes/api/events/caliper_utils')
const {
	checkValidationRules,
	requireVisitId,
	requireCurrentUser,
	requireCurrentDocument,
	requireCurrentVisit
} = oboRequire('express_validators')

const getDraftAndStartVisitProps = (req, res, draftDocument, visitId) => {
	// trigger startVisit
	// allows listeners to add objects the extensions array
	const visitStartExtensions = []
	return draftDocument
		.yell(
			'internal:startVisit',
			req,
			res,
			draftDocument.draftId,
			visitId,
			visitStartExtensions
		)
		.then(() => visitStartExtensions)
}

router
	.route('/:draftId/status')
	.get([requireCurrentUser])
	.get((req, res) => {
		if (req.session.visitSessions && req.session.visitSessions[req.params.draftId]) {
			res.success(true)
			return
		}

		res.missing(false)
	})

// Start a new visit
// mounted as /api/visits/start
router
	.route('/start')
	.post([requireCurrentUser, requireCurrentDocument, requireCurrentVisit, checkValidationRules])
	.post((req, res) => {
		let viewState
		let visitStartExtensions
		let launch

		const draftId = req.currentDocument.draftId
		const visitId = req.body.visitId
		logger.log(`VISIT: Begin start visit for visitId="${visitId}", draftContentId="${req.currentDocument.contentId}"`)

		return Promise.all([
				viewerState.get(
					req.currentUser.id,
					req.currentDocument.contentId,
					req.currentVisit.resource_link_id
				),
				getDraftAndStartVisitProps(req, res, req.currentDocument, visitId)
			])
			.then(results => {
				// expand results
				// eslint-disable-next-line no-extra-semi
				;[viewState, visitStartExtensions] = results

				if (req.currentVisit.is_preview === false) {
					if (req.currentVisit.draft_content_id !== req.currentDocument.contentId) {
						// error so the student starts a new view w/ newer version
						// this check doesn't happen in preview mode so authors
						// can reload the page to see changes easier
						throw new Error('Visit for older draft version!')
					}
					// load lti launch data
					return ltiUtil.retrieveLtiLaunch(
						req.currentUser.id,
						draftId,
						'START_VISIT_API',
						req.currentVisit.resource_link_id
					)
				}
			})
			.then(launchResult => {
				launch = launchResult
				const { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)
				return insertEvent({
					action: 'visit:start',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {},
					draftId,
					isPreview: req.currentVisit.is_preview,
					contentId: req.currentDocument.contentId,
					payload: { visitId },
					eventVersion: '1.0.0',
					visitId,
					caliperPayload: createViewerSessionLoggedInEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						draftId,
						contentId: req.currentDocument.contentId,
						sessionIds: getSessionIds(req.session)
					})
				})
			})
			.then(() => {
				logger.log(
					`VISIT: Start visit success for visitId="${visitId}", draftId="${draftId}", userId="${
						req.currentUser.id
					}"`
				)

				// Build lti data for return
				const lti = { lis_outcome_service_url: null }
				if (req.currentVisit.is_preview === false) {
					lti.lis_outcome_service_url = launch.reqVars.lis_outcome_service_url
				}

				// register a visitSessionId in the user's server side session
				if (!req.session.visitSessions) req.session.visitSessions = {}
				req.session.visitSessions[draftId] = true

				res.success({
					visitId,
					isPreviewing: req.currentVisit.is_preview,
					lti,
					viewState,
					extensions: visitStartExtensions
				})
			})
			.catch(err => {
				logger.error(err)
				if (err instanceof Error) {
					err = err.message
				}
				res.reject(err)
			})
	})

module.exports = router
