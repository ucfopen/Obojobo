jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: type => ({
			slateToObo: () => ({
				slateToOboReturnFor: type
			}),
			oboToSlate: type => ({
				oboToSlateReturnFor: type
			})
		})
	}
}))

jest.mock('obojobo-document-engine/src/scripts/oboeditor/components/node/editor', () => ({
	helpers: {
		slateToObo: child => ({
			componentSlateToOboReturnFor: child
		}),
		oboToSlate: child => ({
			componentOboToSlateReturnFor: child
		})
	}
}))

import Converter from './converter'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('MCFeedback Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: 'oboeditor.component',
					nodes: [
						{
							type: 'mockNode'
						}
					]
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
			children: [
				{
					type: BREAK_NODE
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
