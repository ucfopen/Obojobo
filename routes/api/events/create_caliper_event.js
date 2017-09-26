let url = require('url')
let uuid = require('uuid').v4

let Event = require('caliper-js-public/src/events/event')
let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')
let ViewEvent = require('caliper-js-public/src/events/viewEvent')
let SessionEvent = require('caliper-js-public/src/events/sessionEvent')
let AssessmentItemEvent = require('caliper-js-public/src/events/assessmentItemEvent')
let AssessmentEvent = require('caliper-js-public/src/events/assessmentEvent')
// This version doesn't have grade event:
// let GradeEvent = require('caliper-js-public/src/events/gradeEvent')

let NavigationActions = require('caliper-js-public/src/actions/navigationActions')

let ACTOR_USER = 'user'
let ACTOR_VIEWER_CLIENT = 'viewerClient'
let ACTOR_SERVER_APP = 'serverApp'

let getUrnFromUuid = uuid => 'urn:uuid:' + uuid
let getNewGeneratedId = () => getUrnFromUuid(uuid())

// Create an event of type classRef, generate an id, set the edApp, set the
// event time, set the session and federated session (LTI), add the previewMode
// flag and set the actor either to the user or to the app
//
// id: (UUID, REQUIRED) UUID for the Event
// type: (Term, REQUIRED) <classRef>
// edApp: (SoftwareApplication, Optional) IRI for Obojobo
// eventTime: (DateTime, REQUIRED) Current ISO Time
// actor: (Agent, REQUIRED) Either the IRI for the current user or the IRI for Obojobo
let createEvent = (classRef, req, currentUser, actor) => {
	let caliperEvent = new classRef()
	caliperEvent.id = getNewGeneratedId()
	caliperEvent.setEdApp(req.iri.getEdAppIRI())
	caliperEvent.setEventTime(new Date().toISOString())

	switch (actor) {
		case ACTOR_USER:
			caliperEvent.setActor(req.iri.getCurrentUserIRI())
			break

		case ACTOR_VIEWER_CLIENT:
			caliperEvent.setActor(req.iri.getViewerClientIRI())
			break

		case ACTOR_SERVER_APP:
			caliperEvent.setActor(req.iri.getAppServerIRI())
			break

		default:
			throw new Error(
				`createEvent actor must be one of "${ACTOR_USER}", "${ACTOR_VIEWER_CLIENT}" or "${ACTOR_SERVER_APP}"`
			)
	}

	if (req.session) {
		caliperEvent.session = req.iri.getSessionIRI()
		if (req.session.oboLti) caliperEvent.setFederatedSession(req.iri.getFederatedSessionIRI())
	}

	caliperEvent.extensions = {
		previewMode: currentUser.canViewEditor
	}

	return caliperEvent
}

let createScore = (req, attemptIRI, scoredBy, score, scoreId = getNewGeneratedId()) => {
	return {
		'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
		'@type': 'Score', //Term
		id: scoreId, //IRI
		attempt: attemptIRI, //Attempt
		maxScore: 100, //decimal
		scoreGiven: score, //decimal
		scoredBy: scoredBy, //Agent
		dateCreated: new Date().toISOString() //DateTime
	}
}

