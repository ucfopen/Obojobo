// Adds a timeout to a promise, rejects of the promise doesn't resolve before allowed time.
// * If the promise argument resolves before `ms` time passed, resolves passing the results
// * If the promise argument rejects before `ms` time passed, rejects passing the error
// * If the promise argument doesn't resolve or reject before `ms` time passes, rejects with a
//   timeout error
const timeoutPromise = (ms, promise) => {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(Error(timeoutPromise.ERROR))
		}, ms)

		return promise
			.then((...args) => {
				clearTimeout(timeoutId)
				resolve(...args)
			})
			.catch((...args) => {
				clearTimeout(timeoutId)
				reject(...args)
			})
	})
}

timeoutPromise.ERROR = 'Promise Timeout'

export default timeoutPromise
