const timeoutPromise = (ms, promise) => {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			reject(timeoutPromise.ERROR)
		}, ms)

		promise.then(resolve).catch(reject)
	})
}

timeoutPromise.ERROR = Error('Promise Timeout')

export default timeoutPromise