// type: (Term, REQUIRED) NavigationEvent
// action: (Term, REQUIRED) NavigatedTo
// referrer: (DigitalResource | SoftwareApplication, Recommended) View IRI of where they came from
// object: (DigitalResource | SoftwareApplication, REQUIRED) Viewer IRI of where they went to
// actor: (Person, REQUIRED) Current user
let createNavigationEvent = (req, currentUser, draftId, from, to, extensions, id = null) => {
	let caliperEvent = createEvent(NavigationEvent, req, currentUser, ACTOR_USER)

	caliperEvent.referrer = req.iri.getDraftIRI(draftId, from)
	caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
	caliperEvent.setObject(req.iri.getDraftIRI(draftId, to))
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) ViewEvent
// action: (Term, REQUIRED) Viewed
// object: (DigitalResource, REQUIRED) View IRI of the item being viewed
// target: (Frame, Optional) A more specific IRI of which part of the object is being viewed
// actor: (Person, REQUIRED) Current user
let createViewEvent = (req, currentUser, draftId, itemId, frameName = null, extensions) => {
	let caliperEvent = createEvent(ViewEvent, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('Viewed')
	caliperEvent.setObject(req.iri.getDraftIRI(draftId, itemId))
	if (frameName) {
		caliperEvent.setTarget(req.iri.getDraftIRI(draftId, itemId, frameName))
	}
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Hid
// object: (Entity, REQUIRED) View IRI of the item being hidden
// target: (Entity, Optional) A more specific IRI of which part of the object is being hidden
let createHideEvent = (
	actor,
	req,
	currentUser,
	draftId,
	questionId,
	frameName = null,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, actor)

	caliperEvent.setAction('Hid')
	caliperEvent.setObject(req.iri.getDraftIRI(draftId, questionId))
	if (frameName) {
		caliperEvent.setTarget(req.iri.getDraftIRI(draftId, questionId, frameName))
	}
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) AssessmentEvent
// action: (Term, REQUIRED) Started | Paused | Resumed | Restarted | Reset | Submitted
// object: (Assessment, REQUIRED) Assessment IRI of the assessment being acted upon
// generated: (Attempt, Recommended) IRI of the attempt of this assessment
// actor: (Person, REQUIRED) Current user
let createAssessmentEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	action,
	attemptId,
	extensions
) => {
	let caliperEvent = createEvent(AssessmentEvent, req, currentUser, ACTOR_USER)

	caliperEvent.setAction(action)
	caliperEvent.setObject(req.iri.getAssessmentIRI(draftId, assessmentId))
	caliperEvent.setGenerated(req.iri.getAssessmentAttemptIRI(attemptId))
	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

let createAssessmentAttemptStartedEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	extensions
) => {
	return createAssessmentEvent(
		req,
		currentUser,
		draftId,
		assessmentId,
		'Started',
		attemptId,
		extensions
	)
}

let createAssessmentAttemptSubmittedEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	extensions
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

