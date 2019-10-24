import IndentMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/indent-marks'

const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('IndentMarks', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('indentText indents a text block', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const block = { data: { toJSON: () => ({}) }, key: 'mockKey' }

		IndentMarks.plugins.queries.indentText(editor, block)

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('indentCode indents a code block', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const block = { data: { toJSON: () => ({ content: {} }) }, key: 'mockKey' }

		IndentMarks.plugins.queries.indentCode(editor, block)

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('indentList indents an ordered list block', () => {
		const editor = {
			wrapBlockByKey: jest.fn(),
			value: {
				document: {
					getClosest: () => ({
						data: {
							get: () => ({
								bulletStyle: 'decimal',
								type: 'ordered'
							})
						}
					})
				}
			}
		}

		const block = { data: { toJSON: () => ({ content: {} }) }, key: 'mockKey' }

		IndentMarks.plugins.queries.indentList(editor, block)

		expect(editor.wrapBlockByKey).toHaveBeenCalledTimes(1)
	})

	test('indentList indents an unordered list block', () => {
		const editor = {
			wrapBlockByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, funct) => {
						funct({ type: LIST_LEVEL_NODE })
						return {
							data: {
								get: () => ({
									bulletStyle: 'disc',
									type: 'unordered'
								})
							}
						}
					}
				}
			}
		}

		const block = { data: { toJSON: () => ({ content: {} }) }, key: 'mockKey' }

		IndentMarks.plugins.queries.indentList(editor, block)

		expect(editor.wrapBlockByKey).toHaveBeenCalledTimes(1)
	})

	test('unindentText unindents a text block', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const block = { data: { toJSON: () => ({}) }, key: 'mockKey' }

		IndentMarks.plugins.queries.unindentText(editor, block)

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('unindentCode unindents a code block', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const block = { data: { toJSON: () => ({ content: {} }) }, key: 'mockKey' }

		IndentMarks.plugins.queries.unindentCode(editor, block)

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('unindentList unindents a list block', () => {
		const editor = {
			unwrapNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: () => ({
						data: {
							get: () => ({
								bulletStyle: 'disc',
								type: 'unordered'
							})
						}
					})
				}
			}
		}

		const block = { data: { toJSON: () => ({ content: {} }) }, key: 'mockKey' }

		IndentMarks.plugins.queries.unindentList(editor, block)

		expect(editor.unwrapNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('the action in each mark calls editor.indent[Type] or editor.unindent[Type]', () => {
		const editor = {
			indentCode: jest.fn(),
			indentList: jest.fn(),
			indentText: jest.fn(),
			unindentCode: jest.fn(),
			unindentList: jest.fn(),
			unindentText: jest.fn(),
			value: {
				blocks: [
					{ type: CODE_LINE_NODE },
					{ type: LIST_LINE_NODE },
					{ type: 'text node'}
				]
			}
		}

		IndentMarks.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(editor.indentText).toHaveBeenCalledTimes(1)
		expect(editor.indentCode).toHaveBeenCalledTimes(1)
		expect(editor.indentList).toHaveBeenCalledTimes(1)
		expect(editor.unindentText).toHaveBeenCalledTimes(1)
		expect(editor.unindentCode).toHaveBeenCalledTimes(1)
		expect(editor.unindentList).toHaveBeenCalledTimes(1)
	})
})

