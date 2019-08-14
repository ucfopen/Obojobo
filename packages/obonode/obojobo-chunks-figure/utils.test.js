import { debounce, isUrlUUID } from './utils'

describe('Image utils', () => {
	test('debounce behaves as expected', () => {
		jest.spyOn(window, 'clearTimeout')
		jest.spyOn(window, 'setTimeout')

		const callback = jest.fn().mockImplementation(resolve => resolve())

		return new Promise(resolve => {
			debounce(0, () => callback(resolve))
		}).then(() => {
			expect(callback).toBeCalled()
			expect(window.clearTimeout).toBeCalled()
			expect(window.setTimeout).toBeCalled()
		})
	})

	test('isUrlUUID behaves as expected', () => {
		expect(isUrlUUID('C56A4180-65AA-42EC-A945-5FD21DEC0538')).toBe(true)
		expect(isUrlUUID('notUUID')).toBe(false)
	})
})
