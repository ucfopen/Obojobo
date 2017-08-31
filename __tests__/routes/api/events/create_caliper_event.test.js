const caliperEvents = require('../../../../routes/api/events/create_caliper_event')
const CaliperEventFactory = require('../../../../routes/api/events/create_caliper_event_from_req')
const uuid = require('../../../../__mocks__/uuid').v4

// TODO: May want to create different types of test requests (for session, obolti, etc.)
const testReq = {
	iri: {
		getCurrentUserIRI: jest.fn(() => 'test actor'),
		getAssessmentIRI: jest.fn(() => 'test assessment IRI'),
		getAssessmentAttemptIRI: jest.fn(() => 'test assessment attempt IRI'),
		getEdAppIRI: jest.fn(() => 'test ed app'),
		getViewIRI: jest.fn(() => 'test referrer'),
		getSessionIRI: jest.fn(() => 'test session'),
		getFederatedSessionIRI: jest.fn(() => 'test federated session')
	},
	session: { oboLti: true }
}

const testCurrentUser = {
	canViewEditor: true
}

const testAttemptIRI = 'test attempt IRI'
const testAttemptId = 'attempt:123'
const testAssessmentId = 'assessment:123'
const testDraftId = 'draftId:123'
const testQuestionId = 'questionId:123'
const testNavFromField = 'navigation came from here'
const testNavToField = 'navigation is going here'
const testExtensions = {}
const testDate = new Date('2017-08-29T16:57:14.500Z')

Date = class extends Date {
	constructor() {
		super()
		return testDate
	}
}

describe('Caliper event creator', () => {
	it('can create a score', () => {
		const scoreObj = caliperEvents.createScore(testReq, testAttemptIRI, uuid(), 95)
		expect(scoreObj).toMatchSnapshot()
	})

	it('can create a navigation event', () => {
		const navEvent = caliperEvents.createNavigationEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testNavFromField,
			testNavToField,
			testExtensions
		)
		expect(navEvent).toMatchSnapshot()
	})

	it('can create a view event', () => {
		const viewEvent = caliperEvents.createViewEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId
		)
		expect(viewEvent).toMatchSnapshot()
	})

	it('sets target of view event when given framename arg', () => {
		const viewEvent = caliperEvents.createViewEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			'test framename'
		)
		expect(viewEvent).toMatchSnapshot()
	})

	it('can create a hide event', () => {
		const hideEvent = caliperEvents.createHideEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId
		)
		expect(hideEvent).toMatchSnapshot()
	})

	it('sets target of hide event when given framename arg', () => {
		const hideEvent = caliperEvents.createHideEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			'test framename'
		)
		expect(hideEvent).toMatchSnapshot()
	})

	it('can create an assessment attempt started event', () => {
		const attemptStarted = caliperEvents.createAssessmentAttemptStartedEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testAssessmentId,
			testAttemptId,
			3
		)
		expect(attemptStarted).toMatchSnapshot()
	})

	it('can create an assessment attempt submitted event', () => {
		const attemptSubmitted = caliperEvents.createAssessmentAttemptSubmittedEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testAssessmentId,
			testAttemptId
		)
		expect(attemptSubmitted).toMatchSnapshot()
	})

	it('can create an attempt scored event', () => {
		const attemptScored = caliperEvents.createAssessmentAttemptScoredEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testAssessmentId,
			testAttemptId,
			95
		)
		expect(attemptScored).toMatchSnapshot()
	})
})
