import BaseCaliper from '../../../../routes/api/events/create_base_caliper_event'
jest.spyOn(BaseCaliper, 'createEvent')
const caliperEvents = require('../../../../routes/api/events/create_caliper_event')(
	null,
	'testHost'
)

const actor = { type: 'user', id: 'testUserId' }
const assessmentId = 'testAssessment'
const attemptId = 'testAttemptId'
const attemptIRI = 'testAttemptIRI'
const draftId = 'testDraftId'
const contentId = 'testContentId'
const extensions = { foo: 'bar' }
const frameName = 'testFramename'
const from = 'navigation came from here'
const itemId = 'testItemId'
const questionId = 'testQuestionId'
const targetId = 'testTargetId'
const selectedTargets = { ids: [targetId] }
const score = '50'
const scoreId = '123'
const sessionIds = { sessionId: 'testSessionId', launchId: 'testOboLaunchId' }
const to = 'navigation is going here'
let originaltoISOString

describe('Caliper event creator', () => {
	beforeAll(() => {
		originaltoISOString = Date.prototype.toISOString
		Date.prototype.toISOString = () => 'mockDate'
	})
	afterAll(() => {
		Date.prototype.toISOString = originaltoISOString
	})

	test('createNavigationEvent', () => {
		const navEvent = caliperEvents.createNavigationEvent({
			actor,
			draftId,
			contentId,
			from,
			to,
			sessionIds,
			extensions
		})
		expect(navEvent).toMatchSnapshot()
	})

	test('createNavigationEvent with no type or action', () => {
		BaseCaliper.createEvent.mockReturnValueOnce({
			'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
			actor: 'https://mockhost/api/server',
			edApp: 'https://mockhost/api/system',
			eventTime: expect.any(String),
			extensions: { previewMode: false },
			federatedSession: null,
			generated: null,
			group: null,
			id: 'urn:uuid:DEADBEEF-0000-DEAD-BEEF-1234DEADBEEF',
			membership: null,
			object: null,
			target: null,
			setAction: jest.fn(),
			setObject: jest.fn()
		})

		const navEvent = caliperEvents.createNavigationEvent({
			actor,
			draftId,
			contentId,
			from,
			to,
			sessionIds,
			extensions
		})
		expect(navEvent).toMatchSnapshot()
	})

	test('createNavigationEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createNavigationEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				from,
				to,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewEvent', () => {
		const viewEvent = caliperEvents.createViewEvent({
			actor,
			draftId,
			contentId,
			itemId,
			sessionIds,
			extensions
		})
		expect(viewEvent).toMatchSnapshot()
	})

	test('createViewEvent - sets target of view event when given framename arg', () => {
		const viewEvent = caliperEvents.createViewEvent({
			actor,
			draftId,
			contentId,
			itemId,
			frameName,
			sessionIds,
			extensions
		})
		expect(viewEvent).toMatchSnapshot()
	})

	test('createViewEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createViewEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				itemId,
				frameName,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createHideEvent', () => {
		const hideEvent = caliperEvents.createHideEvent({
			actor,
			draftId,
			contentId,
			questionId,
			sessionIds,
			extensions
		})
		expect(hideEvent).toMatchSnapshot()
	})

	test('createHideEvent - sets target of hide event when given framename arg', () => {
		const hideEvent = caliperEvents.createHideEvent({
			actor,
			draftId,
			contentId,
			questionId,
			frameName,
			sessionIds,
			extensions
		})
		expect(hideEvent).toMatchSnapshot()
	})

	test('createHideEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createHideEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				frameName,
				sessionIds,
				extensions
			})
		}).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createAssessmentAttemptStartedEvent', () => {
		const attemptStarted = caliperEvents.createAssessmentAttemptStartedEvent({
			actor,
			draftId,
			contentId,
			assessmentId,
			attemptId,
			sessionIds,
			extensions
		})
		expect(attemptStarted).toMatchSnapshot()
	})

	test('createAssessmentAttemptStartedEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createAssessmentAttemptStartedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				assessmentId,
				attemptId,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createAssessmentAttemptSubmittedEvent', () => {
		const attemptSubmitted = caliperEvents.createAssessmentAttemptSubmittedEvent({
			actor,
			draftId,
			contentId,
			assessmentId,
			attemptId,
			sessionIds,
			extensions
		})
		expect(attemptSubmitted).toMatchSnapshot()
	})

	test('createAssessmentAttemptSubmittedEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createAssessmentAttemptSubmittedEvent({
				actor: { type: 'bad' },
				draftId,
				assessmentId,
				attemptId,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createAssessmentAttemptScoredEvent', () => {
		const attemptScored = caliperEvents.createAssessmentAttemptScoredEvent({
			actor: { type: 'serverApp' },
			draftId,
			contentId,
			assessmentId,
			attemptId,
			sessionIds,
			attemptScore: score
		})
		expect(attemptScored).toMatchSnapshot()
	})

	test('createAssessmentAttemptScoredEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createAssessmentAttemptScoredEvent({
				actor: { type: 'bad' },
				draftId,
				assessmentId,
				attemptId,
				sessionIds,
				attemptScore: score
			})
		}).toThrow(`Invalid actor type. Must provide actor of type serverApp`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createPracticeGradeEvent', () => {
		const practiceGrade = caliperEvents.createPracticeGradeEvent({
			actor: { type: 'viewerClient' },
			draftId,
			contentId,
			questionId,
			scoreId,
			score,
			sessionIds,
			extensions
		})
		expect(practiceGrade).toMatchSnapshot()
	})

	test('createPracticeGradeEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createPracticeGradeEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				scoreId,
				score,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type viewerClient`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createAssessmentItemEvent', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent({
			actor,
			draftId,
			contentId,
			questionId,
			assessmentId,
			attemptId,
			targetId,
			selectedTargets,
			extensions
		})
		expect(assessmentItem).toMatchSnapshot()
	})

	test('createAssessmentItemEvent - when assesmentId is null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent({
			actor,
			draftId,
			contentId,
			questionId,
			assessmentId: null,
			attemptId,
			targetId,
			selectedTargets
		})
		expect(assessmentItem).toMatchSnapshot()
	})

	test('createAssessmentItemEvent - when attemptId is null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent({
			actor,
			draftId,
			contentId,
			questionId,
			assessmentId,
			attemptId: null,
			targetId,
			selectedTargets
		})
		expect(assessmentItem).toMatchSnapshot()
	})

	test('createAssessmentItemEvent - when assessmentId and attemptId are null', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent({
			actor,
			draftId,
			contentId,
			questionId,
			assessmentId: null,
			attemptId: null,
			targetId,
			selectedTargets
		})
		expect(assessmentItem).toMatchSnapshot()
	})

	test('createAssessmentItemEvent - when assesmentId, attemptId arguments are not provided', () => {
		const assessmentItem = caliperEvents.createAssessmentItemEvent({
			actor,
			draftId,
			contentId,
			questionId,
			targetId,
			selectedTargets
		})
		expect(assessmentItem).toMatchSnapshot()
	})

	test('createAssessmentItemEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createAssessmentItemEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				assessmentId,
				attemptId,
				targetId,
				selectedTargets,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createPracticeQuestionSubmittedEvent', () => {
		const practiceQuestionSubmitted = caliperEvents.createPracticeQuestionSubmittedEvent({
			actor,
			draftId,
			contentId,
			questionId,
			sessionIds,
			extensions
		})
		expect(practiceQuestionSubmitted).toMatchSnapshot()
	})

	test('createPracticeQuestionSubmittedEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createPracticeQuestionSubmittedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				sessionIds,
				extensions
			})
		}).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createPracticeUngradeEvent', () => {
		const practiceUngrade = caliperEvents.createPracticeUngradeEvent({
			actor: { type: 'serverApp' },
			draftId,
			contentId,
			questionId,
			scoreId,
			extensions
		})
		expect(practiceUngrade).toMatchSnapshot()
	})

	test('createPracticeUngradeEvent - throws error given a bad actor', () => {
		expect(() => {
			caliperEvents.createPracticeUngradeEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				scoreId,
				extensions
			})
		}).toThrow('Invalid actor type. Must provide actor of type serverApp')
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewerAbandonedEvent', () => {
		const viewerAbandoned = caliperEvents.createViewerAbandonedEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(viewerAbandoned).toMatchSnapshot()
	})

	test('createViewerAbandonedEvent  - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createViewerAbandonedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewerResumedEvent', () => {
		const viewerResumed = caliperEvents.createViewerResumedEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(viewerResumed).toMatchSnapshot()
	})

	test('createViewerResumedEvent  - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createViewerResumedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewerSessionLoggedInEvent', () => {
		const viewerSessionLoggedIn = caliperEvents.createViewerSessionLoggedInEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(viewerSessionLoggedIn).toMatchSnapshot()
	})

	test('createViewerSessionLoggedInEvent  - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createViewerSessionLoggedInEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewerSessionLoggedOutEvent', () => {
		const viewerSessionLoggedOut = caliperEvents.createViewerSessionLoggedOutEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(viewerSessionLoggedOut).toMatchSnapshot()
	})

	test('createViewerSessionLoggedOutEvent  - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createViewerSessionLoggedOutEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createPracticeQuestionResetEvent', () => {
		const practiceQuestionReset = caliperEvents.createPracticeQuestionResetEvent({
			actor,
			draftId,
			contentId,
			questionId,
			sessionIds,
			extensions
		})
		expect(practiceQuestionReset).toMatchSnapshot()
	})

	test('createPracticeQuestionResetEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createPracticeQuestionResetEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				questionId,
				extensions
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createNavMenuHidEvent', () => {
		const createNavMenuHidEvent = caliperEvents.createNavMenuHidEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(createNavMenuHidEvent).toMatchSnapshot()
	})

	test('createNavMenuHidEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createNavMenuHidEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createNavMenuShowedEvent', () => {
		const createNavMenuShowedEvent = caliperEvents.createNavMenuShowedEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(createNavMenuShowedEvent).toMatchSnapshot()
	})

	test('createNavMenuShowedEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createNavMenuShowedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createNavMenuToggledEvent', () => {
		const createNavMenuToggledEvent = caliperEvents.createNavMenuToggledEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(createNavMenuToggledEvent).toMatchSnapshot()
	})

	test('createNavMenuToggledEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createNavMenuToggledEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createNavMenuActivatedEvent', () => {
		const createNavMenuActivatedEvent = caliperEvents.createNavMenuActivatedEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(createNavMenuActivatedEvent).toMatchSnapshot()
	})

	test('createNavMenuActivatedEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createNavMenuActivatedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createNavMenuDectivatedEvent', () => {
		const createNavMenuDeactivatedEvent = caliperEvents.createNavMenuDeactivatedEvent({
			actor,
			draftId,
			contentId,
			sessionIds,
			extensions
		})
		expect(createNavMenuDeactivatedEvent).toMatchSnapshot()
	})

	test('createNavMenuDeactivatedEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createNavMenuDeactivatedEvent({
				actor: { type: 'bad' },
				draftId,
				contentId,
				sessionIds,
				extensions
			})
		).toThrow(
			`createEvent actor must be one of "user", "viewerClient" or "serverApp". Instead was given "bad".`
		)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createLTIPickerEvent', () => {
		const createLTIPickerEvent = caliperEvents.createLTIPickerEvent({
			actor
		})
		expect(createLTIPickerEvent).toMatchSnapshot()
	})

	test('createLTIPickerEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createLTIPickerEvent({
				actor: { type: 'bad' }
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createViewerOpenEvent', () => {
		const createViewerOpenEvent = caliperEvents.createViewerOpenEvent({
			actor,
			visitId: 'visitId'
		})
		expect(createViewerOpenEvent).toMatchSnapshot()
	})

	test('createViewerOpenEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createViewerOpenEvent({
				actor: { type: 'bad' }
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})

	///////////////////////////////////////////////////////////////////////////////////////////////////

	test('createVisitCreateEvent', () => {
		const createVisitCreateEvent = caliperEvents.createVisitCreateEvent({
			actor,
			visitId: 'visitId',
			extensions: { deactivatedVisitId: 'deactivatedVisitId' }
		})
		expect(createVisitCreateEvent).toMatchSnapshot()
	})

	test('createVisitCreateEvent - throws error given a bad actor', () => {
		expect(() =>
			caliperEvents.createVisitCreateEvent({
				actor: { type: 'bad' }
			})
		).toThrow(`Invalid actor type. Must provide actor of type user`)
	})
})
