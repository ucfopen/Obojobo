jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Converter from './converter'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('List Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { listStyles: {} }
				}
			},
			text: 'mockText',
			nodes: [
				{
					type: LIST_LEVEL_NODE,
					data: {
						get: () => {
							return { }
						}
					},
					nodes: [
						{
							text: 'mockText',
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
						},
						{
							type: LIST_LEVEL_NODE,
							data: {
								get: () => {
									return {}
								}
							},
							nodes: [
								{
									text: 'mockText',
									nodes: []
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
				listStyles: {},
				textGroup: [
					{
						text: { value: 'mockLine1' }
					},
					{
						text: { value: 'mockLine1' },
						data: { indent: 5, hangingIndent: false }
					},
					{
						text: { value: 'mockLine2' }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a list style', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				listStyles: {
					type: 'unordered',
					indents: {}
				},
				textGroup: [
					{
						text: { value: 'mockLine1' }
					},
					{
						text: { value: 'mockLine2' }
					},
					{
						text: { value: 'mockLine3' },
						data: { indent: 5, hangingIndent: false }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
