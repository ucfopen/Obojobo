jest.mock('Common', () => ({
	Store: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	}
}))

import Converter from 'ObojoboDraft/Chunks/QuestionBank/converter'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('QuestionBank editor', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: QUESTION_BANK_NODE,
					key: 'mockKey',
					data: {
						get: () => null
					},
					nodes: []
				},
				{
					type: QUESTION_NODE
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						first: () => ({ text: 'mockText' }),
						last: () => ({
							data: {
								get: () => false
							}
						})
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { choose: Infinity },
			children: [
				{
					type: QUESTION_BANK_NODE,
					id: 'mockKey',
					content: { choose: 1 },
					children: [
						{
							type: 'mockQuestionNode'
						}
					]
				},
				{
					type: 'mockQuestionNode'
				}
			]
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
