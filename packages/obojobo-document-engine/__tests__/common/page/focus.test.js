import focus from '../../../src/scripts/common/page/focus'

describe('focus', () => {
	test('Requires passed in argument to be element-like', () => {
		expect(focus()).toBe(false)
		expect(focus(false)).toBe(false)
		expect(focus({})).toBe(false)
		expect(
			focus({
				focus: jest.fn(),
				getAttribute: jest.fn(),
				setAttribute: jest.fn()
			})
		).toBe(true)
	})

	test('Changes tabindex to 0 temporarily, calls focus and restores tabIndex', () => {
		jest.useFakeTimers()

		const el = {
			focus: jest.fn(),
			getAttribute: jest.fn(() => 'mock-attribute'),
			setAttribute: jest.fn()
		}

		focus(el)

		expect(el.focus).toHaveBeenCalledTimes(1)
		expect(el.setAttribute).toHaveBeenCalledTimes(1)
		expect(el.setAttribute).toHaveBeenCalledWith('tabindex', '0')

		jest.runAllTimers()

		expect(el.setAttribute).toHaveBeenCalledTimes(2)
		expect(el.setAttribute).toHaveBeenCalledWith('tabindex', 'mock-attribute')
	})
})
