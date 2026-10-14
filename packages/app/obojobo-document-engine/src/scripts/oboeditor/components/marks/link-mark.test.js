import { Transforms } from 'slate'
jest.mock('slate-react')

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import LinkMark from './link-mark'

const LINK_MARK = 'a'
const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('LinkMark', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('plugins.isInline to call next if not Link', () => {
		const next = jest.fn()
		LinkMark.plugins.isInline({}, {}, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.isInline to return true if the node is a Link', () => {
		const node = { type: LINK_MARK }
		expect(LinkMark.plugins.isInline(node, {}, jest.fn())).toEqual(true)
	})

	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}

		LinkMark.plugins.onKeyDown({ key: 'q' }, editor, jest.fn())

		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if shift key is pressed', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}

		LinkMark.plugins.onKeyDown({ key: 'q', shiftKey: true }, editor, jest.fn())

		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}

		LinkMark.plugins.onKeyDown({ ctrlKey: true, key: 'f' }, editor, jest.fn())

		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('onKeyDown toggles marks if CTRL/CMD + key is pressed', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'k',
			preventDefault: jest.fn()
		}

		LinkMark.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('renderMark diplays expected style', () => {
		expect(
			LinkMark.plugins.renderNode({
				children: 'mockChild',
				element: { type: LINK_MARK }
			})
		).toMatchSnapshot()
	})

	test('changeLinkValue removes links', () => {
		jest.spyOn(Transforms, 'select').mockReturnValue(true)
		jest.spyOn(Transforms, 'unwrapNodes').mockImplementation((editor, opts) => {
			opts.match({ type: LINK_MARK })
		})
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValue(true)

		const editor = {
			removeMark: jest.fn(),
			addMark: jest.fn()
		}

		LinkMark.plugins.commands.changeLinkValue(editor, '')

		expect(Transforms.unwrapNodes).toHaveBeenCalledTimes(1)
		expect(Transforms.wrapNodes).not.toHaveBeenCalled()
		expect(Transforms.insertNodes).not.toHaveBeenCalled()
	})

	test('changeLinkValue adds new link', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'unwrapNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: '' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		LinkMark.plugins.commands.changeLinkValue(editor, 'mockURL')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('changeLinkValue wraps existing text', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'collapse').mockReturnValue(true)
		jest.spyOn(Transforms, 'unwrapNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'mock text' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 4 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		LinkMark.plugins.commands.changeLinkValue(editor, 'mockURL')

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('the action in each mark calls ModalUtil', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'mock text' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 4 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		LinkMark.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('the action in each mark calls ModalUtil with ActionButtons', () => {
		const editor = {
			children: [
				{
					type: BUTTON_NODE,
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'mock text' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 4 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		LinkMark.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(ModalUtil.show).toHaveBeenCalled()
	})
})
