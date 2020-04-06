import { Transforms } from 'slate'

import ActionButton from './editor-registration'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton editor', () => {
	test('plugins.normalizeNode calls next if the node is not an ActionButton', () => {
		const next = jest.fn()
		ActionButton.plugins.normalizeNode([ {},[] ], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all Action Button children are text', () => {
		const button = {
			type: BUTTON_NODE,
			children: [{ text: '' }]
		}
		const next = jest.fn()

		ActionButton.plugins.normalizeNode([ button,[0] ],{ children: [button] }, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms on an invalid child', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const button = {
			type: BUTTON_NODE,
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

		ActionButton.plugins.normalizeNode([ button,[0] ], editor, next)
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(
			ActionButton.plugins.decorate(
				[{ text: 'mock text' }],
				{}
			)
		).toMatchSnapshot()

		expect(
			ActionButton.plugins.decorate(
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
			ActionButton.plugins.decorate(
				[{ children: [{ text: '' }] }, [0]],
				editor
			)
		).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'k',
			preventDefault: jest.fn()
		}

		ActionButton.plugins.onKeyDown([{},[0]], {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		ActionButton.plugins.onKeyDown([{},[0]], {}, event)
		expect(KeyDownUtil.breakToText).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: BUTTON_NODE,
				content: {}
			}
		}

		expect(ActionButton.plugins.renderNode(props)).toMatchSnapshot()
	})
})
