import { Transforms } from 'slate'

import Converter from './converter'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

describe('List Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: LIST_NODE,
			content: { listStyles: {} },
			children: [
				{
					type: LIST_NODE,
					subtype: LIST_LEVEL_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LINE_NODE,
							children: [{ text: 'mockText', b:true }]
						},
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockText', b:true }]
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

	test('oboToSlate converts an OboNode to a Slate node with a list style and triggers', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				triggers: 'mock-triggers',
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
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 1 }
			},
			isVoid: () => false
		}

		Converter.switchType[HEADING_NODE](editor, [editor.children[0], [0]], { headingLevel: 1 })

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ type: HEADING_NODE, content: { headingLevel: 1 }, subtype: null },
			{ at: [0, 0, 0] }
		)
	})

	test('switchType[CODE_NODE] changes leaf blocks to code nodes', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockLine1', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 1, 1, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		Converter.switchType[CODE_NODE](editor, [editor.children[0], [0]])

		expect(Transforms.insertNodes).toHaveBeenCalledWith(
			editor,
			expect.objectContaining({ type: CODE_NODE }),
			{ at: expect.any(Object) }
		)
	})

	test('switchType[TEXT_NODE] changes leaf blocks to code nodes', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockLine1', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 1, 1, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		Converter.switchType[TEXT_NODE](editor, [editor.children[0], [0]])

		expect(Transforms.insertNodes).toHaveBeenCalledWith(
			editor,
			expect.objectContaining({ type: TEXT_NODE }),
			{ at: expect.any(Object) }
		)
	})

	test('switchType[LIST_NODE] changes leaf blocks to ordered list nodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'unordered' }},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockLine1', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockLine1', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 1, 1, 0], offset: 1 }
			},
			isVoid: () => false
		}

		Converter.switchType[LIST_NODE](editor, [editor.children[0], [0]], { type: 'ordered', bulletStyle: 'alpha' })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('switchType[LIST_NODE] changes leaf blocks to unordered list nodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'unordered' }},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockLine1', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockLine1', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0, 1, 0, 0], offset: 1 },
				focus: { path: [0, 0, 1, 0, 0], offset: 1 }
			},
			isVoid: () => false
		}

		Converter.switchType[LIST_NODE](editor, [editor.children[0], [0]], { type: 'unordered', bulletStyle: 'disc' })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
