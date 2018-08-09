const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
const VisitModel = oboRequire('models/visit')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('routes/api/events/caliper_utils')
const {
	checkValidationRules,
	requireDraftId,
	requireVisitId,
	requireCurrentUser,
	requireCurrentDocument,
	requireCurrentVisit
} = oboRequire('express_validators')

const getDraftAndStartVisitProps = (req, res, draftDocument, visit) => {
	const visitStartReturnExtensionsProps = {}

	return draftDocument
		.yell(
			'internal:startVisit',
			req,
			res,
			draftDocument.draftId,
			visit.id,
			visitStartReturnExtensionsProps
		)
		.then(() => {
			return visitStartReturnExtensionsProps
		})
}

// Start a new visit
// mounted as /api/visit/start
router
	.route('/start')
	.post([
		requireCurrentUser,
		requireCurrentVisit,
		requireCurrentDocument,
		requireVisitId,
		checkValidationRules
	])
	.post((req, res, next) => {
		let draft
		let viewState
		let visitStartReturnExtensionsProps
		let launch

		const draftId = req.currentDocument.draftId

		logger.log(
			`VISIT: Begin start visit for visitId="${req.currentVisit.id}", draftId="${draftId}"`
		)

		return Promise.all([
			viewerState.get(req.currentUser.id, draftId),
			getDraftAndStartVisitProps(req, res, req.currentDocument, req.currentVisit)
		])
			.then(results => {
				// expand results
				;[viewState, { draft, visitStartReturnExtensionsProps }] = results

				if (req.currentVisit.is_preview === false) {
					if (req.currentVisit.draft_content_id !== req.currentDocument.contentId) {
						// error so the student starts a new view w/ newer version
						// this check doesn't happen in preview mode so authors
						// can reload the page to see changes easier
						throw new Error('Visit for older draft version!')
					}
					// load lti launch data
					return ltiUtil.retrieveLtiLaunch(req.currentUser.id, draftId, 'START_VISIT_API')
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
					payload: { visitId: req.currentVisit.id },
					eventVersion: '1.0.0',
					caliperPayload: createViewerSessionLoggedInEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						draftId,
						contentId: req.currentDocument.contentId,
						isPreviewMode: req.currentUser.canViewEditor,
						sessionIds: getSessionIds(req.session)
					})
				})
			})
			.then(() => {
				logger.log(
					`VISIT: Start visit success for visitId="${
						req.currentVisit.id
					}", draftId="${draftId}", userId="${req.currentUser.id}"`
				)

				// Build lti data for return
				const lti = { lis_outcome_service_url: null }
				if (req.currentVisit.is_preview === false) {
					lti.lis_outcome_service_url = launch.reqVars.lis_outcome_service_url
				}

				res.success({
					visitId: req.currentVisit.id,
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
