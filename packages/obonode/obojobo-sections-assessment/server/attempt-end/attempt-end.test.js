jest.mock('./get-attempt', () => jest.fn().mockResolvedValue())
jest.mock('obojobo-express/logger')

const endAttempt = require('./attempt-end')
const getAttempt = require('./get-attempt')
const helpers = require('./attempt-end-helpers')
const logger = require('obojobo-express/logger')

const mockArgs = {
	attemptId: 'mockAttemptId',
	user: {
		id: 'mockUserId'
	},
	isPreview: 'mockIsPreview'
}

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
		await endAttempt(mockArgs)
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
		expect(getAttempt).toBeCalledWith('mockAttemptId')
		// ensures called and called in order
		expect(executionOrder).toEqual([
			'getAttemptHistory',
			'getResponsesForAttempt',
			'getCalculatedScores',
			'completeAttempt',
			'insertAttemptEndEvents',
			'sendHighestAssessmentScore',
			'insertAttemptScoredEvents',
			'getAttempts'
		])
	})
})
