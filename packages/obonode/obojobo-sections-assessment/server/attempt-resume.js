const Assessment = require('./assessment')
const DraftModel = require('obojobo-express/models/draft')
const VisitModel = require('obojobo-express/models/visit')
const attemptStart = require('./attempt-start')
const createCaliperEvent = require('obojobo-express/routes/api/events/create_caliper_event')
const insertEvent = require('obojobo-express/insert_event')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = async (req, res) => {
	const currentUser = await req.requireCurrentUser()
	const visit = await VisitModel.fetchById(req.body.visitId)
	const isPreview = visit.is_preview

	const attempt = await Assessment.getAttempt(req.body.attemptId)

	attempt.attemptId = attempt.id
	delete attempt.id

	const draftDocument = await DraftModel.fetchDraftByVersion(
		attempt.draft_id,
		attempt.draft_content_id
	)

	const assessmentNode = draftDocument.getChildNodeById(attempt.assessment_id)

	await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))

	attempt.questions = []

	for (const node of attempt.state.chosen) {
		if (node.type === QUESTION_NODE_TYPE) {
			attempt.questions.push(assessmentNode.draftTree.getChildNodeById(node.id).toObject())
		}
	}

	const { createAssessmentAttemptResumedEvent } = createCaliperEvent(null, req.hostname)
	await insertEvent({
		action: 'assessment:attemptResume',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attempt.attemptId,
			attemptCount: attempt.number
		},
		userId: currentUser.id,
		ip: req.connection.remoteAddress,
		metadata: {},
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId,
		eventVersion: '1.1.0',
		isPreview: isPreview,
		caliperPayload: createAssessmentAttemptResumedEvent({
			actor: { type: 'user', id: currentUser.id },
			draftId: draftDocument.draftId,
			contentId: draftDocument.contentId,
			assessmentId: attempt.assessmentId,
			attemptId: attempt.attemptId
		})
	})

	res.success(attempt)
}

module.exports = resumeAttempt
