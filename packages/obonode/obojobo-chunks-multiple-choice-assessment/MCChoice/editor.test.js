import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import MCChoice from './editor'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

describe('MCChoice editor', () => {
	test('plugins.renderNode renders a choice', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCCHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCChoice.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(MCChoice.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: MCFEEDBACK_NODE },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes too many children', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 3
		})

		expect(editor.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes extra children', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: 'wrongType' },
			index: 1
		})

		expect(editor.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
