const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const logger = oboRequire('logger')
const VisitModel = oboRequire('models/visit')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')

const getDraftAndStartVisitProps = (req, res, draftDocument) => {
	let visitStartReturnExtensionsProps = {}

	draftDocument.yell(
		'internal:startVisit',
		req,
		res,
		draftDocument.draftId,
		req.body.visitId,
		visitStartReturnExtensionsProps
	)
	return visitStartReturnExtensionsProps
}

const getViewerState = (userId, contentId) => viewerState.get(userId, contentId)

// Start a new visit
// mounted as /api/visit/start
router.post('/start', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
	let visit
	let viewState
	let visitStartReturnExtensionsProps

	let visitId = req.body.visitId
	let draftId = req.body.draftId

	logger.log(`VISIT: Begin start visit for visitId="${visitId}", draftId="${draftId}"`)

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			// validate input
			if (visitId == null || draftId == null) throw new Error('Missing visit and/or draft id!')

			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument

			return Promise.all([
				VisitModel.fetchById(visitId),
				getViewerState(currentUser.id, currentDocument.contentId),
				getDraftAndStartVisitProps(req, res, currentDocument)
			])
		})
		.then(results => {
			// expand results
			;[visit, viewState, visitStartReturnExtensionsProps] = results

			if (visit.is_preview === false) {
				if (visit.draft_content_id !== currentDocument.root.node._rev) {
					// error so the student starts a new view w/ newer version
					// this check doesn't happen in preview mode so authors
					// can reload the page to see changes easier
					throw new Error('Visit for older draft version!')
				}
				// load lti launch data
				return ltiUtil.retrieveLtiLaunch(currentUser.id, draftId, 'START_VISIT_API')
			}
		})
		.then(launch => {
			logger.log(
				`VISIT: Start visit success for visitId="${visitId}", draftId="${draftId}", userId="${
					currentUser.id
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
				isPreviewing: currentUser.canViewEditor ? currentUser.canViewEditor : false,
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
