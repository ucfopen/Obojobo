let caliperEvents = require('./create_caliper_event')

module.exports = (req, currentUser) => {
	let clientEvent = req.body.event

	switch (clientEvent.action) {
		case 'nav:goto':
		case 'nav:gotoPath':
		case 'nav:prev':
		case 'nav:next':
			return caliperEvents.createNavigationEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.from,
				clientEvent.payload.to,
				{ navType: clientEvent.action.split(':')[1] }
			)

		case 'question:view':
			return caliperEvents.createViewEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId
			)

		case 'question:setResponse':
		case 'assessment:setResponse':
			return caliperEvents.createAssessmentItemEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId,
				clientEvent.payload.assessmentId,
				clientEvent.payload.attemptId
			)
	}

	return null
}
