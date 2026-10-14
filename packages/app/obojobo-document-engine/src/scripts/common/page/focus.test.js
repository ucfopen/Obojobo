import focus from './focus'

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
		expect(
			focus({
				current: {
					focus: jest.fn(),
					getAttribute: jest.fn(),
					setAttribute: jest.fn()
				}
			})
		).toBe(true)
	})

	test('Changes tabindex to 0 temporarily, calls focus and restores tabIndex for element', () => {
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

	test('Changes tabindex to 0 temporarily, calls focus and restores tabIndex for ref with current element', () => {
		jest.useFakeTimers()

		const el = {
			current: {
				focus: jest.fn(),
				getAttribute: jest.fn(() => 'mock-attribute'),
				setAttribute: jest.fn()
			}
		}

		focus(el)

		expect(el.current.focus).toHaveBeenCalledTimes(1)
		expect(el.current.setAttribute).toHaveBeenCalledTimes(1)
		expect(el.current.setAttribute).toHaveBeenCalledWith('tabindex', '0')

		jest.runAllTimers()

		expect(el.current.setAttribute).toHaveBeenCalledTimes(2)
		expect(el.current.setAttribute).toHaveBeenCalledWith('tabindex', 'mock-attribute')
	})
})
