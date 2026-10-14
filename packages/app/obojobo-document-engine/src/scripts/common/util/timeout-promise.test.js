import timeoutPromise from './timeout-promise'

describe('timeoutPromise', () => {
	test('timeoutPromise resolves as expected when timeout not reached', done => {
		expect.assertions(1)

		const mockResolvedValue = jest.fn()

		timeoutPromise(
			1000,
			new Promise(resolve => {
				setTimeout(() => {
					resolve(mockResolvedValue)
				}, 1)
			})
		).then(result => {
			expect(result).toBe(mockResolvedValue)

			done()
		})
	})

	test('timeoutPromise rejects as expected when timeout not reached', done => {
		expect.assertions(1)

		const mockResolvedValue = jest.fn()

		timeoutPromise(
			1000,
			new Promise((resolve, reject) => {
				setTimeout(() => {
					reject(mockResolvedValue)
				}, 1)
			})
		).catch(result => {
			expect(result).toBe(mockResolvedValue)

			done()
		})
	})

	test('timeoutPromise rejects after timeout has elapsed', done => {
		expect.assertions(1)

		const mockResolvedValue = jest.fn()

		timeoutPromise(
			1,
			new Promise(resolve => {
				setTimeout(() => {
					resolve(mockResolvedValue)
				}, 1000)
			})
		)
			.then(() => {
				// This path should not be reached
				expect(true).toBe(false)
			})
			.catch(result => {
				expect(result).toEqual(Error(timeoutPromise.ERROR))

				done()
			})
	})
})
