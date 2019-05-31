import { INPUT_TYPE_OCTAL } from './types/input-types.js'
import { MATCH_EXACT, MATCH_INFERRED, MATCH_NONE } from '../entry/match-types.js'
import Numeric from './numeric.js'
import Decimal from './decimal.js'
import Big from '../big.js'
import { OCTAL_TYPE_INFERRED, OCTAL_TYPE_ZERO_O } from './types/octal-types.js'

const octalZeroO = /^0o[0-7]+$/
const octalInferred = /^[0-7]+$/

/**
 * An octal numeric type. Values should be prefixed with "0o" but are possible octal matches if given a number with only numbers 0-7. Units cannot come directly after the value string and must have a space in-between.
 * @example
 * new Octal("0o701")
 * new Octal("0o701 bytes") // Unit example
 * new Octal("701") // 'inferred' octal value
 */
export default class Octal extends Numeric {
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
	}

	/**
	 * Get the value string portion of a possible octal string
	 * @param {string} str
	 * @return {string|null}
	 * @example
	 * Octal.getValueString('0o777') //'0o777'
	 * Octal.getValueString('777 bytes') //'777'
	 * Octal.getValueString('0xFF bytes') //null
	 */
	static getValueString(str) {
		switch (Octal.getInputType(str)) {
			case OCTAL_TYPE_ZERO_O:
				return octalZeroO.exec(str)[0]

			case OCTAL_TYPE_INFERRED:
				return octalInferred.exec(str)[0]
		}

		return null
	}

	// static parse(str) {
	// 	const valueString = Octal.getValueString(str)
	// 	if (!valueString) return Numeric.getNullParseObject()

	// 	return {
	// 		matchType: Octal.getMatchType(str),
	// 		valueString,
	// 		unit: str.substr(valueString.length).trim()
	// 	}
	// }

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a octal value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Octal.parse("0o777 bytes") //{ matchType:'exact', valueString:'0o777', unit:'bytes' }
	 * Octal.parse("777") //{ matchType:'inferred', valueString:'777', unit:'' }
	 * Octal.parse("888") //{ matchType:'none', valueString:'', unit:'' }
	 */
	static parse(str) {
		const tokens = str.split(' ')

		const valueString = Octal.getValueString(tokens[0])
		if (!valueString) return Numeric.getNullParseObject()

		return {
			matchType: Octal.getMatchType(valueString),
			valueString,
			unit: tokens[1] || ''
		}
	}

	/**
	 * Determine if this is an exact match, an inferred match, or not a match
	 * @param {string} str
	 * @return {string} 'exact' | 'inferred' | 'none'
	 * @example
	 * Binary.getMatchType('0o777 bytes') //'exact'
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
		return Octal.getBigValue(valueString).lte(Number.MAX_SAFE_INTEGER)
	}

	/**
	 * Get the string representation of a Big value
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Octal.getString(Big(45)) //"0o55"
	 * Octal.getString(Big(80)) //"0o120"
	 */
	static getString(bigValue) {
		return `0o${Number(bigValue).toString(8)}`
	}

	/**
	 * Get a Big instance for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Octal.getBigValue('0o55') //Big(45)
	 * Octal.getBigValue('120') //Big(80)
	 */
	static getBigValue(valueString) {
		return Big(Octal.getValue(valueString))
	}

	/**
	 * Get a number value for a given value string
	 * @param {string} valueString
	 * @return {string}
	 * @example
	 * Octal.getValue('0o55') //45
	 * Octal.getValue('120') //80
	 */
	static getValue(valueString) {
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
		return Decimal.getNumSigFigs(Octal.getBigValue(valueString).toString())
	}

	/**
	 * Octal values are always integers
	 * @return {true}
	 */
	static getIsInteger() {
		return true
	}

	/**
	 * Converts the octal value to decimal then returns the number of digits
	 * @param {string} valueString
	 * @return {number} The number of digits of this instance
	 * @example
	 * Octal.getNumDigits('0o55') //2
	 * Octal.getNumDigits('120') //2
	 */
	static getNumDigits(valueString) {
		return Decimal.getNumDigits(Octal.getBigValue(valueString).toString())
	}
}
