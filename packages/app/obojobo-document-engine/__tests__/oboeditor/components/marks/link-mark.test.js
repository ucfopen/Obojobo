import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import LinkMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link-mark'

const LINK_MARK = 'a'

describe('LinkMark', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}

		LinkMark.plugins.onKeyDown({ key: 'q' }, editor, jest.fn())

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
		expect(LinkMark.plugins.renderMark({
			children: 'mockChild',
			mark: { type: LINK_MARK }
		}, null, jest.fn())).toMatchSnapshot()
	})

	test('renderMark calls next', () => {
		const next = jest.fn()

		LinkMark.plugins.renderMark({
			children: 'mockChild',
			mark: { type: 'mockMark' }
		}, null, next)

		expect(next).toHaveBeenCalled()
	})

	test('changeLinkValue removes links', () => {
		const editor = {
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [
					{
						data: { toJSON: () => ({}) },
						type: LINK_MARK
					},

					{
						data: { toJSON: () => ({ content: {} }) },
						type: 'mockNode'
					},
				]
			}
		}

		LinkMark.plugins.queries.changeLinkValue(editor, '')

		expect(editor.removeMark).toHaveBeenCalledTimes(1)
		expect(editor.addMark).not.toHaveBeenCalled()
	})

	test('changeLinkValue adds new link', () => {
		const editor = {
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [
					{
						data: { toJSON: () => ({}) },
						type: LINK_MARK
					},

					{
						data: { toJSON: () => ({ content: {} }) },
						type: 'mockNode'
					},
				]
			}
		}

		LinkMark.plugins.queries.changeLinkValue(editor, 'mockURL')

		expect(editor.removeMark).toHaveBeenCalledTimes(1)
		expect(editor.addMark).toHaveBeenCalled()
	})

	test('the action in each mark calls editor.toggleMark', () => {
		const editor = {
			changeLinkValue: jest.fn()
		}

		LinkMark.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(ModalUtil.show).toHaveBeenCalledTimes(1)
	})
})

