const debounce = (time, fn) => {
	let timeout;

	return function() {
		const functionCall = () => fn.apply(this, arguments);
		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	}
}

module.exports = debounce