// type: (Term, REQUIRED) GradeEvent
// action: (Term, REQUIRED) Graded
// object: (Attempt, REQUIRED) Attempt IRI
// generated: (Score, Recommended) Score for the attempt
let createAssessmentAttemptScoredEvent = (
	req,
	currentUser,
	draftId,
	assessmentId,
	attemptId,
	attemptScore,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, ACTOR_SERVER_APP) //@TODO: Should be GradeEvent

	caliperEvent.setType('GradeEvent')

	caliperEvent.setAction('Graded')
	caliperEvent.setObject(req.iri.getAssessmentAttemptIRI(attemptId))
	//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
	caliperEvent.setGenerated(
		createScore(
			req,
			req.iri.getAssessmentAttemptIRI(attemptId),
			req.iri.getAppServerIRI(),
			attemptScore
		)
	)

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) GradeEvent
// action: (Term, REQUIRED) Graded
// object: (Attempt, REQUIRED) Question Attempt IRI
// generated: (Score, Recommended) Score for the attempt
let createPracticeGradeEvent = (
	actor,
	req,
	currentUser,
	draftId,
	questionId,
	scoreId,
	score,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, actor) //@TODO: Should be GradeEvent

	caliperEvent.setType('GradeEvent')

	caliperEvent.setAction('Graded')
	caliperEvent.setObject(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))
	//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
	caliperEvent.setGenerated(
		createScore(
			req,
			req.iri.getPracticeQuestionAttemptIRI(draftId, questionId),
			req.iri.getViewerClientIRI(),
			score,
			getUrnFromUuid(scoreId)
		)
	)

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) AssessmentItemEvent
// action: (Term, REQUIRED) Completed
// target: (Entity, Optional) IRI for the question being answered
// object: (AssessmentItem, REQUIRED) Either an assessment attempt or practice attempt IRI
// actor: (Person, REQUIRED) Current user
let createAssessmentItemEvent = (
	req,
	currentUser,
	draftId,
	questionId,
	assessmentId = null,
	attemptId = null,
	extensions
) => {
	let caliperEvent = createEvent(AssessmentItemEvent, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('Completed')
	caliperEvent.setTarget(req.iri.getDraftIRI(draftId, questionId))
	Object.assign(caliperEvent.extensions, extensions)

	if (assessmentId !== null && attemptId !== null) {
		caliperEvent.setObject(req.iri.getAssessmentAttemptIRI(attemptId))
	} else {
		caliperEvent.setObject(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))
	}

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Reset
// object: (Entity, REQUIRED) Score URN
// target: (Entity, Optional) Practice question attempt IRI
let createPracticeQuestionSubmittedEvent = (
	actor,
	req,
	currentUser,
	draftId,
	questionId,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, actor)

	caliperEvent.setAction('Submitted')
	caliperEvent.setObject(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Reset
// object: (Entity, REQUIRED) Score URN
// target: (Entity, Optional) Practice question attempt IRI
let createPracticeUngradeEvent = (
	actor,
	req,
	currentUser,
	draftId,
	questionId,
	scoreId,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, actor)

	caliperEvent.setAction('Reset')
	caliperEvent.setObject(getUrnFromUuid(scoreId))
	caliperEvent.setTarget(req.iri.getPracticeQuestionAttemptIRI(draftId, questionId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Abandoned
// object: (Entity, REQUIRED) Draft IRI
let createViewerAbandonedEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(Event, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('Abandoned')
	caliperEvent.setObject(req.iri.getDraftIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Resumed
// object: (Entity, REQUIRED) Draft IRI
let createViewerResumedEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(Event, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('Resumed')
	caliperEvent.setObject(req.iri.getDraftIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// // type: (Term, REQUIRED) Event
// // action: (Term, REQUIRED) Hid
// // object: (Entity, REQUIRED) Draft IRI
// let createViewerHidEvent = (actor, req, currentUser, draftId, extensions) => {
// 	let caliperEvent = createEvent(Event, req, currentUser, actor)

// 	caliperEvent.setAction('Hid')
// 	caliperEvent.setObject(req.iri.getDraftIRI(draftId))

// 	Object.assign(caliperEvent.extensions, extensions)

// 	return caliperEvent
// }

// // type: (Term, REQUIRED) Event
// // action: (Term, REQUIRED) Showed
// // object: (Entity, REQUIRED) Draft IRI
// let createViewerShowedEvent = (actor, req, currentUser, draftId, extensions) => {
// 	let caliperEvent = createEvent(Event, req, currentUser, actor)

// 	caliperEvent.setAction('Showed')
// 	caliperEvent.setObject(req.iri.getDraftIRI(draftId))

// 	Object.assign(caliperEvent.extensions, extensions)

// 	return caliperEvent
// }

// type: (Term, REQUIRED) SessionEvent
// action: (Term, REQUIRED) LoggedIn
// object: (SoftwareApplication [for LoggedIn], REQUIRED) Obo IRI
// target: (DigitalResource, Optional) Draft IRI
// actor: (Person [for LoggedIn], REQUIRED)
let createViewerSessionLoggedInEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(SessionEvent, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('LoggedIn')
	caliperEvent.setObject(req.iri.getEdAppIRI())
	caliperEvent.setTarget(req.iri.getDraftIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) SessionEvent
// action: (Term, REQUIRED) LoggedOut
// object: (SoftwareApplication [for LoggedOut], REQUIRED) Obo IRI
// target: (DigitalResource, Optional) Draft IRI
// actor: (Person [for LoggedOut], REQUIRED)
let createViewerSessionLoggedOutEvent = (req, currentUser, draftId, extensions) => {
	let caliperEvent = createEvent(SessionEvent, req, currentUser, ACTOR_USER)

	caliperEvent.setAction('LoggedOut')
	caliperEvent.setObject(req.iri.getEdAppIRI())
	caliperEvent.setTarget(req.iri.getDraftIRI(draftId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

// type: (Term, REQUIRED) Event
// action: (Term, REQUIRED) Reset
// object: (Entity, REQUIRED) Draft IRI
// target: (Entity, Optional) Practice attempt IRI
let createPracticeQuestionResetEvent = (
	actor,
	req,
	currentUser,
	draftId,
	oboNodeId,
	extensions
) => {
	let caliperEvent = createEvent(Event, req, currentUser, actor)

	caliperEvent.setAction('Reset')
	caliperEvent.setObject(req.iri.getDraftIRI(draftId, oboNodeId))
	caliperEvent.setTarget(req.iri.getPracticeQuestionAttemptIRI(draftId, oboNodeId))

	Object.assign(caliperEvent.extensions, extensions)

	return caliperEvent
}

module.exports = {
	ACTOR_USER,
	ACTOR_VIEWER_CLIENT,
	ACTOR_SERVER_APP,
	createNavigationEvent,
	createViewEvent,
	createHideEvent,
	createAssessmentAttemptStartedEvent,
	createAssessmentAttemptSubmittedEvent,
	createAssessmentItemEvent,
	createPracticeGradeEvent,
	createPracticeUngradeEvent,
	createAssessmentAttemptScoredEvent,
	createViewerAbandonedEvent,
	createViewerResumedEvent,
	createViewerSessionLoggedInEvent,
	createViewerSessionLoggedOutEvent,
	createPracticeQuestionResetEvent,
	createPracticeQuestionSubmittedEvent,
	createScore
}
