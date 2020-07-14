const express = require('express')
const router = express.Router()
const logger = oboRequire('server/logger')
const ltiUtil = oboRequire('server/lti')
const viewerState = oboRequire('server/viewer/viewer_state')
const insertEvent = oboRequire('server/insert_event')
const createCaliperEvent = oboRequire('server/routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('server/routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('server/routes/api/events/caliper_utils')
const {
	checkValidationRules,
	requireVisitId,
	requireCurrentUser,
	requireCurrentDocument
} = oboRequire('server/express_validators')
const db = oboRequire('server/db')

const getDraftAndStartVisitProps = (req, res, draftDocument, visitId) => {
	const visitStartReturnExtensionsProps = {}
	return draftDocument
		.yell(
			'internal:startVisit',
			req,
			res,
			draftDocument.draftId,
			visitId,
			visitStartReturnExtensionsProps
		)
		.then(() => {
			return visitStartReturnExtensionsProps
		})
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
	.post([requireCurrentUser, requireCurrentDocument, requireVisitId, checkValidationRules])
	.post((req, res) => {
		let isRedAlertEnabled = false
		let viewState
		let visitStartReturnExtensionsProps
		let launch

		const userId = req.currentUser.id
		const draftId = req.currentDocument.draftId
		const visitId = req.body.visitId
		logger.log(`VISIT: Begin start visit for visitId="${visitId}", draftId="${draftId}"`)

		return req
			.getCurrentVisitFromRequest()
			.catch(() => {
				throw 'Unable to start visit, visitId is no longer valid'
			})
			.then(() =>
				db.oneOrNone(
					`
						SELECT is_enabled FROM red_alert_status
						WHERE
							user_id = $[userId]
							AND draft_id = $[draftId]
					`,
					{
						userId,
						draftId
					}
				)
			)
			.then(result => {
				if (result) isRedAlertEnabled = result.is_enabled
			})
			.then(() => {
				// error so the student starts a new view w/ newer version
				// this check doesn't happen in preview mode so authors
				// can reload the page to see changes easier
				if (
					!req.currentVisit.is_preview &&
					req.currentVisit.draft_content_id !== req.currentDocument.contentId
				) {
					throw new Error('Visit for older draft version!')
				}

				return Promise.all([
					viewerState.get(
						req.currentUser.id,
						req.currentDocument.contentId,
						req.currentVisit.resource_link_id
					),
					getDraftAndStartVisitProps(req, res, req.currentDocument, visitId)
				])
			})
			.then(results => {
				// expand results
				// eslint-disable-next-line no-extra-semi
				;[viewState, visitStartReturnExtensionsProps] = results

				if (req.currentVisit.is_preview === false) {
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
					`VISIT: Start visit success for visitId="${visitId}", draftId="${draftId}", userId="${req.currentUser.id}"`
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
					isRedAlertEnabled,
					visitId,
					isPreviewing: req.currentVisit.is_preview,
					lti,
					viewState,
					extensions: visitStartReturnExtensionsProps
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
