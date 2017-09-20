import MCChoice from '../../server/mcchoice'

describe('MCChoice', () => {
	const mcChoice = new MCChoice()
	const events = { onSendToAssessment: 'ObojoboDraft.Sections.Assessment:sendToAssessment' }

	it('sets score to 0 on send to assessment', () => {
		mcChoice.node.content = { score: 100 }
		mcChoice.yell(events.onSendToAssessment)
		expect(mcChoice.node.content.score).toBe(0)
	})
})
