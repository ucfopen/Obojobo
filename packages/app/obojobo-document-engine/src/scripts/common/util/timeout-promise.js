const timeoutPromise = (ms, promise) => {
	if (window.__failTimeoutPromise) {
		console.error('timeoutPromise fake error')
		ms = 1
	}
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(timeoutPromise.ERROR)
		}, ms)

		return promise.then(resolve).catch(reject)
	})
}

timeoutPromise.ERROR = Error('Promise Timeout')

export default timeoutPromise
