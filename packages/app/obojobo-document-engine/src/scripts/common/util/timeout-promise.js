const timeoutPromise = (ms, promise) => {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			reject(new Error('Promise Timeout'))
		}, ms)

		promise.then(resolve, reject)
	})
}

export default timeoutPromise
