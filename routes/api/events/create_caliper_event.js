let url = require('url')
let uuid = require('uuid').v4

let Event = require('caliper-js-public/src/events/event')
let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')
let ViewEvent = require('caliper-js-public/src/events/viewEvent')
let AssessmentItemEvent = require('caliper-js-public/src/events/assessmentItemEvent')
let AssessmentEvent = require('caliper-js-public/src/events/assessmentEvent')

let NavigationActions = require('caliper-js-public/src/actions/navigationActions')

let createEvent = (classRef, req, currentUser) => {
	let caliperEvent = new classRef()
	caliperEvent.id = 'urn:uuid:' + uuid()
	caliperEvent.setEdApp(req.iri.getEdAppIRI())
	caliperEvent.setEventTime(new Date().toISOString())
	caliperEvent.setActor(req.iri.getCurrentUserIRI())

	if (req.session) {
		caliperEvent.session = req.iri.getSessionIRI()
	}

	if (req.session.oboLti) {
		caliperEvent.setFederatedSession(req.iri.getFederatedSessionIRI())
	}

	caliperEvent.extensions = {
		previewMode: currentUser.canViewEditor
	}

	return caliperEvent
}

let createNavigationEvent = (req, currentUser, draftId, from, to, extensions = {}) => {
	let caliperEvent = createEvent(NavigationEvent, req, currentUser)

	caliperEvent.referrer = req.iri.getViewIRI(draftId, from)
	caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
	caliperEvent.setObject(req.iri.getViewIRI(draftId, to))
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createViewEvent = (req, currentUser, draftId, questionId, extensions = {}) => {
	let caliperEvent = createEvent(ViewEvent, req, currentUser)

	caliperEvent.setAction('Viewed')
	caliperEvent.setObject(req.iri.getViewIRI(draftId, questionId))
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createAssessmentEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	action,
	attemptId,
	attemptCount,
	extensions = {}
) => {
	let caliperEvent = createEvent(AssessmentEvent, req, currentUser)

	caliperEvent.setAction(action)
	caliperEvent.setObject(req.iri.getAssessmentIRI(draftId, assessmentId))
	caliperEvent.setGenerated(req.iri.getAssessmentAttemptIRI(draftId, assessmentId, attemptId))
	caliperEvent.count = attemptCount
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createAssessmentAttemptStartedEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	attemptCount,
	extensions = {}
) => {
	return createAssessmentEvent(
		req,
		currentUser,
		draftId,
		assessmentId,
		'Started',
		attemptId,
		attemptCount,
		extensions
	)
}

let createAssessmentAttemptSubmittedEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	attemptCount,
	extensions = {}
) => {
	return createAssessmentEvent(
		req,
		currentUser,
		draftId,
		assessmentId,
		'Submitted',
		attemptId,
		attemptCount,
		extensions
	)
}

let createAssessmentItemEvent = (
	req,
	currentUser,
	draftId,
	questionId,
	assessmentId = null,
	attemptId = null,
	extensions = {}
) => {
	let caliperEvent = createEvent(AssessmentItemEvent, req, currentUser)

	caliperEvent.setAction('Completed')
	caliperEvent.setTarget(req.iri.getViewIRI(draftId, questionId))
	Object.assign(caliperEvent.extensions, extensions)

	if (assessmentId !== null && attemptId !== null) {
		caliperEvent.setObject(req.iri.getAssessmentAttemptIRI(draftId, assessmentId, attemptId))
	}

	return caliperEvent
}

module.exports = {
	createNavigationEvent,
	createViewEvent,
	createAssessmentAttemptStartedEvent,
	createAssessmentAttemptSubmittedEvent,
	createAssessmentItemEvent
}
