import { Transforms } from 'slate'
jest.mock('slate-react')
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')
jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		contentTypes: ['ObojoboDraft.Chunks.Break']
	}
}))

import normalizeNode from './normalize-node'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Normalize List', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()
	})

	test('normalizeNode calls next if the node is not a Question node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls next if all Question children are valid with solution', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: BREAK_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: QUESTION_NODE,
							subtype: SOLUTION_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls next if all Question children are valid without solution', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: BREAK_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms if only a Solution exists', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: QUESTION_NODE,
							subtype: SOLUTION_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms if only a MCAssessment exists', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms if only a content Node exists', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: BREAK_NODE,
							content: {},
							children: [{ text: '' }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms if only a content and solution Node exists', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: BREAK_NODE,
							content: {},
							children: [{ text: '' }]
						},
						{
							id: 'mockKey',
							type: QUESTION_NODE,
							subtype: SOLUTION_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms if only a MCAssessment and solution Node exists', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{
							id: 'mockKey',
							type: QUESTION_NODE,
							subtype: SOLUTION_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: QUESTION_NODE,
							content: {},
							children: [
								{
									type: 'improperNode',
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						},
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Question calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [{ text: 'mockCode', b: true }]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Solution calls NormalizeUtil on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					subtype: SOLUTION_NODE,
					content: {},
					children: [{ text: 'mockCode', b: true }]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})

		normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on Solution calls Transforms on invalid extra children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					subtype: SOLUTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: PAGE_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						},
						{ text: 'mockCode', b: true }
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
