import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

import Schema from './schema'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

describe('Code Schema', () => {
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

	test('plugins.schema.normalize fixes block children in Line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes non-block children in Line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[CODE_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { object: 'mark' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).not.toHaveBeenCalled()
	})
})
