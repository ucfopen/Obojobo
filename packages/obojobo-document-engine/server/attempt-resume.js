const attemptStart = require('./attempt-start')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const insertEvent = oboRequire('insert_event')
const VisitModel = oboRequire('models/visit')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = async (req, res) => {
	try {
		const attempt = req.body.attempt

		const currentUser = await req.requireCurrentUser()

		const visit = await VisitModel.fetchById(req.body.visitId)

		const isPreview = visit.is_preview

		const draftDocument = await req.requireCurrentDocument()

		const assessmentNode = draftDocument.getChildNodeById(attempt.assessmentId)

		await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))

		attempt.questions = []

		for (const node of attempt.state.chosen) {
			if (node.type === QUESTION_NODE_TYPE) {
				attempt.questions.push(assessmentNode.draftTree.getChildNodeById(node.id).toObject())
			}
		}

		await insertAttemptResumeEvents(
			currentUser,
			draftDocument,
			attempt.assessmentId,
			attempt.id,
			attempt.number,
			isPreview,
			req.hostname,
			req.connection.remoteAddress
		)

		res.success(attempt)
	} catch (ex) {
		console.log(ex)
	}
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
