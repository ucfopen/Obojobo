jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	},
	components: {
		Switch: jest.fn()
	}
}))

import Converter from './converter'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('QuestionBank converter', () => {
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
					data: {
						get: () => ({ chooseAll: true, choose: '100' })
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode without content', () => {
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
					data: {
						get: () => null
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
			content: { choose: null, triggers: 'mock-triggers' },
			children: [
				{
					type: QUESTION_BANK_NODE,
					id: 'mockKey',
					content: { choose: '1' },
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

	test('slateToObo sets "choose" to "all" if chooseAll is true', () => {
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
					data: {
						get: () => ({ chooseAll: true, choose: '99' })
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode.content).toEqual({
			choose: 'all'
		})
	})

	test('slateToObo sets "choose" to "1" if choose is an invalid value', () => {
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
					data: {
						get: () => ({ choose: 'some-value', chooseAll: false })
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode.content).toEqual({
			choose: '1'
		})
	})

	test('slateToObo sets "choose" to value if chooseAll is false', () => {
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
					data: {
						get: () => ({ choose: '99', chooseAll: false })
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode.content).toEqual({
			choose: '99'
		})
	})

	test('slateToObo sets "choose" to "1" if no content data exists', () => {
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
					data: {
						get: () => null
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode.content).toEqual({
			choose: '1'
		})
	})
})
