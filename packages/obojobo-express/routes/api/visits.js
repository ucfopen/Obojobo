const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const logger = oboRequire('logger')
const DraftModel = oboRequire('models/draft')
const VisitModel = oboRequire('models/visit')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('routes/api/events/caliper_utils')

const getDraftAndStartVisitProps = (req, res) => {
	let draft
	let visitStartReturnExtensionsProps = {}

	return DraftModel.fetchById(req.body.draftId)
		.then(draftResult => {
			draft = draftResult

			return draft.yell(
				'internal:startVisit',
				req,
				res,
				req.body.draftId,
				req.body.visitId,
				visitStartReturnExtensionsProps
			)
		})
		.then(() => ({
			draft,
			visitStartReturnExtensionsProps
		}))
}

const getViewerState = (userId, draftId) => viewerState.get(userId, draftId)

// Start a new visit
// mounted as /api/visit/start
router.post('/start', (req, res, next) => {
	let user
	let visit
	let draft
	let viewState
	let visitStartReturnExtensionsProps
	let launch

	let visitId = req.body.visitId
	let draftId = req.body.draftId

	logger.log(`VISIT: Begin start visit for visitId="${visitId}", draftId="${draftId}"`)

	return req
		.requireCurrentUser()
		.then(userFromReq => {
			user = userFromReq

			// validate input
			if (visitId == null || draftId == null) throw new Error('Missing visit and/or draft id!')

			return Promise.all([
				VisitModel.fetchById(visitId),
				getViewerState(user.id, draftId),
				getDraftAndStartVisitProps(req, res)
			])
		})
		.then(results => {
			// expand results
			;[visit, viewState, { draft, visitStartReturnExtensionsProps }] = results

			if (visit.is_preview === false) {
				if (visit.draft_content_id !== draft.root.node._rev) {
					// error so the student starts a new view w/ newer version
					// this check doesn't happen in preview mode so authors
					// can reload the page to see changes easier
					throw new Error('Visit for older draft version!')
				}
				// load lti launch data
				return ltiUtil.retrieveLtiLaunch(user.id, draftId, 'START_VISIT_API')
			}
		})
		.then(launchResult => {
			launch = launchResult
			let { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)

			return insertEvent({
				action: 'visit:start',
				actorTime: new Date().toISOString(),
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId,
				payload: { visitId },
				eventVersion: '1.0.0',
				caliperPayload: createViewerSessionLoggedInEvent({
					actor: { type: ACTOR_USER, id: user.id },
					draftId,
					isPreviewMode: user.canViewEditor,
					sessionIds: getSessionIds(req.session)
				})
			})
		})
		.then(() => {
			logger.log(
				`VISIT: Start visit success for visitId="${visitId}", draftId="${draftId}", userId="${
					user.id
				}"`
			)

			// Build lti data for return
			let lti = { lis_outcome_service_url: null }
			if (visit.is_preview === false) {
				lti.lis_outcome_service_url = launch.reqVars.lis_outcome_service_url
			}

			res.success({
				visitId,
				//@TODO: This should be if visit.preview === true but we can't do that until the
				// rest of the code uses visit.preview instead of user.canViewEditor
				isPreviewing: user.canViewEditor ? user.canViewEditor : false,
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
