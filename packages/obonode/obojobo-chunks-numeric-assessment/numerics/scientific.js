import {
	SCIENTIFIC_TYPE_X,
	SCIENTIFIC_TYPE_E,
	SCIENTIFIC_TYPE_EE,
	SCIENTIFIC_TYPE_APOS,
	SCIENTIFIC_TYPE_ASTERISK
} from './types/scientific-types'
import Numeric from './numeric'
import Decimal from './decimal'
import { INPUT_TYPE_SCIENTIFIC } from './types/input-types'
import { MATCH_EXACT, MATCH_NONE } from '../entry/match-types'
import Big from '../big'

const xScientificNotationRegex = /^[-\+]?[0-9]+(\.[0-9]+)?x10\^[-\+]?[0-9]+/
const asteriskScientificNotationRegex = /^[-\+]?[0-9]+(\.[0-9]+)?\*10\^[-\+]?[0-9]+/
const eScientificNotationRegex = /^[-\+]?[0-9]+(\.[0-9]+)?e[-\+]?[0-9]+/
const eeScientificNotationRegex = /^[-\+]?[0-9]+(\.[0-9]+)?ee[-\+]?[0-9]+/
const aposScientificNotationRegex = /^[-\+]?[0-9]+(\.[0-9]+)?'[-\+]?[0-9]+/

/**
 * Object representing the terms of a Scientific value
 * @typedef {Object} ScientificTermsObject
 * @property {Big} bigDigit
 * @property {Big} bigExponential
 * @property {Big} bigValue
 */

/**
 * A number in scientific notation. Units may have whitespace between the value but are not required.
 * @example
 * new Scientific("6.02e23") // Default 'e' syntax
 * new Scientific("-6.02x10^23") // 'x10^' syntax
 * new Scientific("6.02*10^23") // '*10^' syntax
 * new Scientific("6.02'23") // 'apostrophe' syntax
 * new Scientific("6.02ee23") // 'ee' syntax (Used on some Casio calculators)
 * new Scientific("6.02e23 mols") // Unit example
 * new Scientific("+6.02e23mols") // Plus sign optional and ignored
 * new Scientific("60.2e22") // The left-hand digit may be >= 10 even though this is not technically valid scientific notation
 */
export default class Scientific extends Numeric {
	/**
	 * A string representing this type
	 * @type {'scientific'}
	 */
	static get type() {
		return INPUT_TYPE_SCIENTIFIC
	}

	/**
	 * A human friendly label for this type
	 * @type {'Scientific Notation'}
	 */
	static get label() {
		return 'Scientific Notation'
	}

	/**
	 * Get the syntax type for a given string
	 * @param {sting} str
	 * @returns {string|null}
	 * @example
	 * Scientific.getInputType("6.02e23") //"e"
	 * Scientific.getInputType("6.02x10^23") //"x"
	 * Scientific.getInputType("6.02*10^23") //"asterisk"
	 * Scientific.getInputType("6.02'10^23") //"apos"
	 * Scientific.getInputType("6.02ee10^23") //"ee"
	 * Scientific.getInputType("6.02") //null
	 */
	static getInputType(str) {
		if (xScientificNotationRegex.test(str)) return SCIENTIFIC_TYPE_X
		if (eeScientificNotationRegex.test(str)) return SCIENTIFIC_TYPE_EE
		if (eScientificNotationRegex.test(str)) return SCIENTIFIC_TYPE_E
		if (aposScientificNotationRegex.test(str)) return SCIENTIFIC_TYPE_APOS
		if (asteriskScientificNotationRegex.test(str)) return SCIENTIFIC_TYPE_ASTERISK
		return null
	}

