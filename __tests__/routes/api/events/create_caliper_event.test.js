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
		getSessionIRI: jest.fn(() => 'test session'),
		getFederatedSessionIRI: jest.fn(() => 'test federated session'),
		getAppServerIRI: jest.fn(() => 'test app server'),
		getViewerClientIRI: jest.fn(() => 'test viewer client'),
		getDraftIRI: jest.fn(() => 'test draft'),
		getPracticeQuestionAttemptIRI: jest.fn(() => 'test question attempt')
	},
	session: { oboLti: true }
}

const testCurrentUser = {
	canViewEditor: true
}

const testActor = 'user'
const testAssessmentId = 'assessment:123'
const testAttemptIRI = 'test attempt IRI'
const testAttemptId = 'attempt:123'
const testDate = new Date('2017-08-29T16:57:14.500Z')
const testDraftId = 'draftId:123'
const testExtensions = { foo: 'bar' }
const testNavFromField = 'navigation came from here'
const testNavToField = 'navigation is going here'
const testQuestionId = 'questionId:123'
const testScore = '50'
const testScoreId = '123'

Date = class extends Date {
	constructor() {
		super()
		return testDate
	}
}

describe('Caliper event creator', () => {
	it('can create a score', () => {
		const scoreObj = caliperEvents.createScore(
			testReq,
			testAttemptIRI,
			'test app server',
			testScore,
			'urn:uuid:some-uuid'
		)
		expect(scoreObj).toMatchSnapshot()
	})

	it('can create a score if not given scoreId', () => {
		const scoreObj = caliperEvents.createScore(
			testReq,
			testAttemptIRI,
			'test app server',
			testScore
		)
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
			testActor,
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId
		)
		expect(hideEvent).toMatchSnapshot()
	})

	it('sets target of hide event when given framename arg', () => {
		const hideEvent = caliperEvents.createHideEvent(
			testActor,
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
			testExtensions
		)
		expect(attemptStarted).toMatchSnapshot()
	})

	it('can create an assessment attempt started event when extensions argument not provided', () => {
		const attemptStarted = caliperEvents.createAssessmentAttemptStartedEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testAssessmentId,
			testAttemptId
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
			testScore
		)
		expect(attemptScored).toMatchSnapshot()
	})

	it('can create a practice grade event', () => {
		const practiceGrade = caliperEvents.createPracticeGradeEvent(
			'viewerClient',
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testScoreId,
			testScore,
			testExtensions
		)
		expect(practiceGrade).toMatchSnapshot()
	})

	it('can create an assessment item event', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testAssessmentId,
			testAttemptId,
			testExtensions
		)
		expect(assessmentItem).toMatchSnapshot()
	})

	it('can create an assessment item event when assesmentId is null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			null,
			testAttemptId,
			testExtensions
		)
		expect(assessmentItem).toMatchSnapshot()
	})

	it('can create an assessment item event when attemptId is null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testAssessmentId,
			null,
			testExtensions
		)
		expect(assessmentItem).toMatchSnapshot()
	})

	it('can create an assessment item event when assessmentId and attemptId are null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			null,
			null,
			testExtensions
		)
		expect(assessmentItem).toMatchSnapshot()
	})

	it('can create an assessment item event when assesmentId, attemptId, and extensions arguments are not provided', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId
		)
		expect(assessmentItem).toMatchSnapshot()
	})

	it('can create a practice question submitted event', () => {
		const practiceQuestionSubmitted = caliperEvents.createPracticeQuestionSubmittedEvent(
			testActor,
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testExtensions
		)
		expect(practiceQuestionSubmitted).toMatchSnapshot()
	})

	it('can create a practice ungrade event', () => {
		const practiceUngrade = caliperEvents.createPracticeUngradeEvent(
			testActor,
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testScoreId,
			testExtensions
		)
		expect(practiceUngrade).toMatchSnapshot()
	})

	it('can create a viewer abandoned event', () => {
		const viewerAbandoned = caliperEvents.createViewerAbandonedEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testExtensions
		)
		expect(viewerAbandoned).toMatchSnapshot()
	})

	it('can create a viewer resumed event', () => {
		const viewerResumed = caliperEvents.createViewerResumedEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testExtensions
		)
		expect(viewerResumed).toMatchSnapshot()
	})

	it('can create a viewer session logged in event', () => {
		const viewerSessionLoggedIn = caliperEvents.createViewerSessionLoggedInEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testExtensions
		)
		expect(viewerSessionLoggedIn).toMatchSnapshot()
	})

	it('can create a viewer session logged out event', () => {
		const viewerSessionLoggedOut = caliperEvents.createViewerSessionLoggedOutEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testExtensions
		)
		expect(viewerSessionLoggedOut).toMatchSnapshot()
	})

	it('can create a viewer session logged out event', () => {
		const viewerSessionLoggedOut = caliperEvents.createViewerSessionLoggedOutEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testExtensions
		)
		expect(viewerSessionLoggedOut).toMatchSnapshot()
	})

	it('can create a practice questions reset event', () => {
		const practiceQuestionReset = caliperEvents.createPracticeQuestionResetEvent(
			testActor,
			testReq,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testExtensions
		)
		expect(practiceQuestionReset).toMatchSnapshot()
	})

	it('throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createPracticeQuestionResetEvent(
				'badActor',
				testReq,
				testCurrentUser,
				testDraftId,
				testQuestionId,
				testExtensions
			)
		).toThrow(`createEvent actor must be one of "user", "viewerClient" or "serverApp"`)
	})

	it('can create event without session', () => {
		let reqNoSession = Object.assign({}, testReq)
		let reqNoLti = Object.assign({}, testReq)

		delete reqNoSession.session
		reqNoLti.session = {}

		let noSessionEvent = caliperEvents.createPracticeQuestionResetEvent(
			testActor,
			reqNoSession,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testExtensions
		)

		let noLtiEvent = caliperEvents.createPracticeQuestionResetEvent(
			testActor,
			reqNoLti,
			testCurrentUser,
			testDraftId,
			testQuestionId,
			testExtensions
		)

		expect(noSessionEvent).toMatchSnapshot()
		expect(noLtiEvent).toMatchSnapshot()
	})
})
