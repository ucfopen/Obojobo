import { Transforms } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import normalizeNode from './normalize-node'

import { MC_ASSESSMENT_NODE, MC_ANSWER_NODE } from 'obojobo-chunks-multiple-choice-assessment/constants'
import { CHOICE_NODE, FEEDBACK_NODE, } from '../../constants'

describe('Choice normalization', () => {
	test('normalizeNode calls next if the node is not a Choice node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls next if all Choice children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [
								{
									type: MC_ANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [
								{
									type: 'improperNode',
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid Element children with no assessment parent', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							type: 'improperNode',
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid Feedback children', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [
								{
									type: FEEDBACK_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid Feedback children with sibling', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							type: FEEDBACK_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				},
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							type: MC_ANSWER_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid second children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [
								{
									type: MC_ANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: MC_ANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid extra children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [
								{
									type: MC_ANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: FEEDBACK_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: FEEDBACK_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: MC_ASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: CHOICE_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Choice calls Transforms with invalid parent', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							type: MC_ANSWER_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})