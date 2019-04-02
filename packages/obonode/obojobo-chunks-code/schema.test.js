import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID, CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

import Schema from './schema'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

describe('Code Schema', () => {
	test('data checks for content', () => {
		expect(Schema.blocks[CODE_LINE_NODE].data.content('mockContent')).toEqual(true)
	})
	test('normalize fixes invalid data', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_LINE_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey' }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid children in code', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[CODE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid last block in code', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid oboeditor.component in code', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey', type: 'oboeditor.component' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes required children in code', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize does nothing to invalid children in code line', () => {
		const editor = {
			unwrapBlockByKey: jest.fn()
		}

		Schema.blocks[CODE_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.unwrapBlockByKey).not.toHaveBeenCalled()
	})

	test('normalize fixes invalid last block in code line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})
})
