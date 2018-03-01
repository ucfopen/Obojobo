let iriFactory = require('../../../iri_builder')
let createEvent = require('./create_base_caliper_event')
let validateCaliperEvent = require('./validate_caliper_event').validateArguments
let assignCaliperOptions = require('./validate_caliper_event').assignOptions
let createCaliperEventFromReq = require('./create_caliper_event_from_client_event_req')

let { ACTOR_USER, ACTOR_VIEWER_CLIENT, ACTOR_SERVER_APP } = require('./caliper_constants')
let { getUrnFromUuid, getNewGeneratedId } = require('./caliper_utils')

let AssessmentEvent = require('caliper-js-public/src/events/assessmentEvent')
let AssessmentItemEvent = require('caliper-js-public/src/events/assessmentItemEvent')
let Event = require('caliper-js-public/src/events/event')
let NavigationActions = require('caliper-js-public/src/actions/navigationActions')
let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')
let SessionEvent = require('caliper-js-public/src/events/sessionEvent')
let ViewEvent = require('caliper-js-public/src/events/viewEvent')

// This version doesn't have grade event:
// let GradeEvent = require('caliper-js-public/src/events/gradeEvent')

// @TODO: Remove this when we migrate to using the 1.1 Caliper library
// (Will potentially want to retain the code that strips out null values)
let updateEventToVersion1_1 = caliperEvent => {
	if (caliperEvent['@type']) {
		caliperEvent.type = caliperEvent['@type'].replace('http://purl.imsglobal.org/caliper/v1/', '')
		delete caliperEvent['@type']
	}

	if (caliperEvent.action) {
		caliperEvent.action = caliperEvent.action.replace(
			'http://purl.imsglobal.org/vocab/caliper/v1/action#',
			''
		)
	}

	for (let propName in caliperEvent) {
		if (caliperEvent[propName] === null) {
			delete caliperEvent[propName]
		}
	}

	return caliperEvent
}

let createScore = (attemptIRI, scoredBy, score, scoreId = getNewGeneratedId()) => {
	return {
		'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
		type: 'Score', //Term
		id: scoreId, //IRI
		attempt: attemptIRI, //Attempt
		maxScore: 100, //decimal
		scoreGiven: score, //decimal
		scoredBy: scoredBy, //Agent
		dateCreated: new Date().toISOString() //DateTime
	}
}

// Caliper-Spec Properties
// type: (type: Term, REQUIRED) AssessmentEvent
// action: (type: Term, REQUIRED) Started | Paused | Resumed | Restarted | Reset | Submitted
// object: (type: Assessment, REQUIRED) Assessment IRI of the assessment being acted upon
// generated: (type: Attempt, Recommended) IRI of the attempt of this assessment
// actor: (type: Person, REQUIRED) Current user
let createAssessmentEvent = (obj, IRI) => {
	let required = ['action', 'assessmentId', 'attemptId', 'draftId']
	validateCaliperEvent({ required }, obj, ACTOR_USER)

	let options = assignCaliperOptions(obj)

	let { actor, assessmentId, draftId, action, attemptId, extensions } = obj
	let caliperEvent = createEvent(AssessmentEvent, actor, IRI, options)

	caliperEvent.setAction(action)
	caliperEvent.setObject(IRI.getAssessmentIRI(draftId, assessmentId))
	caliperEvent.setGenerated(IRI.getAssessmentAttemptIRI(attemptId))
	Object.assign(caliperEvent.extensions, extensions)

	return updateEventToVersion1_1(caliperEvent)
}

