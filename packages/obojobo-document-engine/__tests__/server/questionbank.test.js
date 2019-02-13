/* eslint no-undefined: 0 */

import QuestionBank from '../../server/questionbank'

describe('QuestionBank', () => {
	const questionBank = new QuestionBank({}, { id: 'mockQuestionBank' }, {})

	test('registers expected events', () => {
		expect(questionBank.registerEvents).toHaveBeenCalledTimes(1)
		const events = questionBank.registerEvents.mock.calls[0][0]
		expect(questionBank.registerEvents.mock.calls[0]).toMatchSnapshot()
		expect(events['ObojoboDraft.Sections.Assessment:sendToClient']).toBe(
			questionBank.onSendToClient
		)
	})

	test('removes children on sendToClient', () => {
		questionBank.children = 'mockChildren'
		questionBank.onSendToClient()
		expect(questionBank.children).toEqual([])
	})
})
