import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'

jest.mock('src/scripts/common/util/modal-util')

describe('Clipboard Util', () => {
	beforeAll(() => {
		document.execCommand = jest.fn()
		document.createElement = jest.fn()
		document.body.appendChild = jest.fn()
		document.body.removeChild = jest.fn()
	})

	test('EditorNav component clicks Copy URL button', () => {
		const dummyEL = {
			value: '',
			setAttribute: jest.fn(),
			style: {},
			select: jest.fn()
		}

		document.createElement.mockReturnValueOnce(dummyEL)
		jest.spyOn(window, 'alert')
		window.alert.mockReturnValueOnce(null)

		ClipboardUtil.copyToClipboard('testString')

		expect(dummyEL.value).toEqual('testString')
		expect(dummyEL.select).toHaveBeenCalled()
	})
})
