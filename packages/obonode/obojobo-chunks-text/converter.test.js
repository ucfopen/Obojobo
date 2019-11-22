jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

describe('Text editor', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return null
				}
			},
			nodes: [
				{
					text: 'mockText',
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
						{
							leaves: [
								{
									text: 'mockText',
									marks: [
										{
											type: 'b',
											data: {}
										}
									]
								}
							]
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
			content: {
				textGroup: [
					{
						data: { indent: 1 },
						text: { value: 'mockText' }
					},
					{
						text: { value: 'mockText2' }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('switchType[HEADING_NODE] changes leaf blocks to heading nodes', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		const node = {
			key: 'mockKey',
			data: { get: () => ({}) },
			getLeafBlocksAtRange: () => [
				{ key: 'mockKey', data: { toJSON: () => ({}) } }
			]
		}

		Converter.switchType[HEADING_NODE](editor, node, { level: 1 })

		expect(editor.setNodeByKey).toHaveBeenCalled
	})
})
