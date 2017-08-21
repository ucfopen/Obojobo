let url = require('url')
let uuid = require('uuid').v4

let Event = require('caliper-js-public/src/events/event')
let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')
let ViewEvent = require('caliper-js-public/src/events/viewEvent')
let AssessmentItemEvent = require('caliper-js-public/src/events/assessmentItemEvent')
let AssessmentEvent = require('caliper-js-public/src/events/assessmentEvent')
// This version doesn't have grade event:
// let GradeEvent = require('caliper-js-public/src/events/gradeEvent')

let NavigationActions = require('caliper-js-public/src/actions/navigationActions')

let getNewGeneratedId = () => 'urn:uuid:' + uuid()

let createEvent = (classRef, req, currentUser) => {
	let caliperEvent = new classRef()
	caliperEvent.id = getNewGeneratedId()
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

let createScore = (req, attemptIRI, score) => {
	return {
		'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
		'@type': 'Score',
		id: getNewGeneratedId(),
		attempt: attemptIRI,
		maxScore: 100,
		scoreGiven: score,
		scoredBy: req.iri.getEdAppIRI(),
		dateCreated: new Date().toISOString()
	}
}

let createNavigationEvent = (req, currentUser, draftId, from, to, extensions = {}) => {
	let caliperEvent = createEvent(NavigationEvent, req, currentUser)

	caliperEvent.referrer = req.iri.getViewIRI(draftId, from)
	caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
	caliperEvent.setObject(req.iri.getViewIRI(draftId, to))
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createViewEvent = (
	req,
	currentUser,
	draftId,
	questionId,
	frameName = null,
	extensions = {}
) => {
	let caliperEvent = createEvent(ViewEvent, req, currentUser)

	caliperEvent.setAction('Viewed')
	caliperEvent.setObject(req.iri.getViewIRI(draftId, questionId))
	if (frameName) {
		caliperEvent.setTarget(req.iri.getViewIRI(draftId, questionId, frameName))
	}
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createHideEvent = (
	req,
	currentUser,
	draftId,
	questionId,
	frameName = null,
	extensions = {}
) => {
	let caliperEvent = createEvent(Event, req, currentUser)

	caliperEvent.setAction('Hid')
	caliperEvent.setObject(req.iri.getViewIRI(draftId, questionId))
	if (frameName) {
		caliperEvent.setTarget(req.iri.getViewIRI(draftId, questionId, frameName))
	}
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
	extensions = {}
) => {
	return createAssessmentEvent(
		req,
		currentUser,
		draftId,
		assessmentId,
		'Submitted',
		attemptId,
		extensions
	)
}

let createAssessmentAttemptScoredEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	attemptScore,
	extensions = {}
) => {
	let caliperEvent = createEvent(Event, req, currentUser) //@TODO: Should be GradeEvent

	caliperEvent.setType('GradeEvent')

	caliperEvent.setActor(req.iri.getEdAppIRI())
	caliperEvent.setAction('Graded')
	caliperEvent.setObject(req.iri.getAssessmentAttemptIRI(draftId, assessmentId, attemptId))
	//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
	caliperEvent.setGenerated(
		createScore(
			req,
			req.iri.getAssessmentAttemptIRI(draftId, assessmentId, attemptId),
			attemptScore
		)
	)

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
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
	} else {
		caliperEvent.setObject(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))
	}

	return caliperEvent
}

let createPracticeGradeEvent = (
	req,
	currentUser,
	draftId,
	questionId,
	score,
	assessmentId,
	attemptId
) => {
	let caliperEvent = createEvent(Event, req, currentUser) //@TODO: Should be GradeEvent

	caliperEvent.setType('GradeEvent')

	caliperEvent.setActor(req.iri.getEdAppIRI())
	caliperEvent.setAction('Graded')
	caliperEvent.setObject(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))
	//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
	caliperEvent.setGenerated(
		createScore(req, req.iri.getPracticeQuestionAttemptIRI(draftId, questionId), score)
	)

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createViewerAbandonedEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(Event, req, currentUser)

	caliperEvent.setAction('Abandoned')
	caliperEvent.setObject(req.iri.getViewIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createViewerResumedEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(Event, req, currentUser)

	caliperEvent.setAction('Resumed')
	caliperEvent.setObject(req.iri.getViewIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createViewerEndedEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(Event, req, currentUser)

	caliperEvent.setAction('Ended')
	caliperEvent.setObject(req.iri.getViewIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

module.exports = {
	createNavigationEvent,
	createViewEvent,
	createHideEvent,
	createAssessmentAttemptStartedEvent,
	createAssessmentAttemptSubmittedEvent,
	createAssessmentItemEvent,
	createPracticeGradeEvent,
	createAssessmentAttemptScoredEvent,
	createViewerAbandonedEvent,
	createViewerResumedEvent,
	createViewerEndedEvent
}
