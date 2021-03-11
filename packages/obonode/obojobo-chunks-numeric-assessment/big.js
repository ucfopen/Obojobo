const big = require('big.js')

module.exports = s => {
	s = typeof s === 'string' ? s.replace(/^\+/, '') : s
	return big(s)
}
