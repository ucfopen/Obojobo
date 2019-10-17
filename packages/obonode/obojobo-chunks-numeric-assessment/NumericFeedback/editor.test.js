import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import NumericFeedback from './editor'
import { NUMERIC_FEEDBACK_NODE } from '../constants'

describe('NumericFeedback editor', () => {
	test('plugins.renderNode renders a node', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: NUMERIC_FEEDBACK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(NumericFeedback.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(NumericFeedback.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		NumericFeedback.plugins.schema.blocks[NUMERIC_FEEDBACK_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', object: 'text' },
			index: null
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericFeedback.plugins.schema.blocks[NUMERIC_FEEDBACK_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
