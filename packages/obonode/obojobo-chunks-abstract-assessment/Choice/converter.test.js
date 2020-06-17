jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	}
}))

import Converter from './converter'

import { MC_ANSWER_NODE, MC_CHOICE_NODE } from 'obojobo-chunks-multiple-choice-assessment/constants'
import { FEEDBACK_NODE } from '../constants'

describe('Choice editor', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			children: [
				{
					type: MC_ANSWER_NODE
				},
				{
					type: FEEDBACK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with type MC_CHOICE', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			children: [
				{
					type: MC_ANSWER_NODE
				},
				{
					type: FEEDBACK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode, MC_CHOICE_NODE)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: MC_ANSWER_NODE
				}
			],
			content: { triggers: 'mock-triggers' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with Feedback', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: MC_ANSWER_NODE
				},
				{
					type: FEEDBACK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			],
			content: { triggers: 'mock-triggers' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
