import Big from 'big.js'

export default s => {
	return Big(s.replace(/\+/g, ''))
}
