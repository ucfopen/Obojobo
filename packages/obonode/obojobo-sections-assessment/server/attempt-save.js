const AssessmentModel = require('./models/assessment')

const saveAttempt = async (req, res) => {
	try {
		AssessmentModel.saveAttempt(
			req.body.assessmentId,
			req.params.attemptId,
			req.currentUser.id,
			req.body.draftId,
			req.body.draftContentId,
			req.body.state
		)
	} catch {
		return res.unexpected()
	}

    return res.success()
}

module.exports = saveAttempt