	/**
	 * Return the value string portion of a given input string
	 * @param {string} str
	 * @return {string}
	 * @example
	 * Scientific.getValueString('6.02e23 mols') //'6.02e23'
	 */
	static getValueString(str) {
		switch (Scientific.getInputType(str)) {
			case SCIENTIFIC_TYPE_APOS:
				return aposScientificNotationRegex.exec(str)[0]

			case SCIENTIFIC_TYPE_ASTERISK:
				return asteriskScientificNotationRegex.exec(str)[0]

			case SCIENTIFIC_TYPE_E:
				return eScientificNotationRegex.exec(str)[0]

			case SCIENTIFIC_TYPE_EE:
				return eeScientificNotationRegex.exec(str)[0]

			case SCIENTIFIC_TYPE_X:
				return xScientificNotationRegex.exec(str)[0]
		}

		return null
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a scientific value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Scientific.parse("6.02e23 mols") //{ matchType:'exact', valueString:'6.02e23', unit:'mols' }
	 * Scientific.parse("6.02'23") //{ matchType:'exact', valueString:"6.02'23", unit:'' }
	 * Scientific.parse("6.02") //{ matchType:'none', valueString:'', unit:'' }
	 */
	static parse(str) {
		const valueString = Scientific.getValueString(str)
		if (!valueString) return Scientific.getNullParseObject()

		return {
			matchType: MATCH_EXACT,
			valueString,
			unit: str.substr(valueString.length).trim()
		}
	}

	/**
	 * Since values are always handled as Big instances values for Scientific are always safe
	 * @return {true}
	 */
	static isSafe() {
		return true
	}

	/**
	 * Return a Big instance given a valueString
	 * @param {string} valueString
	 * @return {Big}
	 */
	static getBigValue(valueString) {
		const terms = Scientific.getTerms(valueString)
		return terms.bigValue
	}

	/**
	 * @param {string} valueString
	 * @return {number} The number of significant figures of this instance
	 * @example
	 * Scientific.getNumSigFigs('6.02e23') //3
	 * Scientific.getNumSigFigs('9*10^2') //1
	 * Scientific.getNumSigFigs('6.0e8') //2
	 */
	static getNumSigFigs(valueString) {
		return Scientific.getTerms(valueString).bigDigit.c.length
	}

	/**
	 * Determine if the given valueString represents an integer
	 * @param {string} valueString
	 * @return {boolean} True if valueString is an integer
	 * @example
	 * Scientific.getIsInteger('7e2') //true
	 * Scientific.getIsInteger('7e-2') //false
	 */
	static getIsInteger(valueString) {
		return Decimal.getIsInteger(Scientific.getBigValue(valueString).toString())
	}

	/**
	 * Determine the number of digits represented by the string.
	 * @param {string} valueString
	 * @return {number}
	 * @example
	 * Scientific.getNumDigits('4.9e9') //10
	 */
	static getNumDigits(valueString) {
		return Decimal.getNumDigits(Scientific.getTerms(valueString).bigValue)
	}

	/**
	 * Returns a scientific notation string for a given Big value
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Scientific.getString(Big(700)) //7e2
	 */
	static getString(bigValue) {
		if (bigValue.c.length === 1) {
			return (bigValue.s === 1 ? '' : '-') + bigValue.c[0] + 'e' + bigValue.e
		}

		return (
			(bigValue.s === 1 ? '' : '-') +
			bigValue.c[0] +
			'.' +
			bigValue.c.slice(1).join('') +
			'e' +
			bigValue.e
		)
	}

	// static getStringForType(bigValue, scientificType) {
	// 	switch (scientificType) {
	// 		case SCIENTIFIC_TYPE_APOS:
	// 			return Scientific.createString(bigValue, "'")

	// 		case SCIENTIFIC_TYPE_ASTERISK:
	// 			return Scientific.createString(bigValue, '*10^')

	// 		case SCIENTIFIC_TYPE_E:
	// 			return Scientific.createString(bigValue, 'e')

	// 		case SCIENTIFIC_TYPE_EE:
	// 			return Scientific.createString(bigValue, 'ee')

	// 		case SCIENTIFIC_TYPE_X:
	// 			return Scientific.createString(bigValue, 'x10^')
	// 	}
	// }

	/**
	 * Get Big values for the different components of a scientific string
	 * @param {string} valueString
	 * @return {ScientificTermsObject}
	 * @example
	 * Scientific.getTerms('3.14e2') //{ bigDigit:Big(3.14), bigExponential:Big(2), bigValue:Big(314) }
	 */
	static getTerms(valueString) {
		let digit = null
		let exponential = null

		switch (this.getInputType(valueString)) {
			case SCIENTIFIC_TYPE_APOS:
				;[digit, exponential] = valueString.split("'")
				break

			case SCIENTIFIC_TYPE_ASTERISK:
				;[digit, exponential] = valueString.split('*10^')
				break

			case SCIENTIFIC_TYPE_E:
				;[digit, exponential] = valueString.split('e')
				break

			case SCIENTIFIC_TYPE_EE:
				;[digit, exponential] = valueString.split('ee')
				break

			case SCIENTIFIC_TYPE_X:
				;[digit, exponential] = valueString.split('x10^')
				break
		}

		return {
			bigDigit: Big(digit),
			bigExponential: Big(exponential),
			bigValue: Big(`${digit}e${exponential}`)
		}
	}

	/**
	 * Determine if the digit portion of a scientific value is less than 10
	 * @param {string} valueString
	 * @return {boolean}
	 * @example
	 * Scientific.getIsValidScientific('6.02e23') //true
	 * Scientific.getIsValidScientific('60.2e22') //false
	 */
	static getIsValidScientific(valueString) {
		const digit = getTerms(valueString).bigDigit
		return digit.gte(0) && digit.lte(10) && !digit.eq(10)
	}
}
