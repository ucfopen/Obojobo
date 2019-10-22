import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

import Schema from './schema'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table Schema', () => {
	test('plugins.schema.normalize fixes last invalid child in table', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 1 } },
			child: { key: 'mockKey', object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in table', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 3 } },
			child: { key: 'mockKey', object: 'block' },
			index: 1
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid child in table', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[TABLE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 3 } },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in table', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 3 } },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes first invalid child in row', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_ROW_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 3 } },
			child: { key: 'mockKey', object: 'block' },
			index: 0
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes last invalid child in row', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_ROW_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false }) }, nodes: { size: 1 } },
			child: { key: 'mockKey', object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid child in row', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[TABLE_ROW_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false }) }, nodes: { size: 1 } },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes missing child in row', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = funct => funct(editor)

		Schema.blocks[TABLE_ROW_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 3 } },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid child in cell', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_CELL_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 1 } },
			child: { key: 'mockKey', object: 'block' },
			index: 1
		})

		expect(editor.unwrapNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid last block in cell', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[TABLE_CELL_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { data: { get: () => ({ header: false, numCols: 1 }) }, nodes: { size: 2 } },
			child: { key: 'mockKey', object: 'block' },
			index: 1
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})
})
