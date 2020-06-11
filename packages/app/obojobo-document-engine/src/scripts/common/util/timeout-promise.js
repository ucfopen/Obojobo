const timeoutPromise = (ms, promise) => {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			reject(new Error('Promise Timeout'))
		}, ms)

		promise
			.then((...args) => {
				resolve(...args)
			})
			.catch(e => {
				reject(e)
			})
	})
}

export default timeoutPromise
