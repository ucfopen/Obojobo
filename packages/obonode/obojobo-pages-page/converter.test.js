jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		}
	}
}))

import Converter from './converter'

describe('Page Converter', () => {
	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: { get: () => null },
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

	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
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
					type: 'oboeditor.component',
					nodes: [
						{
							type: 'mockNode'
						}
					]
				}
			]
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
