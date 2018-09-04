/* eslint no-undefined: 0 */

import Question from '../../server/question'

describe('Question', () => {
	const question = new Question({}, { id: 'mockQuestion' }, {})
	const currentAttempt = { addScore: jest.fn() }

	test('registers expected events', () => {
		expect(question.registerEvents).toHaveBeenCalledTimes(1)
		const events = question.registerEvents.mock.calls[0][0]
		expect(question.registerEvents.mock.calls[0]).toMatchSnapshot()
		expect(events['ObojoboDraft.Sections.Assessment:sendToAssessment']).toBe(
			question.onSendToAssessment
		)
		expect(events['ObojoboDraft.Sections.Assessment:attemptEnd']).toBe(question.onAttemptEnd)
	})

	test('disables practice on send to assessment', () => {
		question.node.content = { mode: 'practice' }
		question.onSendToAssessment()
		expect(question.node.content.mode).toBe('assessment')
	})

	test("returns if assessment doesn't contain 'this' node on attempt end", () => {
		const mockAssessment = { contains: () => false }
		const res = question.onAttemptEnd({}, {}, mockAssessment, {}, currentAttempt)
		expect(res).toBe(undefined)
		expect(question.yell).not.toHaveBeenCalled()
	})

	test('returns if there are no question responses', () => {
		const mockAssessment = { contains: () => true }

		const res = question.onAttemptEnd({}, {}, mockAssessment, [], currentAttempt)
		expect(res).toEqual(undefined)
		expect(question.yell).not.toHaveBeenCalled()
	})

	test('emits calculate score event when necessary', () => {
		const mockAssessment = { contains: () => true }
		const responseHistory = [{ question_id: question.node.id }]

		const res = {
			app: {}
		}

		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
		question.onAttemptEnd(res, {}, mockAssessment, responseHistory, currentAttempt)
		expect(question.yell).toHaveBeenCalled()
		expect(question.yell.mock.calls[0]).toMatchSnapshot()

		// now let's test the yell function
		const scoreYellFunc = question.yell.mock.calls[0][4]
		scoreYellFunc(50)
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 50)
	})

	test('throws error if given non-unique question response rows', () => {
		const mockAssessment = { contains: () => true }

		const responseRecord = { question_id: question.node.id }
		const responseRecord2 = { question_id: question.node.id }
		const responseHistory = [responseRecord, responseRecord2]

		expect(() => {
			question.onAttemptEnd({}, {}, mockAssessment, responseHistory, currentAttempt)
		}).toThrowError('Impossible response to MCAssessment question')
	})
})
