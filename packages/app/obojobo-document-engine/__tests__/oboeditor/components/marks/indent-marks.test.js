import { Transforms } from 'slate'
jest.mock('slate-react')

import IndentMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/indent-marks'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('IndentMarks', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('indentText indents a text block', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.indentText(editor, [{},[0]])

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('indentText indents a code block', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: CODE_NODE,
					children: [
						{
							type: CODE_NODE,
							subtype: CODE_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.indentCode(editor, [{},[0]])

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('indentList indents an ordered list block', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: LIST_NODE,
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'ordered', bulletStyle: 'alpha' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: { indent: 0 }, 
									children: [{ text: 'mockText' }]
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
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.indentList(editor, [{}, [0]])

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('indentList indents an unordered list block', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: LIST_NODE,
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: { indent: 0 }, 
									children: [{ text: 'mockText' }]
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
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.indentList(editor, [{},[0]])

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('unindentText unindents a text block', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.unindentText(editor, [{}, [0]])

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('unindentCode unindents a code block', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: CODE_NODE,
					children: [
						{
							type: CODE_NODE,
							subtype: CODE_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.unindentCode(editor, [{}, [0]])

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('unindentList unindents a list block', () => {
		jest.spyOn(Transforms, 'liftNodes').mockImplementation((editor, opts) => {
			opts.match({
				type: LIST_NODE,
				subtype: LIST_LINE_NODE,
				content: { indent: 0 }, 
				children: [{ text: 'mockText' }]
			})
		})
		const editor = {
			children: [
				{
					type: LIST_NODE,
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: { indent: 0 }, 
									children: [{ text: 'mockText' }]
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
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.plugins.commands.unindentList(editor, [{},[0]])

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('the action in the indent and unindent marks call editor.indent[Type] or editor.unindent[Type]', () => {
		const editor = {
			indentCode: jest.fn(),
			indentList: jest.fn(),
			indentText: jest.fn(),
			unindentCode: jest.fn(),
			unindentList: jest.fn(),
			unindentText: jest.fn(),
			children: [
				{
					type: LIST_NODE,
					children: [{ text: 'mockText' }]
				},
				{
					type: TEXT_NODE,
					children: [{ text: 'mockText' }]
				},
				{
					type: CODE_NODE,
					children: [{ text: 'mockText' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [2, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		IndentMarks.marks.forEach(mark => {
			if (mark.type !== 'hanging-indent') mark.action(editor)
		})

		expect(editor.indentText).toHaveBeenCalledTimes(1)
		expect(editor.indentCode).toHaveBeenCalledTimes(1)
		expect(editor.indentList).toHaveBeenCalledTimes(1)
		expect(editor.unindentText).toHaveBeenCalledTimes(1)
		expect(editor.unindentCode).toHaveBeenCalledTimes(1)
		expect(editor.unindentList).toHaveBeenCalledTimes(1)
	})

	test("the hanging indent mark action toggles the given block's data.hangingIndent property to false if it starts at true and calls editor.setNodeByKey", () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		//is there a better way of doing this?
		IndentMarks.marks.forEach(mark => {
			if (mark.type === 'hanging-indent') {
				mark.action(editor)
			}
		})

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
