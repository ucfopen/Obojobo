const timeoutPromise = (ms, promise) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(new Error('PTO'))
		}, ms)

		return promise.then(resolve).catch(reject)
	})
}

timeoutPromise.ERROR = Error('Promise Timeout')

export default timeoutPromise
