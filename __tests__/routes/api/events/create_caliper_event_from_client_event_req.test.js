const caliperEvent = require('../../../../routes/api/events/create_caliper_event')

const actor = 'user'
const assessmentId = 'testAssessmentReq'
const attemptId = 'testAttemptIdReq'
const attemptIRI = 'testAttemptIRIReq'
const currentUser = { id: 'testUserIdReq' }
const draft_id = 'testDraftIdReq'
const from = 'fromReq'
const hostname = 'hostnameReq'
const id = 'testIdReq'
const inactiveDuration = 'testInactiveDurationReq'
const itemId = 'testItemIdReq'
const lastActiveTime = 'testLastActiveTimeReq'
const questionId = 'testQuestionIdReq'
const relatedEventId = 'testRelatedEventIdreq'
const score = 'scoreReq'
const scoreId = 'scoreIdReq'
const session = { id: 'SessionIdReq', oboLti: { launchId: 'OboLtiLaunchIdReq' } }
const sessionIds = { sessionId: 'testSessionIdReq', launchId: 'testOboLaunchIdReq' }
const testDate = new Date('2016-09-22T16:57:14.500Z')
const to = 'toReq'

Date = class extends Date {
	constructor() {
		super()
		return testDate
	}
}

let baseReqObject = {
	currentUser,
	session,
	hostname,
	body: {
		event: {
			action: null,
			draft_id,
			payload: {}
		}
	}
}

const fillReqObj = (action, payload = {}) => {
	let newReqObject = JSON.parse(JSON.stringify(baseReqObject))
	let event = newReqObject.body.event
	event.action = action
	event.payload = payload
	return newReqObject
}

let reqObjects = {
	nav_goto: fillReqObj('nav:goto', { from, to }),
	question_view: fillReqObj('question:view', { questionId }),
	question_hide: fillReqObj('question:hide', { questionId }),
	question_checkAnswer: fillReqObj('question:checkAnswer', { questionId }),
	question_showExplanation: fillReqObj('question:showExplanation', { questionId }),
	question_hideExplanation: fillReqObj('question:hideExplanation', { questionId, actor }),
	question_setResponse: fillReqObj('question:setResponse', { assessmentId, attemptId, questionId }),
	score_set: fillReqObj('score:set', { id, itemId, score }),
	score_clear: fillReqObj('score:clear', { id, itemId }),
	question_retry: fillReqObj('question:retry', { questionId }),
	viewer_inactive: fillReqObj('viewer:inactive', { inactiveDuration, lastActiveTime }),
	viewer_returnFromInactive: fillReqObj('viewer:returnFromInactive', {
		inactiveDuration,
		lastActiveTime,
		relatedEventId
	}),
	viewer_close: fillReqObj('viewer:close'),
	viewer_leave: fillReqObj('viewer:leave'),
	viewer_return: fillReqObj('viewer:return', { relatedEventId })
}

describe('Caliper event from req', () => {
	// Test with all events in req object
	Object.keys(reqObjects).forEach(reqObjectKey => {
		it(`${reqObjectKey}`, () => {
			expect(caliperEvent(reqObjects[reqObjectKey])).toMatchSnapshot()
		})
	})
})
