jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: jest.fn()
	}
}))

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter',
	() => ({
		helpers: {
			slateToObo: () => 'ActionsChild',
			oboToSlate: () => 'ActionsChildOboToSlate'
		}
	})
)

import { CHILD_TYPE_INVALID } from 'slate-schema-violations'
import Schema from './schema'
import Common from 'obojobo-document-engine/src/scripts/common'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'

describe('Question Bank Schema', () => {
	test('plugins.schema.normalize fixes first invalid child in bank', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in bank', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in bank', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in bank', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			insertJSON: {
				type: 'Mock',
				mockJson: true
			}
		})

		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
