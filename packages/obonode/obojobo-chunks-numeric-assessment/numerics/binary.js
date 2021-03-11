const { BINARY_TYPE_INFERRED, BINARY_TYPE_ZERO_B } = require('./types/binary-types')
const { INPUT_TYPE_BINARY } = require('./types/input-types')
const { MATCH_EXACT, MATCH_INFERRED, MATCH_NONE } = require('../entry/match-types')
const Numeric = require('./numeric')
const Decimal = require('./decimal')
const big = require('../big')

const binaryZeroB = /^0b[0-1]+$|^0b[0-1]+$/
const binaryInferred = /^[0-1]+$|^[0-1]+$/

/**
 * A binary numeric type. Values should be prefixed with "0b" but are possible binary matches if given a number with only zeroes and ones.
 * @example
 * new Binary("0b1101")
 * new Binary("101") // 'inferred' binary value
 */
module.exports = class Binary extends Numeric {
	/**
	 * A string representing this type
	 * @type {'binary'}
	 */
	static get type() {
		return INPUT_TYPE_BINARY
	}

	/**
	 * A human friendly label for this type
	 * @type {'Binary'}
	 */
	static get label() {
		return 'Binary'
	}

	/**
	 * Determines the syntax type (either 0b prefix or inferred)
	 * @param {string} str
	 * @return {string|null} Either 'binaryZeroB', 'binaryInferred' or null if not binary
	 */
	static getInputType(str) {
		if (binaryZeroB.test(str)) return BINARY_TYPE_ZERO_B
		if (binaryInferred.test(str)) return BINARY_TYPE_INFERRED

		return null
	}

	/**
	 * Get the value string portion of a possible binary string
	 * @param {string} str
	 * @return {string|null}
	 * @example
	 * Binary.getValueString('0b1101') //'0b110'
	 * Binary.getValueString('1101') //'1101'
	 * Binary.getValueString('0xFF') //null
	 */
	static getValueString(str) {
		switch (Binary.getInputType(str)) {
			case BINARY_TYPE_ZERO_B:
				return binaryZeroB.exec(str)[0].trim()

			case BINARY_TYPE_INFERRED:
				return binaryInferred.exec(str)[0].trim()
		}

		return null
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a binary value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Binary.parse("0b1101") //{ matchType:'exact', valueString:'0b1101' }
	 * Binary.parse("1101") //{ matchType:'inferred', valueString:'1101' }
	 * Binary.parse("101.1") //{ matchType:'none', valueString:'' }
	 */
	static parse(str) {
		const valueString = Binary.getValueString(str)
		if (!valueString) return Numeric.getNullParseObject()

		return {
			matchType: Binary.getMatchType(valueString),
			valueString
		}
	}

	/**
	 * Determine if this is an exact match, an inferred match, or not a match
	 * @param {string} str
	 * @return {string} 'exact' | 'inferred' | 'none'
	 * @example
	 * Binary.getMatchType('0b1101') //'exact'
	 * Binary.getMatchType('1101') //'inferred'
	 * Binary.getMatchType('101.1') //'none'
	 */
	static getMatchType(str) {
		switch (Binary.getInputType(str)) {
			case BINARY_TYPE_ZERO_B:
				return MATCH_EXACT

			case BINARY_TYPE_INFERRED:
				return MATCH_INFERRED
		}

		return MATCH_NONE
	}

	/**
	 * Determine if the given string binary representation can be safely converted
	 * @param {string} valueString
	 * @return {boolean} True if the string representation is less than Number.MAX_SAFE_INTEGER
	 */
	static isSafe(valueString) {
		return Binary.getBigValueFromString(valueString).lte(Number.MAX_SAFE_INTEGER)
	}

	/**
	 * Get the string representation of a Big value
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Binary.getString(big(2)) //"0b10"
	 * Binary.getString(big(15)) //"0b1111"
	 */
	static getString(bigValue) {
		return `0b${Number(bigValue).toString(2)}`
	}

	/**
	 * Get a Big instance for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Binary.getBigValueFromString('0b10') //big(2)
	 * Binary.getBigValueFromString('1111') //big(15)
	 */
	static getBigValueFromString(valueString) {
		return big(Binary.getNumberFromString(valueString))
	}

	/**
	 * Get a number for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Binary.getNumberFromString('0b10') //2
	 * Binary.getNumberFromString('1111') //15
	 */
	static getNumberFromString(valueString) {
		switch (this.getInputType(valueString)) {
			case BINARY_TYPE_ZERO_B:
				return Number(valueString)

			case BINARY_TYPE_INFERRED:
				return Number('0b' + valueString)
		}
	}

	/**
	 * Converts the binary value to decimal and then returns the number of significant figures.
	 * @param {string} valueString
	 * @return {number} The number of significant figures of this instance
	 * @example
	 * Binary.getNumSigFigs('0b10') //1
	 * Binary.getNumSigFigs('1111') //2
	 */
	static getNumSigFigs(valueString) {
		return Decimal.getNumSigFigs(Binary.getBigValueFromString(valueString).toString())
	}

	/**
	 * Binary values are always integers
	 * @return {true}
	 */
	static getIsInteger() {
		return true
	}

	/**
	 * Binary numbers are integers so this is always 0
	 * @param {string} valueString
	 * @return {0}
	 * @example
	 * Binary.getNumDecimalDigits('0b10') //0
	 */
	static getNumDecimalDigits() {
		return 0
	}
}
