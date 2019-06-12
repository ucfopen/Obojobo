const Assessment = require('../assessment')
const DraftDocument = require('obojobo-express/models/draft')
const getAttempt = require('./get-attempt')

jest.mock('../assessment')
jest.mock('obojobo-express/models/draft')

describe('attempt-end', () => {
	test('get-attempt', async () => {
		const returnValue = await getAttempt('mockAttemptId')
		expect(Assessment.getAttemptNumber).toBeCalledTimes(1)
		expect(Assessment.getAttemptNumber).toBeCalledWith('mockUserId', 'mockDraftId', 'mockAttemptId')

		expect(DraftDocument.fetchById).toBeCalledTimes(1)
		expect(DraftDocument.fetchById).toBeCalledWith('mockDraftId')

		expect(returnValue).toMatchObject({
			assessmentId: 'mockAssessmentId',
			assessmentModel: 'mockChild',
			attemptState: 'mockState',
			draftId: 'mockDraftId',
			model: expect.anything(),
			number: 'mockAttemptNumber'
		})
	})
})
