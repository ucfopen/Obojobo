import { INPUT_TYPE_DECIMAL } from './types/input-types.js'
import { MATCH_EXACT, MATCH_NONE } from '../entry/match-types.js'
import Numeric from './numeric.js'
import Big from '../big.js'

const decimalRegex = /^[-\+]?([0-9]+|[0-9]+\.[0-9]+|\.[0-9]+|[0-9]+\.)+/

/**
 * A decimal numeric type. Units may have whitespace between the value but are not required.
 * @example
 * new Decimal("42")
 * new Decimal("-9.2g") // Supports units next to value
 * new Decimal("100.") // Syntax to specify significant figures
 * new Decimal("0%") //"%" is treated as a unit
 * new Decimal("+51.07 mols") // Plus sign optional and is ignored
 * new Decimal("1,024") // Commas optional and are ignored
 */
export default class Decimal extends Numeric {
	/**
	 * A string representing this type
	 * @type {'decimal'}
	 */
	static get type() {
		return INPUT_TYPE_DECIMAL
	}

	/**
	 * A human friendly label for this type
	 * @type {'Decimal'}
	 */
	static get label() {
		return 'Decimal'
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a decimal value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Decimal.parse("-5") //{ matchType:'exact', valueString:'-5', unit:'' }
	 * Decimal.parse("0.2g") //{ matchType:'exact', valueString:'0.2', unit:'g' }
	 * Decimal.parse("2/3 kCal") //{ matchType:'none', valueString:'', unit:'' }
	 */
	static parse(str) {
		const matches = decimalRegex.exec(str)

		if (!matches || !matches.length) return Numeric.getNullParseObject()

		return {
			matchType: MATCH_EXACT,
			valueString: matches[0],
			unit: str.substr(matches[0].length).trim()
		}
	}

	/**
	 * Since values are always handled as Big instances values for Decimal are always safe
	 * @return {true}
	 */
	static isSafe() {
		// Since we use Big there is no limit on the size of the number
		return true
	}

	/**
	 * Return a Big instance given a valueString
	 * @param {string} valueString
	 * @return {Big}
	 */
	static getBigValue(valueString) {
		return Big(valueString)
	}

	/**
	 * Return a string representation of this value of this instance.
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Decimal.getString(Big(2)) //"2"
	 */
	static getString(bigValue) {
		let leftSide
		let rightSide

		if (bigValue.e >= 0) {
			leftSide = bigValue.c.slice(0, bigValue.e + 1).join('')
			if (leftSide.length <= bigValue.e) {
				leftSide = leftSide + '0'.repeat(bigValue.e - leftSide.length + 1)
			}
			rightSide = bigValue.c.slice(bigValue.e + 1).join('')
		} else {
			leftSide = '0'
			rightSide = '0'.repeat(Math.abs(bigValue.e) - 1) + bigValue.c.join('')
		}

		return (
			(bigValue.s === 1 ? '' : '-') +
			(rightSide.length === 0 ? leftSide : leftSide + '.' + rightSide)
		)
	}

	/**
	 * @param {string} valueString
	 * @return {number} The number of significant figures of this instance
	 * @example
	 * Decimal.getNumSigFigs('20') //1
	 * Decimal.getNumSigFigs('9.08') //3
	 * Decimal.getNumSigFigs('100.') //3
	 */
	static getNumSigFigs(valueString) {
		const [leftString, rightString] = valueString.split('.').concat(null)

		const bigLeft = Big(leftString !== '' ? leftString : '0').abs()
		const bigRight = rightString ? Big(rightString) : null

		if (rightString === null) {
			return Decimal.getString(bigLeft).replace(/0+$/, '').length
		}

		if (bigLeft.eq(0)) {
			return Decimal.getString(bigRight).length
		}

		return Decimal.getString(bigLeft).length + rightString.length
	}

	/**
	 * Determine if the given valueString represents an integer
	 * @param {string} valueString
	 * @return {boolean} True if valueString is an integer
	 * @example
	 * Decimal.getIsInteger('5') //true
	 * Decimal.getIsInteger('5.1') //false
	 */
	static getIsInteger(valueString) {
		const bigValue = Big(valueString)
		return bigValue.minus(bigValue.mod(1)).eq(bigValue)
	}

	/**
	 * Determine the number of digits represented by the string
	 * @param {string} valueString
	 * @return {number}
	 * @example
	 * Decimal.getNumDigits('-96.2') //3
	 */
	static getNumDigits(valueString) {
		return Decimal.getString(Big(valueString))
			.replace('-', '')
			.replace('.', '').length
	}
}
