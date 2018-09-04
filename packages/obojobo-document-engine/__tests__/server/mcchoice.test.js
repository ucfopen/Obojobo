import MCChoice from '../../server/mcchoice'

describe('MCChoice', () => {
	const mcChoice = new MCChoice()

	test('registers expected events', () => {
		expect(mcChoice.registerEvents).toHaveBeenCalledTimes(1)
		let register = mcChoice.registerEvents.mock.calls[0]
		expect(register).toMatchSnapshot()
		expect(register[0]['ObojoboDraft.Sections.Assessment:sendToAssessment']).toBe(
			mcChoice.onSendToAssessment
		)
	})

	test('onSendToAssessment sets score to 0', () => {
		mcChoice.node.content = { score: 100 }
		mcChoice.onSendToAssessment()
		expect(mcChoice.node.content.score).toBe(0)
	})
})
