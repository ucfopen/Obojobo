const { insertAttemptEndEvents, insertAttemptScoredEvents } = require('./insert-events')
const mockInsertEvent = require('obojobo-express/server/insert_event')

const mockCreateAssessmentAttemptSubmittedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
const mockCreateAssessmentAttemptScoredEvent = jest.fn().mockReturnValue('mockCaliperPayload')
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
		createAssessmentAttemptSubmittedEvent: args => mockCreateAssessmentAttemptSubmittedEvent(args)
	})
})

mockStaticDate()

describe('attempt-end/insert events', () => {
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
			caliperPayload: 'mockCaliperPayload',
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
			caliperPayload: 'mockCaliperPayload',
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
})
