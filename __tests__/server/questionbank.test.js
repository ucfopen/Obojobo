import QuestionBank from '../../server/questionbank'

describe('QuestionBank', () => {
	const questionBank = new QuestionBank()
	const events = {
		onSendToClient: 'ObojoboDraft.Sections.Assessment:sendToClient',
		onAttemptStart: 'ObojoboDraft.Sections.Assessment:attemptStart'
	}

	it('has empty children array on send to client event', () => {
		questionBank.children = ['test']
		questionBank.yell(events.onSendToClient)
		expect(questionBank.children).toEqual([])
	})

	it.skip('handles attempt start event', () => {
		// TODO: Test this functionality once the code is in use (in express.js)
	})
})
