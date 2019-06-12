const Assessment = require('../assessment')
const DraftDocument = require('obojobo-express/models/draft')

const getAttempt = async attemptId => {
	const attempt = await Assessment.getAttempt(attemptId)
	const attemptNumber = await Assessment.getAttemptNumber(
		attempt.user_id,
		attempt.draft_id,
		attemptId
	)
	const draftDocument = await DraftDocument.fetchById(attempt.draft_id)

	return {
		assessmentId: attempt.assessment_id,
		number: attemptNumber,
		attemptState: attempt.state,
		draftId: attempt.draft_id,
		model: draftDocument,
		assessmentModel: draftDocument.getChildNodeById(attempt.assessment_id)
	}
}

module.exports = getAttempt
