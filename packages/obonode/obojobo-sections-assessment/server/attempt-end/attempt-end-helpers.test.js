const helpers = require('./attempt-end-helpers')
const lti = require('obojobo-express/lti')
const Assessment = require('../assessment')
const getCalculatedScores = require('./get-calculated-scores')
const insertEvents = require('./insert-events')

jest.mock('obojobo-express/logger')
jest.mock('../assessment')
jest.mock('./get-calculated-scores')
jest.mock('./insert-events')
jest.mock('obojobo-express/lti')

const mockArgs = {
	attempt: {
		draftId: 'mockDraftId',
		assessmentId: 'mockAssessmentId',
		assessmentModel: 'mockAssessmentModel',
		attemptState: 'mockAttemptState',
		number: 'mockNumber'
	},
	attemptHistory: 'mockAttemptHistory',
	attemptId: 'mockAttemptId',
	assessmentScoreId: 'mockAssessmentScoreId',
	calculatedScores: {
		attempt: { attemptScore: 'mockAttemptScore' },
		assessmentScoreDetails: {
			assessmentModdedScore: 'mockAssessmentModdedScore'
		}
	},
	ltiRequest: {
		gradebookStatus: 'mockGradebookStatus',
		ltiAssessmentScoreId: 'mockLtiAssessmentScoreId',
		scoreSent: 'mockScoreSent',
		status: 'mockStatus',
		statusDetails: 'mockStatusDetails'
	},
	isPreview: 'mockIsPreview',
	req: {
		hostname: 'mockHostName',
		connection: {
			remoteAddress: 'mockRemoteAddress'
		}
	},
	res: 'mockRes',
	responsesForAttempt: 'mockResponsesForAttempt',
	user: { id: 'mockUserId' },
	draftDocument: { contentId: 'mockContentId' }
}

describe('attempt-end/attempt-end-helpers', () => {
	test('getAttemptHistory', async () => {
		await helpers.getAttemptHistory(mockArgs)
		expect(Assessment.getCompletedAssessmentAttemptHistory).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockIsPreview'
		)
	})

	test('getResponsesForAttempt', async () => {
		await helpers.getResponsesForAttempt(mockArgs)
		expect(Assessment.getResponsesForAttempt).toBeCalledWith('mockAttemptId')
	})

	test('getCalculatedScores', async () => {
		await helpers.getCalculatedScores(mockArgs)
		expect(getCalculatedScores).toBeCalledWith(
			{
				hostname: 'mockHostName',
				connection: {
					remoteAddress: 'mockRemoteAddress'
				}
			},
			'mockRes',
			'mockAssessmentModel',
			'mockAttemptState',
			'mockAttemptHistory',
			'mockResponsesForAttempt'
		)
	})

	test('completeAttempt', async () => {
		await helpers.completeAttempt(mockArgs)
		expect(Assessment.completeAttempt).toBeCalledWith(
			'mockAssessmentId',
			'mockAttemptId',
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			{ attemptScore: 'mockAttemptScore' },
			{
				assessmentModdedScore: 'mockAssessmentModdedScore'
			},
			'mockIsPreview'
		)
	})

	test('insertAttemptEndEvents', async () => {
		await helpers.insertAttemptEndEvents(mockArgs)
		expect(insertEvents.insertAttemptEndEvents).toBeCalledWith(
			{
				id: 'mockUserId'
			},
			{
				contentId: 'mockContentId'
			},
			'mockAssessmentId',
			'mockAttemptId',
			'mockNumber',
			'mockIsPreview',
			'mockHostName',
			'mockRemoteAddress'
		)
	}),
		test('sendHighestAssessmentScore', async () => {
			await helpers.sendHighestAssessmentScore(mockArgs)
			expect(lti.sendHighestAssessmentScore).toBeCalledWith(
				'mockUserId',
				{ contentId: 'mockContentId' },
				'mockAssessmentId',
				'mockIsPreview'
			)
		})

	test('insertAttemptScoredEvents', async () => {
		await helpers.insertAttemptScoredEvents(mockArgs)
		expect(insertEvents.insertAttemptScoredEvents).toBeCalledWith(
			{ id: 'mockUserId' },
			{ contentId: 'mockContentId' },
			'mockAssessmentId',
			'mockAssessmentScoreId',
			'mockAttemptId',
			'mockNumber',
			'mockAttemptScore',
			'mockAssessmentModdedScore',
			'mockIsPreview',
			'mockScoreSent',
			'mockStatus',
			'mockStatusDetails',
			'mockGradebookStatus',
			'mockLtiAssessmentScoreId',
			'mockHostName',
			'mockRemoteAddress',
			{ assessmentModdedScore: 'mockAssessmentModdedScore' }
		)
	})

	test('getAttempts', async () => {
		await helpers.getAttempts(mockArgs)
		expect(Assessment.getAttempts).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockIsPreview',
			'mockAssessmentId'
		)
	})
})
