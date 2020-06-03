jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))
jest.mock('./editor-component', () => global.mockReactComponent(this, 'Assessment'))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('slate-react')
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import { Transforms } from 'slate'

import Assessment from './editor-registration'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

describe('Assessment editor', () => {
	test('normalizeNode calls next if the node is not a Question node', () => {
		const next = jest.fn()
		Assessment.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls next if all Assessment children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: ACTIONS_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing Rubric', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: ACTIONS_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						} 
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing Actions', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing QuestionBank', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing Page', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: []
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing Page out of order', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls NormalizeUtil with unwrapped Page', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{ text: 'mockCode', b: true },
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: ACTIONS_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}, 
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
			match(editor.children[0].children[1])
			match(editor.children[0].children[2])
			match(editor.children[0].children[3])
		})

		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing QuestionBank out of order', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls NormalizeUtil with unwrapped QuestionBank', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{ text: 'mockCode', b: true },
						{
							id: 'mockKey',
							type: ACTIONS_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}, 
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
			match(editor.children[0].children[1])
			match(editor.children[0].children[2])
			match(editor.children[0].children[3])
		})

		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls Transforms when missing Actions out of order', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Assessment calls NormalizeUtil with unwrapped Actions', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_BANK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{ text: 'mockCode', b: true },
						{
							id: 'mockKey',
							type: RUBRIC_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
			match(editor.children[0].children[1])
			match(editor.children[0].children[2])
			match(editor.children[0].children[3])
		})

		Assessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('plugins.renderNode renders the Assessment when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: ASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Assessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Assessment.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Test Title',
			path: ['test-title'],
			showChildren: false,
			showChildrenOnNavigation: false
		})

		model.title = null
		expect(Assessment.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Assessment',
			path: ['assessment'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})
})
