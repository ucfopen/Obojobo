import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Page from '../../../../ObojoboDraft/Pages/Page/editor'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Page editor', () => {
	test('plugins.renderNode renders a solution when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: PAGE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Page.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		Page.plugins.schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockNode' },
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Page.plugins.schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
