import debounce from './debounce'

describe('Debounce Util', () => {
	test('debounce executes and passes arguments', () => {
		jest.useFakeTimers()

		const mockArg = { mockarg: 1 }
		const callback = jest.fn()
		const test = debounce(10, arg1 => callback(arg1))
		test(mockArg)

		expect(callback).toHaveBeenCalledTimes(0)

		jest.runAllTimers()

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(mockArg)
	})

	test('debounce only executes the last request', () => {
		jest.useFakeTimers()

		const mockArg = { mockarg: 1 }
		const mockArg2 = { mockarg: 2 }
		const callback = jest.fn()
		const test = debounce(10, arg1 => callback(arg1))

		// call twice with different args
		test(mockArg)
		test(mockArg2)

		expect(callback).toHaveBeenCalledTimes(0)

		jest.runAllTimers()

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(mockArg2)
		expect(callback).not.toHaveBeenCalledWith(mockArg)
	})
})
