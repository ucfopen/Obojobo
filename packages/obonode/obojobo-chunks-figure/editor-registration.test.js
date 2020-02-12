jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import { Transforms } from 'slate'

import Figure from './editor-registration'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

describe('Figure editor', () => {
	test('plugins.normalizeNode calls next if the node is not an ActionButton', () => {
		const next = jest.fn()
		Figure.plugins.normalizeNode([ {},[] ], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all Action Button children are text', () => {
		const button = {
			type: FIGURE_NODE,
			children: [{ text: '' }]
		}
		const next = jest.fn()

		Figure.plugins.normalizeNode([ button,[0] ],{ children: [button] }, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms on an invalid child', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const button = {
			type: FIGURE_NODE,
			children: [
				{ 
					type: 'mockElement',
					children: [{ text: '' }]
				}
			]
		}
		const editor = {
			isInline: () => false,
			children: [button]
		}
		const next = jest.fn()

		Figure.plugins.normalizeNode([ button,[0] ], editor, next)
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})
	
	test('plugins.decorate exits when not relevent', () => {
		expect(
			Figure.plugins.decorate(
				[{ text: 'mock text' }],
				{}
			)
		).toMatchSnapshot()

		expect(
			Figure.plugins.decorate(
				[{ children: [{ text: 'mock text' }] }],
				{}
			)
		).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}

		expect(
			Figure.plugins.decorate(
				[{ children: [{ text: '' }] }, [0]],
				editor
			)
		).toMatchSnapshot()
	})

	test('plugins.renderNode renders a figure when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: FIGURE_NODE,
				content: {}
			}
		}

		expect(Figure.plugins.renderNode(props)).toMatchSnapshot()
	})
})
