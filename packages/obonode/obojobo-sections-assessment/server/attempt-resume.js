const AssessmentModel = require('./models/assessment')
const attemptStart = require('./attempt-start')
const createCaliperEvent = require('obojobo-express/server/routes/api/events/create_caliper_event')
const insertEvent = require('obojobo-express/server/insert_event')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = async (
	currentUser,
	currentVisit,
	currentDocument,
	attemptId,
	hostname,
	remoteAddress
) => {
	// @TODO: these used to be req and res objects from express
	// are they needed for OboModel.yell() ?!?!
	// see: attemptStart.getSendToClientPromises
	const req = {} // @TODO see if we can get rid of these
	const res = {} // @TODO see if we can get rid of these
	const attempt = await AssessmentModel.fetchAttemptByID(attemptId)
	const assessmentNode = currentDocument.getChildNodeById(attempt.assessmentId)

	await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))

	attempt.questions = []

	for (const node of attempt.state.chosen) {
		if (node.type === QUESTION_NODE_TYPE) {
			const questionNode = assessmentNode.draftTree.getChildNodeById(node.id)
			attempt.questions.push(questionNode.toObject())
		}
	}

	const { createAssessmentAttemptResumedEvent } = createCaliperEvent(null, hostname)
	await insertEvent({
		action: 'assessment:attemptResume',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attempt.id,
			attemptCount: attempt.number
		},
		userId: currentUser.id,
		ip: remoteAddress,
		metadata: {},
		draftId: currentDocument.draftId,
		contentId: currentDocument.contentId,
		eventVersion: '1.1.0',
		isPreview: currentVisit.is_preview,
		caliperPayload: createAssessmentAttemptResumedEvent({
			actor: { type: 'user', id: currentUser.id },
			draftId: currentDocument.draftId,
			contentId: currentDocument.contentId,
			assessmentId: attempt.assessmentId,
			attemptId: attempt.id
		})
	})

	// update response
	// @TODO: why are we doing this?
	attempt.attemptId = attempt.id
	delete attempt.id
	return attempt
}

module.exports = resumeAttempt
