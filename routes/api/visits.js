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

const getDraftAndStartVisitProps = (req, res, draftDocument) => {
	const visitStartReturnExtensionsProps = {}

	return draftDocument
		.yell(
			'internal:startVisit',
			req,
			res,
			draftDocument.draftId,
			req.body.visitId,
			visitStartReturnExtensionsProps
		)
		.then(() => {
			return visitStartReturnExtensionsProps
		})
}

// Start a new visit
// mounted as /api/visit/start
router.post('/start', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
	let visit
	let viewState
	let visitStartReturnExtensionsProps
	let launch

	const visitId = req.body.visitId

	logger.log(`VISIT: Begin start visit for visitId="${visitId}"`)

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			// validate input
			if (visitId == null) throw new Error('Missing visit id!')

			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument

			return Promise.all([
				VisitModel.fetchById(visitId),
				viewerState.get(currentUser.id, currentDocument.contentId),
				getDraftAndStartVisitProps(req, res, currentDocument)
			])
		})
		.then(results => {
			// expand results
			;[visit, viewState, visitStartReturnExtensionsProps] = results

			if (visit.is_preview === false) {
				if (visit.draft_content_id !== currentDocument.contentId) {
					// error so the student starts a new view w/ newer version
					// this check doesn't happen in preview mode so authors
					// can reload the page to see changes easier
					throw new Error('Visit for older draft version!')
				}
				// load lti launch data
				return ltiUtil.retrieveLtiLaunch(currentUser.id, currentDocument.draftId, 'START_VISIT_API')
			}
		})
		.then(launchResult => {
			launch = launchResult
			const { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)

			return insertEvent({
				action: 'visit:start',
				actorTime: new Date().toISOString(),
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: currentDocument.draftId,
				isPreview: visit.is_preview,
				contentId: currentDocument.contentId,
				payload: { visitId },
				eventVersion: '1.0.0',
				caliperPayload: createViewerSessionLoggedInEvent({
					actor: { type: ACTOR_USER, id: currentUser.id },
					draftId: currentDocument.draftId,
					contentId: currentDocument.contentId,
					sessionIds: getSessionIds(req.session)
				})
			})
		})
		.then(() => {
			logger.log(`VISIT: Start visit success for visitId="${visitId}", userId="${currentUser.id}"`)

			// Build lti data for return
			const lti = { lis_outcome_service_url: null }
			if (visit.is_preview === false) {
				lti.lis_outcome_service_url = launch.reqVars.lis_outcome_service_url
			}

			res.success({
				visitId,
				isPreviewing: visit.is_preview,
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
