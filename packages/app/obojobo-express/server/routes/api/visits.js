const express = require('express')
const router = express.Router()
const logger = oboRequire('server/logger')
const ltiUtil = oboRequire('server/lti')
const viewerState = oboRequire('server/viewer/viewer_state')
const insertEvent = oboRequire('server/insert_event')
const {
	checkValidationRules,
	requireCurrentUser,
	requireCurrentDocument,
	requireCurrentVisit
} = oboRequire('server/express_validators')

const getDraftAndStartVisitProps = (req, res) => {
	// trigger startVisit
	// allows listeners to add objects the extensions array
	const visitStartExtensions = []
	return req.currentDocument
		.yell('internal:startVisit', req, res, visitStartExtensions)
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
		logger.log(
			`VISIT: Begin start visit for visitId="${req.currentVisit.id}", draftContentId="${req.currentDocument.contentId}"`
		)

		let viewState
		let visitStartExtensions
		let launch

		return Promise.all([
			viewerState.get(
				req.currentUser.id,
				req.currentDocument.contentId,
				req.currentVisit.resource_link_id
			),
			getDraftAndStartVisitProps(req, res)
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
						req.currentDocument.draftId,
						'START_VISIT_API',
						req.currentVisit.resource_link_id
					)
				}
			})
			.then(launchResult => {
				launch = launchResult
				return insertEvent({
					action: 'visit:start',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {},
					draftId: req.currentDocument.draftId,
					isPreview: req.currentVisit.is_preview,
					contentId: req.currentDocument.contentId,
					payload: { visitId: req.currentVisit.id },
					eventVersion: '1.0.0',
					visitId: req.currentVisit.id
				})
			})
			.then(() => {
				logger.log(
					`VISIT: Start visit success for visitId="${req.currentVisit.id}", draftId="${req.currentDocument.draftId}", userId="${req.currentUser.id}"`
				)

				// Build lti data for return
				const lti = { lis_outcome_service_url: null }
				if (req.currentVisit.is_preview === false) {
					lti.lis_outcome_service_url = launch.reqVars.lis_outcome_service_url
				}

				// register a visitSessionId in the user's server side session
				if (!req.session.visitSessions) req.session.visitSessions = {}
				req.session.visitSessions[req.currentDocument.draftId] = true

				res.success({
					visitId: req.currentVisit.id,
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
