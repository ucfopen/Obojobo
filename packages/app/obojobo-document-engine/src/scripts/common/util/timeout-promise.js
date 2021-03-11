const timeoutPromise = (ms, promise) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(timeoutPromise.ERROR)
		}, ms)

		return promise.then(resolve).catch(reject)
	})
}

timeoutPromise.ERROR = Error('Promise Timeout')

export default timeoutPromise
