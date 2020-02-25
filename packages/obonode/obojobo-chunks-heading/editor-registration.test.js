import { Transforms } from 'slate'

import Heading from './editor-registration'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
jest.mock('slate-react')

describe('Heading editor', () => {
	test('plugins.normalizeNode calls next if the node is not an ActionButton', () => {
		const next = jest.fn()
		Heading.plugins.normalizeNode([ {},[] ], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all Action Button children are text', () => {
		const button = {
			type: HEADING_NODE,
			children: [{ text: '' }]
		}
		const next = jest.fn()

		Heading.plugins.normalizeNode([ button,[0] ],{ children: [button] }, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms on an invalid child', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const button = {
			type: HEADING_NODE,
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

		Heading.plugins.normalizeNode([ button,[0] ], editor, next)
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(
			Heading.plugins.decorate(
				[{ text: 'mock text' }],
				{}
			)
		).toMatchSnapshot()

		expect(
			Heading.plugins.decorate(
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
			Heading.plugins.decorate(
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

		Heading.plugins.onKeyDown([{},[0]], {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Heading.plugins.onKeyDown([{},[0]], {}, event)
		expect(KeyDownUtil.breakToText).toHaveBeenCalled()
	})

	test('plugins.renderNode renders Heading when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: HEADING_NODE,
				content: {}
			}
		}

		expect(Heading.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('getNavItem returns expected object', () => {
		const model = {
			modelState: {
				headingLevel: 1,
				textGroup: {
					first: {
						text: 'testText'
					}
				}
			},
			getIndex: () => 0,
			showChildren: false,
			toText: () => 'test string'
		}

		expect(Heading.getNavItem(model)).toBe(null)

		model.modelState.headingLevel = 2
		expect(Heading.getNavItem(model)).toEqual({
			type: 'sub-link',
			label: 'testText',
			path: ['test-string'],
			showChildren: false
		})

		model.modelState.headingLevel = 3
		expect(Heading.getNavItem(model)).toBe(null)
	})
})
