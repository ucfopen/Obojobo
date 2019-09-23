/* eslint-disable new-cap */

import Big from 'big.js'

export default s => {
	s = typeof s === 'string' ? s.replace(/^\+/, '') : s
	return Big(s)
}
