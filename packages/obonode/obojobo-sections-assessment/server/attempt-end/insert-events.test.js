const {
	insertAttemptEndEvents,
	insertAttemptScoredEvents,
	insertAttemptImportedEvents
} = require('./insert-events')
const mockInsertEvent = require('obojobo-express/server/insert_event')

const mockCreateAssessmentAttemptSubmittedEvent = jest
	.fn()
	.mockReturnValue('mockSubmitCaliperPayload')
const mockCreateAssessmentAttemptScoredEvent = jest.fn().mockReturnValue('mockScoreCaliperPayload')
const mockCreateAssessmentAttemptImportedEvent = jest
	.fn()
	.mockReturnValue('mockImportCaliperPayload')
const mockGetLatestHighestAssessmentScoreRecord = jest
	.fn()
	.mockResolvedValue({ score: 'mockHighestAssessmentScore' })

const mockUser = { id: 'mockUserId' }
const mockDraftDocument = {
	contentId: 'mockContentId',
	draftId: 'mockDraftId'
}

jest.mock('obojobo-express/server/lti', () => ({
	getLatestHighestAssessmentScoreRecord: function() {
		return mockGetLatestHighestAssessmentScoreRecord.apply(null, arguments)
	}
}))
jest.mock('obojobo-express/server/insert_event')
jest.mock('obojobo-express/server/routes/api/events/create_caliper_event', () => {
	return () => ({
		createAssessmentAttemptScoredEvent: args => mockCreateAssessmentAttemptScoredEvent(args),
		createAssessmentAttemptSubmittedEvent: args => mockCreateAssessmentAttemptSubmittedEvent(args),
		createAssessmentAttemptImportedEvent: args => mockCreateAssessmentAttemptImportedEvent(args)
	})
})

mockStaticDate()

describe('attempt-end/insert events', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('insertAttemptEndEvents', async () => {
		await insertAttemptEndEvents(
			mockUser,
			mockDraftDocument,
			'mockAssessmentId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockIsPreview',
			'mockHostName',
			'mockRemoteAddress'
		)
		expect(mockCreateAssessmentAttemptSubmittedEvent).toBeCalledWith({
			actor: { type: 'user', id: 'mockUserId' },
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId'
		})
		expect(mockInsertEvent).toBeCalledWith({
			action: 'assessment:attemptEnd',
			actorTime: '2016-09-22T16:57:14.500Z',
			caliperPayload: 'mockSubmitCaliperPayload',
			contentId: 'mockContentId',
			draftId: 'mockDraftId',
			eventVersion: '1.2.0',
			ip: 'mockRemoteAddress',
			isPreview: 'mockIsPreview',
			metadata: {},
			payload: { attemptCount: 'mockAttemptNumber', attemptId: 'mockAttemptId' },
			userId: 'mockUserId'
		})
	})

	test('insertAttemptScoredEvents', async () => {
		await insertAttemptScoredEvents(
			mockUser,
			mockDraftDocument,
			'mockAssessmentId',
			'mockAssessmentScoreId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockAttemptScore',
			'mockAssessmentScore',
			'mockIsPreview',
			'mockLtiScoreSent',
			'mockLtiScoreStatus',
			'mockLtiStatusDetails',
			'mockLtiGradebookStatus',
			'mockLtiAssessmentScoreId',
			'mockHostname',
			'mockRemoteAddress',
			'mockScoreDetails',
			'mockResourceLinkId'
		)
		expect(mockGetLatestHighestAssessmentScoreRecord).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockResourceLinkId',
			'mockIsPreview'
		)
		expect(mockCreateAssessmentAttemptScoredEvent).toBeCalledWith({
			actor: { type: 'serverApp' },
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId',
			attemptScore: 'mockAttemptScore',
			contentId: 'mockContentId',
			draftId: 'mockDraftId',
			extensions: {
				assessmentScore: 'mockAssessmentScore',
				attemptCount: 'mockAttemptNumber',
				attemptScore: 'mockAttemptScore',
				highestAssessmentScore: 'mockHighestAssessmentScore',
				ltiScoreSent: 'mockLtiScoreSent'
			}
		})
		expect(mockInsertEvent).toBeCalledWith({
			action: 'assessment:attemptScored',
			actorTime: '2016-09-22T16:57:14.500Z',
			caliperPayload: 'mockScoreCaliperPayload',
			contentId: 'mockContentId',
			draftId: 'mockDraftId',
			eventVersion: '2.1.0',
			ip: 'mockRemoteAddress',
			isPreview: 'mockIsPreview',
			metadata: {},
			payload: {
				assessmentScore: 'mockAssessmentScore',
				assessmentScoreId: 'mockAssessmentScoreId',
				attemptCount: 'mockAttemptNumber',
				attemptId: 'mockAttemptId',
				attemptScore: 'mockAttemptScore',
				highestAssessmentScore: 'mockHighestAssessmentScore',
				ltiAssessmentScoreId: 'mockLtiAssessmentScoreId',
				ltiGradeBookStatus: 'mockLtiGradebookStatus',
				ltiScoreSent: 'mockLtiScoreSent',
				ltiScoreStatus: 'mockLtiScoreStatus',
				ltiStatusDetails: 'mockLtiStatusDetails',
				scoreDetails: 'mockScoreDetails'
			},
			userId: 'mockUserId'
		})
	})

	test('insertAttemptImportedEvents', async () => {
		await insertAttemptImportedEvents(
			'mock-userId',
			'mock-draftId',
			'mock-contentId',
			'mock-assessmentId',
			'mock-attemptId',
			'mock-scoreId',
			'mock-originalAttemptId',
			'mock-originalScoreId',
			'mock-isPreview',
			'mock-ltiScoreSent',
			'mock-ltiScoreStatus',
			'mock-ltiStatusDetails',
			'mock-ltiGradeBookStatus',
			'mock-ltiAssessmentScoreId',
			'mock-hostname',
			'mock-remoteAddress',
			'mock-resourceLinkId'
		)

		expect(mockCreateAssessmentAttemptImportedEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "actor": Object {
		    "id": "mock-userId",
		    "type": "user",
		  },
		  "assessmentId": "mock-assessmentId",
		  "attemptId": "mock-attemptId",
		  "contentId": "mock-contentId",
		  "draftId": "mock-draftId",
		  "originalAttemptId": "mock-originalAttemptId",
		  "originalScoreId": "mock-originalScoreId",
		  "resourceLinkId": "mock-resourceLinkId",
		}
	`)
		expect(mockInsertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptEnd",
		  "actorTime": "2016-09-22T16:57:14.500Z",
		  "caliperPayload": "mockImportCaliperPayload",
		  "contentId": "mock-contentId",
		  "draftId": "mock-draftId",
		  "eventVersion": "1.1.0",
		  "ip": "mock-remoteAddress",
		  "isPreview": "mock-isPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "attemptCount": 1,
		    "attemptId": "mock-attemptId",
		    "originalAttemptId": "mock-originalAttemptId",
		    "originalScoreId": "mock-originalScoreId",
		    "resourceLinkId": "mock-resourceLinkId",
		  },
		  "userId": "mock-userId",
		}
	`)
	})
})
