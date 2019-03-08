import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Common from 'obojobo-document-engine/src/scripts/common/index'
import Page from './editor'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

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

		expect(Page.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Page.plugins.renderNode(props, null, next)).toMatchSnapshot()
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
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('getNavItem returns expected object', () => {
		const pageMock = Common.Registry.registerModel.mock.calls[0][1]

		const model = {
			parent: {
				children: {
					models: [{ get: () => true }]
				}
			},
			title: 'Test Title'
		}

		expect(pageMock.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Test Title',
			path: ['test-title'],
			showChildren: false
		})

		model.title = null
		expect(pageMock.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Page 0',
			path: ['page-0'],
			showChildren: false
		})
	})
})
