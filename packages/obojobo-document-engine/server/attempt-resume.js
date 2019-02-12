const attemptStart = require('./attempt-start')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const insertEvent = oboRequire('insert_event')
const VisitModel = oboRequire('models/visit')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = (req, res) => {
	const attempt = req.body.attempt
	let draftDocument = null
	let currentUser = null
	let assessmentNode
	let isPreview

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			isPreview = visit.is_preview
			return req.requireCurrentDocument()
		})
		.then(currentDocument => {
			draftDocument = currentDocument
			assessmentNode = currentDocument.getChildNodeById(attempt.assessmentId)

			return Promise.all(
				attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res)
			)
		})
		.then(() => {
			attempt.questions = []
			for (const node of attempt.state.chosen) {
				if (node.type === QUESTION_NODE_TYPE) {
					attempt.questions.push(assessmentNode.draftTree.getChildNodeById(node.id).toObject())
				}
			}
		})
		.then(() => {
			return insertAttemptResumeEvents(
				currentUser,
				draftDocument,
				attempt.assessmentId,
				attempt.id,
				attempt.number,
				isPreview,
				req.hostname,
				req.connection.remoteAddress
			)
		})
		.then(() => res.success(attempt))
}

const insertAttemptResumeEvents = (
	user,
	draftDocument,
	assessmentId,
	attemptId,
	attemptNumber,
	isPreview,
	hostname,
	remoteAddress
) => {
	const { createAssessmentAttemptResumedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptResume',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attemptId,
			attemptCount: attemptNumber
		},
		userId: user.id,
		ip: remoteAddress,
		metadata: {},
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId,
		eventVersion: '1.1.0',
		isPreview: isPreview,
		caliperPayload: createAssessmentAttemptResumedEvent({
			actor: { type: 'user', id: user.id },
			draftId: draftDocument.draftId,
			contentId: draftDocument.contentId,
			assessmentId,
			attemptId: attemptId
		})
	})
}

module.exports = {
	resumeAttempt
}
