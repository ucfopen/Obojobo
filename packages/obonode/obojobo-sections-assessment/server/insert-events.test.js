const {
	insertAttemptEndEvents,
	insertAttemptScoredEvents,
	insertAttemptInvalidatedEvent
} = require('./insert-events')
const mockInsertEvent = require('obojobo-express/server/insert_event')
const mockGetLatestHighestAssessmentScoreRecord = jest
	.fn()
	.mockResolvedValue({ score: 'mockHighestAssessmentScore' })
const insert_event = require('obojobo-express/server/insert_event')

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

mockStaticDate()

describe('attempt-end/insert events', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('insertAttemptEndEvents when not importing', async () => {
		await insertAttemptEndEvents(
			mockUser.id,
			mockDraftDocument.draftId,
			mockDraftDocument.contentId,
			'mockAssessmentId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockIsPreview',
			'mockHostName',
			'mockRemoteAddress',
			'mockVisitId'
		)

		expect(mockInsertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptEnd",
		  "actorTime": "2016-09-22T16:57:14.500Z",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "1.3.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		    "imported": false,
		    "originalAttemptId": null,
		    "originalScoreId": null,
		  },
		  "userId": "mockUserId",
		  "visitId": "mockVisitId",
		}
	`)
	})

	test('insertAttemptEndEvents when importing', async () => {
		await insertAttemptEndEvents(
			mockUser.id,
			mockDraftDocument.draftId,
			mockDraftDocument.contentId,
			'mockAssessmentId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockIsPreview',
			'mockHostName',
			'mockRemoteAddress',
			'mockVisitId',
			'mockOriginalAttemptId',
			'mockOriginalScoreId'
		)

		expect(mockInsertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptEnd",
		  "actorTime": "2016-09-22T16:57:14.500Z",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "1.3.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		    "imported": true,
		    "originalAttemptId": "mockOriginalAttemptId",
		    "originalScoreId": "mockOriginalScoreId",
		  },
		  "userId": "mockUserId",
		  "visitId": "mockVisitId",
		}
	`)
	})

	test('insertAttemptScoredEvents without imported scores', async () => {
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
			'mockResourceLinkId',
			'mockVisitId'
		)

		expect(mockGetLatestHighestAssessmentScoreRecord).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockResourceLinkId',
			'mockIsPreview'
		)

		expect(mockInsertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptScored",
		  "actorTime": "2016-09-22T16:57:14.500Z",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "2.2.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "assessmentScore": "mockAssessmentScore",
		    "assessmentScoreId": "mockAssessmentScoreId",
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		    "attemptScore": "mockAttemptScore",
		    "highestAssessmentScore": "mockHighestAssessmentScore",
		    "imported": false,
		    "ltiAssessmentScoreId": "mockLtiAssessmentScoreId",
		    "ltiGradeBookStatus": "mockLtiGradebookStatus",
		    "ltiScoreSent": "mockLtiScoreSent",
		    "ltiScoreStatus": "mockLtiScoreStatus",
		    "ltiStatusDetails": "mockLtiStatusDetails",
		    "originalAttemptId": null,
		    "originalScoreId": null,
		    "scoreDetails": "mockScoreDetails",
		  },
		  "userId": "mockUserId",
		  "visitId": "mockVisitId",
		}
	`)
	})

	test('insertAttemptScoredEvents with imported scores', async () => {
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
			'mockResourceLinkId',
			'mockVisitId',
			'mockOriginalAttemptId',
			'mockOriginalScoreId'
		)

		expect(mockGetLatestHighestAssessmentScoreRecord).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockResourceLinkId',
			'mockIsPreview'
		)

		expect(mockInsertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptScored",
		  "actorTime": "2016-09-22T16:57:14.500Z",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "2.2.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "assessmentScore": "mockAssessmentScore",
		    "assessmentScoreId": "mockAssessmentScoreId",
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		    "attemptScore": "mockAttemptScore",
		    "highestAssessmentScore": "mockHighestAssessmentScore",
		    "imported": true,
		    "ltiAssessmentScoreId": "mockLtiAssessmentScoreId",
		    "ltiGradeBookStatus": "mockLtiGradebookStatus",
		    "ltiScoreSent": "mockLtiScoreSent",
		    "ltiScoreStatus": "mockLtiScoreStatus",
		    "ltiStatusDetails": "mockLtiStatusDetails",
		    "originalAttemptId": "mockOriginalAttemptId",
		    "originalScoreId": "mockOriginalScoreId",
		    "scoreDetails": "mockScoreDetails",
		  },
		  "userId": "mockUserId",
		  "visitId": "mockVisitId",
		}
	`)
	})

	test('attemptInvalidated event calls insertEvent with expected data', async () => {
		await insertAttemptInvalidatedEvent(
			'mockAttemptId',
			'mockUserId',
			'mockVisitId',
			'mockDraftId',
			'mockContentId',
			'mockRemoteAddress',
			'mockIsPreview'
		)
		expect(insert_event).toHaveBeenCalledWith({
			action: 'assessment:attemptInvalidated',
			actorTime: '2016-09-22T16:57:14.500Z',
			payload: {
				attemptId: 'mockAttemptId'
			},
			userId: 'mockUserId',
			ip: 'mockRemoteAddress',
			visitId: 'mockVisitId',
			metadata: {},
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			eventVersion: '1.0.0',
			isPreview: 'mockIsPreview'
		})
	})
})