// Must provide a request object or a host
// isFromReq is used internally for create_caliper_event_from_req
const caliperEventFactory = (req, host = null, isFromReq = false) => {
	if (isFromReq == false) {
		if (req) return createCaliperEventFromReq(req)
	}
	let IRI = iriFactory(req, host)

	return {
		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) NavigationEvent
		// action: (type: Term, REQUIRED) NavigatedTo
		// referrer: (type: DigitalResource | SoftwareApplication, Recommended) View IRI of where they came from
		// object: (type: DigitalResource | SoftwareApplication, REQUIRED) Viewer IRI of where they went to
		// actor: (type: Person, REQUIRED) Current user
		createNavigationEvent: obj => {
			let required = ['draftId', 'from', 'to']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, from, to, extensions } = obj
			let caliperEvent = createEvent(NavigationEvent, actor, IRI, options)

			caliperEvent.referrer = IRI.getDraftIRI(draftId, from)
			caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
			caliperEvent.setObject(IRI.getDraftIRI(draftId, to))
			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) ViewEvent
		// action: (type: Term, REQUIRED) Viewed
		// object: (type: DigitalResource, REQUIRED) View IRI of the item being viewed
		// target: (type: Frame, Optional) A more specific IRI of which part of the object is being viewed
		// actor: (type: Person, REQUIRED) Current user
		createViewEvent: obj => {
			let required = ['draftId', 'itemId']
			let optional = ['frameName']
			validateCaliperEvent({ required, optional }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, frameName, itemId, extensions } = obj
			let caliperEvent = createEvent(ViewEvent, actor, IRI, options)

			caliperEvent.setAction('Viewed')
			caliperEvent.setObject(IRI.getDraftIRI(draftId, itemId))
			if (frameName) {
				caliperEvent.setTarget(IRI.getDraftIRI(draftId, itemId, frameName))
			}
			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Hid
		// object: (type: Entity, REQUIRED) View IRI of the item being hidden
		// target: (type: Entity, Optional) A more specific IRI of which part of the object is being hidden
		createHideEvent: obj => {
			let required = ['draftId', 'questionId']
			let optional = ['frameName']
			validateCaliperEvent({ required, optional }, obj)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, frameName, questionId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Hid')
			caliperEvent.setObject(IRI.getDraftIRI(draftId, questionId))
			if (frameName) {
				caliperEvent.setTarget(IRI.getDraftIRI(draftId, questionId, frameName))
			}
			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		createAssessmentAttemptStartedEvent: obj => {
			obj.action = 'Started'
			return createAssessmentEvent(obj, IRI)
		},

		createAssessmentAttemptSubmittedEvent: obj => {
			obj.action = 'Submitted'
			return createAssessmentEvent(obj, IRI)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) GradeEvent
		// action: (type: Term, REQUIRED) Graded
		// object: (type: Attempt, REQUIRED) Attempt IRI
		// generated: (type: Score, Recommended) Score for the attempt
		createAssessmentAttemptScoredEvent: obj => {
			let required = ['assessmentId', 'attemptId', 'attemptScore', 'draftId']
			validateCaliperEvent({ required }, obj, ACTOR_SERVER_APP)

			let options = assignCaliperOptions(obj)

			let { actor, assessmentId, attemptId, attemptScore, draftId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options) //@TODO: Should be GradeEvent

			caliperEvent.setType('GradeEvent')
			caliperEvent.setAction('Graded')
			caliperEvent.setObject(IRI.getAssessmentAttemptIRI(attemptId))
			caliperEvent.setTarget(IRI.getAssessmentIRI(draftId, assessmentId))

			//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
			caliperEvent.setGenerated(
				createScore(IRI.getAssessmentAttemptIRI(attemptId), IRI.getAppServerIRI(), attemptScore)
			)

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) GradeEvent
		// action: (type: Term, REQUIRED) Graded
		// object: (type: Attempt, REQUIRED) Question Attempt IRI
		// generated: (type: Score, Recommended) Score for the attempt
		createPracticeGradeEvent: obj => {
			let required = ['draftId', 'questionId', 'scoreId', 'score']
			validateCaliperEvent({ required }, obj, ACTOR_VIEWER_CLIENT)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, questionId, score, scoreId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options) //@TODO: Should be GradeEvent

			caliperEvent.setType('GradeEvent')
			caliperEvent.setAction('Graded')
			caliperEvent.setObject(IRI.getPracticeQuestionAttemptIRI(draftId, questionId))
			//@TODO - Caliper spec will have a Score entity but our version doesn't have this yet
			caliperEvent.setGenerated(
				createScore(
					IRI.getPracticeQuestionAttemptIRI(draftId, questionId),
					IRI.getViewerClientIRI(),
					score,
					getUrnFromUuid(scoreId)
				)
			)

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) AssessmentItemEvent
		// action: (type: Term, REQUIRED) Completed
		// target: (type: Entity, Optional) IRI for the question being answered
		// object: (type: AssessmentItem, REQUIRED) Either an assessment attempt or practice attempt IRI
		// actor: (type: Person, REQUIRED) Current user
		createAssessmentItemEvent: obj => {
			const required = ['draftId', 'questionId', 'targetId', 'selectedTargets']
			const optional = ['assessmentId', 'attemptId']

			validateCaliperEvent({ required, optional }, obj, ACTOR_USER)

			const {
				actor,
				assessmentId,
				attemptId,
				draftId,
				questionId,
				targetId,
				selectedTargets,
				extensions
			} = obj
			const options = assignCaliperOptions(obj)
			const caliperEvent = createEvent(AssessmentItemEvent, actor, IRI, options)
			const questionIdIRI = IRI.getDraftIRI(draftId, questionId)
			const practiceQuesionAttemptIRI = IRI.getPracticeQuestionAttemptIRI(draftId, questionId)

			caliperEvent.setAction('Completed')
			caliperEvent.setTarget(IRI.getDraftIRI(draftId, targetId))
			caliperEvent.setGenerated({
				id: getNewGeneratedId(),
				type: 'Response',
				attempt: attemptId ? IRI.getAssessmentAttemptIRI(attemptId) : practiceQuesionAttemptIRI,
				extensions: { selectedTargets, targetId }
			})

			if (assessmentId !== null && attemptId !== null) {
				caliperEvent.setObject(questionIdIRI)
			} else {
				caliperEvent.setObject(practiceQuesionAttemptIRI)
			}

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Reset
		// object: (type: Entity, REQUIRED) Score URN
		// target: (type: Entity, Optional) Practice question attempt IRI
		createPracticeQuestionSubmittedEvent: obj => {
			let required = ['draftId', 'questionId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, questionId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Submitted')
			caliperEvent.setObject(IRI.getPracticeQuestionAttemptIRI(draftId, questionId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Reset
		// object: (type: Entity, REQUIRED) Score URN
		// target: (type: Entity, Optional) Practice question attempt IRI
		createPracticeUngradeEvent: obj => {
			let required = ['draftId', 'questionId', 'scoreId']
			validateCaliperEvent({ required }, obj, ACTOR_SERVER_APP)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, questionId, scoreId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Reset')
			caliperEvent.setObject(getUrnFromUuid(scoreId))
			caliperEvent.setTarget(IRI.getPracticeQuestionAttemptIRI(draftId, questionId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Abandoned
		// object: (type: Entity, REQUIRED) Draft IRI
		createViewerAbandonedEvent: obj => {
			let required = ['draftId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Abandoned')
			caliperEvent.setObject(IRI.getDraftIRI(draftId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Resumed
		// object: (type: Entity, REQUIRED) Draft IRI
		createViewerResumedEvent: obj => {
			let required = ['draftId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Resumed')
			caliperEvent.setObject(IRI.getDraftIRI(draftId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) SessionEvent
		// action: (type: Term, REQUIRED) LoggedIn
		// object: (type: SoftwareApplication [for LoggedIn], REQUIRED) Obo IRI
		// target: (type: DigitalResource, Optional) Draft IRI
		// actor: (type: Person [for LoggedIn], REQUIRED)
		createViewerSessionLoggedInEvent: obj => {
			let required = ['draftId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, extensions } = obj
			let caliperEvent = createEvent(SessionEvent, actor, IRI, options)

			caliperEvent.setAction('LoggedIn')
			caliperEvent.setObject(IRI.getEdAppIRI())
			caliperEvent.setTarget(IRI.getDraftIRI(draftId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) SessionEvent
		// action: (type: Term, REQUIRED) LoggedOut
		// object: (type: SoftwareApplication [for LoggedOut], REQUIRED) Obo IRI
		// target: (type: DigitalResource, Optional) Draft IRI
		// actor: (type: Person [for LoggedOut], REQUIRED)
		createViewerSessionLoggedOutEvent: obj => {
			let required = ['draftId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, extensions } = obj
			let caliperEvent = createEvent(SessionEvent, actor, IRI, options)

			caliperEvent.setAction('LoggedOut')
			caliperEvent.setObject(IRI.getEdAppIRI())
			caliperEvent.setTarget(IRI.getDraftIRI(draftId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		},

		// Caliper-Spec Properties
		// type: (type: Term, REQUIRED) Event
		// action: (type: Term, REQUIRED) Reset
		// object: (type: Entity, REQUIRED) Draft IRI
		// target: (type: Entity, Optional) Practice attempt IRI
		createPracticeQuestionResetEvent: obj => {
			let required = ['draftId', 'questionId']
			validateCaliperEvent({ required }, obj, ACTOR_USER)

			let options = assignCaliperOptions(obj)

			let { actor, draftId, questionId, extensions } = obj
			let caliperEvent = createEvent(Event, actor, IRI, options)

			caliperEvent.setAction('Reset')
			caliperEvent.setObject(IRI.getDraftIRI(draftId, questionId))
			caliperEvent.setTarget(IRI.getPracticeQuestionAttemptIRI(draftId, questionId))

			Object.assign(caliperEvent.extensions, extensions)

			return updateEventToVersion1_1(caliperEvent)
		}
	}
}

module.exports = caliperEventFactory
