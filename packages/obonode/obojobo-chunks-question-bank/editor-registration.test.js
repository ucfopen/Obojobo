jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))

jest.mock('./editor-component', () => global.mockReactComponent(this, 'QuestionBank'))
jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
jest.mock('./converter', () => ({ mock: 'converter' }))

import { Transforms } from 'slate'
import QuestionBank from './editor-registration'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('QuestionBank editor', () => {
	test('normalizeNode calls next if the node is not a Code node', () => {
		const next = jest.fn()
		QuestionBank.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Code calls next if all Code children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_BANK_NODE,
					content: {},
					children: [
						{
							type: QUESTION_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		QuestionBank.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Code calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_BANK_NODE,
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
			isInline: () => false
		}
		QuestionBank.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Code calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_BANK_NODE,
					content: {},
					children: [{ text: 'mockCode', b: true }]
				}
			],
			isInline: () => false
		}
		QuestionBank.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a question bank when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: QUESTION_BANK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(QuestionBank.plugins.renderNode(props)).toMatchSnapshot()
	})
})
