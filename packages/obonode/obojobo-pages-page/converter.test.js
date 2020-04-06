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

describe('Page Converter', () => {
	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			children: [
				{
					type: 'oboeditor.component',
					children: [
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
					type: 'oboeditor.component',
					children: [
						{
							type: 'mockNode'
						}
					]
				}
			],
			content: {
				triggers: 'mock-triggers'
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
