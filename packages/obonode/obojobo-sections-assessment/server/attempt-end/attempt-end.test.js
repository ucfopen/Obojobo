jest.mock('./attempt-end-helpers')
jest.mock('obojobo-express/server/logger')

const endAttempt = require('./attempt-end')

const helpers = require('./attempt-end-helpers')
const logger = require('obojobo-express/server/logger')

const mockReq = {
	params: {
		attemptId: 'mockAttemptId'
	},
	currentUser: {
		id: 'mockUserId'
	},
	isPreview: 'mockIsPreview'
}

const mockRes = {}

const executionOrder = []
const handlePromise = name => {
	executionOrder.push(name)
	return () => Promise.resolve()
}

const spies = {}
for (const name in helpers) {
	spies[name] = jest.spyOn(helpers, name).mockImplementation(handlePromise(name))
}

describe('attempt-end/attempt-end', () => {
	test('runs through expected steps', async () => {
		await endAttempt(mockReq, mockRes)
		expect(logger.info.mock.calls).toEqual([
			['End attempt "mockAttemptId" begin for user "mockUserId" (Preview="mockIsPreview")'],
			['End attempt "mockAttemptId" - getAttempt success'],
			['End attempt "mockAttemptId" - getAttemptHistory success'],
			['End attempt "mockAttemptId" - getResponsesForAttempt success'],
			['End attempt "mockAttemptId" - getCalculatedScores success'],
			['End attempt "mockAttemptId" - completeAttempt success'],
			['End attempt "mockAttemptId" - insertAttemptEndEvent success'],
			['End attempt "mockAttemptId" - sendLTIScore success'],
			['End attempt "mockAttemptId" - sendLTIScore success']
		])

		// ensures called and called in order
		expect(executionOrder).toEqual([
			'getAttempt',
			'getAttemptHistory',
			'getResponsesForAttempt',
			'getCalculatedScores',
			'completeAttempt',
			'insertAttemptEndEvents',
			'sendHighestAssessmentScore',
			'insertAttemptScoredEvents',
			'getAttempts'
		])

		// ensure res and req was sent to them all
		for (const name in helpers) {
			expect(spies[name]).toBeCalledWith(mockReq, mockRes)
		}
	})
})
