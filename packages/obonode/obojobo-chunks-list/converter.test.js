jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Converter from './converter'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

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
							return {}
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
						data: { indent: 5 }
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
						data: { indent: 5 }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('switchType[HEADING_NODE] changes leaf blocks to heading nodes', () => {
		const editor = {
			setNodeByKey: jest.fn(),
			value: {}
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

	test('switchType[CODE_NODE] changes leaf blocks to code nodes', () => {
		const editor = {
			focus: jest.fn(),
			removeNodeByKey: jest.fn(),
			value: {}
		}

		editor.replaceNodeByKey = jest.fn().mockReturnValue(editor)
		editor.moveToRangeOfNode = jest.fn().mockReturnValue(editor)
		const node = {
			key: 'mockKey',
			data: { get: () => ({}) },
			getLeafBlocksAtRange: () => ({
				// Mock the forEach call
				forEach: fn => {
					fn({ toJSON: () => ({ data: {}, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn({ toJSON: () => ({ data: {}, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
				},
				get: () => ({ key: 'mock-key'})
			})
		}

		Converter.switchType[CODE_NODE](editor, node)

		expect(editor.replaceNodeByKey).toHaveBeenCalled
	})

	test('switchType[TEXT_NODE] changes leaf blocks to code nodes', () => {
		const editor = {
			focus: jest.fn(),
			removeNodeByKey: jest.fn(),
			value: {}
		}

		editor.replaceNodeByKey = jest.fn().mockReturnValue(editor)
		editor.moveToRangeOfNode = jest.fn().mockReturnValue(editor)
		const node = {
			key: 'mockKey',
			data: { get: () => ({}) },
			getLeafBlocksAtRange: () => ({
				// Mock the forEach call
				forEach: fn => {
					fn({ toJSON: () => ({ data: {}, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn({ toJSON: () => ({ data: {}, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
				},
				get: () => ({ key: 'mock-key'})
			})
		}

		Converter.switchType[TEXT_NODE](editor, node)

		expect(editor.replaceNodeByKey).toHaveBeenCalled
	})
})
