// Taken from https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/

const getFunctionFromText = function(src) {
	src = 'with (sandbox) {' + src + '}'
	const code = new Function('sandbox', src)

	return function(sandbox) {
		const sandboxProxy = new Proxy(sandbox, {
			has: function(target, key) {
				return true
			},
			get: function(target, key) {
				if (key === Symbol.unscopables) return undefined
				return target[key]
			}
		})
		return code(sandboxProxy)
	}
}

export default getFunctionFromText
