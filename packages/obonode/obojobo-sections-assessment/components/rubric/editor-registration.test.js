jest.mock('./editor-component', () => global.mockReactComponent(this, 'Rubric'))
jest.mock('./converter', () => ({ mock: 'converter' }))

import { Transforms } from 'slate'

import Rubric from './editor-registration'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('Rubric editor component', () => {
	test('normalizeNode calls next if the node is not a Code node', () => {
		const next = jest.fn()
		Rubric.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Rubric calls next if valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: ASSESSMENT_NODE,
					content: {},
					children: [
						{
							type: RUBRIC_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Rubric.plugins.normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Rubric calls Transforms if parent is invalid', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: 'invalidNode',
					content: {},
					children: [
						{
							type: RUBRIC_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		
		Rubric.plugins.normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('plugins.renderNode renders the rubric when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: RUBRIC_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})
})
