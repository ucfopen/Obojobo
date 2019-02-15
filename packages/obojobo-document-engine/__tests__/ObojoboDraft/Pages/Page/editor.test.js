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
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => {
			funct(change)
		})

		Page.plugins.schema.blocks[PAGE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockNode' },
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Page.plugins.schema.blocks[PAGE_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
