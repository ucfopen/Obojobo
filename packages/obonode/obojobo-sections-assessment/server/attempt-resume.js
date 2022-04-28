const AssessmentModel = require('./models/assessment')
const attemptStart = require('./attempt-start')
const insertEvent = require('obojobo-express/server/insert_event')
const insertEvents = require('./insert-events')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ERROR_INVALID_ATTEMPT_RESUME = 'Cannot resume an attempt for a different module'

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
	const attempt = await AssessmentModel.fetchAttemptById(attemptId)
	const assessmentNode = currentDocument.getChildNodeById(attempt.assessmentId)

	// Check to make sure this attempt is for the current module
	if (
		currentDocument.draftId !== attempt.draftId ||
		currentDocument.contentId !== attempt.draftContentId
	) {
		// Discard this attempt if the module was updated
		// while the user was away from the assessment
		const invalidatedAttempt = await AssessmentModel.invalidateAttempt(attemptId)
		if (invalidatedAttempt) {
			await insertEvents.insertAttemptInvalidatedEvent(
				attempt.id,
				currentUser.id,
				currentVisit.id,
				currentDocument.draftId,
				currentDocument.contentId,
				remoteAddress,
				currentVisit.is_preview
			)
		}
		throw new Error(ERROR_INVALID_ATTEMPT_RESUME)
	}

	await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))

	attempt.questions = []

	for (const node of attempt.state.chosen) {
		if (node.type === QUESTION_NODE_TYPE) {
			const questionNode = assessmentNode.draftTree.getChildNodeById(node.id)
			attempt.questions.push(questionNode.toObject())
		}
	}

	await insertEvent({
		action: 'assessment:attemptResume',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attempt.id,
			attemptCount: attempt.number
		},
		userId: currentUser.id,
		ip: remoteAddress,
		visitId: currentVisit.id,
		metadata: {},
		draftId: currentDocument.draftId,
		contentId: currentDocument.contentId,
		eventVersion: '1.2.0',
		isPreview: currentVisit.is_preview
	})

	// update response
	// @TODO: why are we doing this?
	attempt.attemptId = attempt.id
	delete attempt.id
	return attempt
}

module.exports = resumeAttempt
