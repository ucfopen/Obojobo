jest.setMock('obojobo-express/models/draft_node', require('obojobo-document-engine/__mocks__/models/draft_node'))

let MCChoice
let mcChoice

describe('MCChoice', () => {

	beforeEach(() => {
		MCChoice = require('./mcchoice')
		mcChoice = new MCChoice()
	})

	test('nodeName is expected value', () => {
		expect(MCChoice.nodeName).toBe('ObojoboDraft.Chunks.MCChoice')
	})

	test('registers expected events', () => {
		expect(mcChoice.registerEvents).toHaveBeenCalledWith({
			'ObojoboDraft.Sections.Assessment:sendToAssessment': mcChoice.onSendToAssessment
		})

	})

	test('onSendToAssessment sets score to 0', () => {
		mcChoice.node.content = { score: 100 }
		mcChoice.onSendToAssessment()
		expect(mcChoice.node.content.score).toBe(0)
	})
})
