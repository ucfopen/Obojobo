const Assessment = require('./assessment')
const attemptStart = require('./attempt-start')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const DraftModel = require('obojobo-express/models/draft')
const insertEvent = require('obojobo-express/insert_event')
const VisitModel = oboRequire('models/visit')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = async (req, res) => {
	try {
		const attempt = await Assessment.getAttempt(req.body.attemptId)

		attempt.attemptId = attempt.id
		delete attempt.id

		const currentUser = await req.requireCurrentUser()

		const visit = await VisitModel.fetchById(req.body.visitId)

		const isPreview = visit.is_preview

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

		// await insertAttemptResumeEvents(
		// 	currentUser,
		// 	draftDocument,
		// 	attempt.assessmentId,
		// 	attempt.id,
		// 	attempt.number,
		// 	isPreview,
		// 	req.hostname,
		// 	req.connection.remoteAddress
		// )

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
