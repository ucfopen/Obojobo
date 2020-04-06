import { Transforms } from 'slate'
jest.mock('slate-react')

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

jest.mock('./editor-component', () => global.mockReactComponent(this, 'Page'))
jest.mock('./converter', () => ({ mock: 'converter' }))

import Page from './editor-registration'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

describe('Page editor', () => {
	test('normalizeNode calls next if the node is not a Code node', () => {
		const next = jest.fn()
		Page.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Code calls next if all Code children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: PAGE_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Page.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Code calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: PAGE_NODE,
					content: {},
					children: [{ text: 'mockCode', b: true }]
				}
			],
			isInline: () => false
		}
		Page.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Page calls Transforms if parent is invalid', () => {
		jest.spyOn(Transforms, 'unwrapNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: PAGE_NODE,
					content: {},
					children: [
						{
							type: PAGE_NODE,
							content: { indent: 1 },
							children: [
								{
									type: TEXT_NODE,
									content: { indent: 1 },
									children: [
										{
											type: 'invalidNode',
											children: [{ text: 'mockCode', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		
		Page.plugins.normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.unwrapNodes).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a Page when passed', () => {
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

	test('getNavItem returns expected object', () => {
		const model = {
			parent: {
				children: {
					models: [{ get: () => true }]
				}
			},
			title: 'Test Title'
		}

		expect(Page.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Test Title',
			path: ['test-title'],
			showChildren: false
		})

		model.title = null
		expect(Page.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Page 0',
			path: ['page-0'],
			showChildren: false
		})
	})
})
