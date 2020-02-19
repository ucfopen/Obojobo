const debounce = (time, fn) => {
	let timeout = null
	let functionCall = null

	const debouncedFn = function() {
		functionCall = () => fn.apply(this, arguments)

		debouncedFn.cancel()

		timeout = setTimeout(functionCall, time)
	}

	debouncedFn.cancel = function() {
		clearTimeout(timeout)
		timeout = null
	}

	// Additional method causing the debounced function
	// to execute right away
	debouncedFn.now = function() {
		if (!timeout) return

		debouncedFn.cancel()

		return functionCall()
	}

	return debouncedFn
}

module.exports = debounce
