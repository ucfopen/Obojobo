const { INPUT_TYPE_OCTAL } = require('./types/input-types')
const { MATCH_EXACT, MATCH_INFERRED, MATCH_NONE } = require('../entry/match-types')
const Numeric = require('./numeric')
const Decimal = require('./decimal')
const big = require('../big')
const { OCTAL_TYPE_INFERRED, OCTAL_TYPE_ZERO_O } = require('./types/octal-types')

const octalZeroO = /^0o[0-7]+$|^0o[0-7]+$/
const octalInferred = /^[0-7]+$|^[0-7]+$/

/**
 * An octal numeric type. Values should be prefixed with "0o" but are possible octal matches if given a number with only numbers 0-7.
 * @example
 * new Octal("0o701")
 * new Octal("701") // 'inferred' octal value
 */
module.exports = class Octal extends Numeric {
	/**
	 * A string representing this type
	 * @type {'octal'}
	 */
	static get type() {
		return INPUT_TYPE_OCTAL
	}

	/**
	 * A human friendly label for this type
	 * @type {'Octal'}
	 */
	static get label() {
		return 'Octal'
	}

	/**
	 * Determines the syntax type (either 0o prefix or inferred)
	 * @param {string} str
	 * @return {string|null} Either 'octalZeroO', 'octalInferred' or null if not octal
	 */
	static getInputType(str) {
		if (octalZeroO.test(str)) return OCTAL_TYPE_ZERO_O
		if (octalInferred.test(str)) return OCTAL_TYPE_INFERRED

		return null
	}

	/**
	 * Get the value string portion of a possible octal string
	 * @param {string} str
	 * @return {string|null}
	 * @example
	 * Octal.getValueString('0o777') //'0o777'
	 * Octal.getValueString('777') //'777'
	 * Octal.getValueString('0xFF') //null
	 */
	static getValueString(str) {
		switch (Octal.getInputType(str)) {
			case OCTAL_TYPE_ZERO_O:
				return octalZeroO.exec(str)[0].trim()

			case OCTAL_TYPE_INFERRED:
				return octalInferred.exec(str)[0].trim()
		}

		return null
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a octal value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Octal.parse("0o777") //{ matchType:'exact', valueString:'0o777' }
	 * Octal.parse("777") //{ matchType:'inferred', valueString:'777' }
	 * Octal.parse("888") //{ matchType:'none', valueString:'' }
	 */
	static parse(str) {
		const valueString = Octal.getValueString(str)
		if (!valueString) return Numeric.getNullParseObject()

		return {
			matchType: Octal.getMatchType(valueString),
			valueString
		}
	}

	/**
	 * Determine if this is an exact match, an inferred match, or not a match
	 * @param {string} str
	 * @return {string} 'exact' | 'inferred' | 'none'
	 * @example
	 * Binary.getMatchType('0o777') //'exact'
	 * Binary.getMatchType('777') //'inferred'
	 * Binary.getMatchType('888') //'none'
	 */
	static getMatchType(str) {
		switch (Octal.getInputType(str)) {
			case OCTAL_TYPE_ZERO_O:
				return MATCH_EXACT

			case OCTAL_TYPE_INFERRED:
				return MATCH_INFERRED
		}

		return MATCH_NONE
	}

	/**
	 * Determine if the given string octal representation can be safely converted
	 * @param {string} valueString
	 * @return {boolean} True if the string representation is less than Number.MAX_SAFE_INTEGER
	 */
	static isSafe(valueString) {
		return Octal.getBigValueFromString(valueString).lte(Number.MAX_SAFE_INTEGER)
	}

	/**
	 * Get the string representation of a Big value
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Octal.getString(big(45)) //"0o55"
	 * Octal.getString(big(80)) //"0o120"
	 */
	static getString(bigValue) {
		return `0o${Number(bigValue).toString(8)}`
	}

	/**
	 * Get a Big instance for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Octal.getBigValueFromString('0o55') //big(45)
	 * Octal.getBigValueFromString('120') //big(80)
	 */
	static getBigValueFromString(valueString) {
		return big(Octal.getNumberFromString(valueString))
	}

	/**
	 * Get a number value for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Octal.getNumberFromString('0o55') //45
	 * Octal.getNumberFromString('120') //80
	 */
	static getNumberFromString(valueString) {
		switch (this.getInputType(valueString)) {
			case OCTAL_TYPE_ZERO_O:
				return Number(valueString)

			case OCTAL_TYPE_INFERRED:
				return Number('0o' + valueString)
		}
	}

	/**
	 * Converts the octal value to decimal and then returns the number of significant figures.
	 * @param {string} valueString
	 * @return {number} The number of significant figures of this instance
	 * @example
	 * Octal.getNumSigFigs('0o55') //2
	 * Octal.getNumSigFigs('120') //1
	 */
	static getNumSigFigs(valueString) {
		return Decimal.getNumSigFigs(Octal.getBigValueFromString(valueString).toString())
	}

	/**
	 * Octal values are always integers
	 * @return {true}
	 */
	static getIsInteger() {
		return true
	}

	/**
	 * Octal numbers are integers so this is always 0
	 * @param {string} valueString
	 * @return {0}
	 * @example
	 * Octal.getNumDecimalDigits('0o555') //0
	 */
	static getNumDecimalDigits() {
		return 0
	}
}
