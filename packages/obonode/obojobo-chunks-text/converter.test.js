jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

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

	test('slateToObo converts a Slate node to an OboNode with triggers', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { triggers: 'mock-triggers' }
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
				triggers: 'mock-triggers',
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

	test('switchType[LIST_NODE] changes leaf blocks to unordered list nodes', () => {
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
					fn({ toJSON: () => ({ data: { indent: 1 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn({ toJSON: () => ({ data: { indent: 1 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
				},
				reduce: fn => {
					fn(20, { toJSON: () => ({ data: { indent: 0 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn(0, { toJSON: () => ({ data: { indent: 0 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
					return 0
				},
				get: () => ({ key: 'mock-key'})
			})
		}

		Converter.switchType[LIST_NODE](editor, node, { type: 'unordered', bulletStyle: 'disc'})

		expect(editor.replaceNodeByKey).toHaveBeenCalled
	})

	test('switchType[LIST_NODE] changes leaf blocks to ordered list nodes', () => {
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
					fn({ toJSON: () => ({ data: { indent: 1 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn({ toJSON: () => ({ data: { indent: 1 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
				},
				reduce: fn => {
					fn(20, { toJSON: () => ({ data: { indent: 0 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 0)
					fn(0, { toJSON: () => ({ data: { indent: 0 }, object: 'block', key: 'mock-key'}), key: "mock-key"}, 1)
					return 0
				},
				get: () => ({ key: 'mock-key'})
			})
		}

		Converter.switchType[LIST_NODE](editor, node, { type: 'ordered', bulletStyle: 'disc'})

		expect(editor.replaceNodeByKey).toHaveBeenCalled
	})
})
