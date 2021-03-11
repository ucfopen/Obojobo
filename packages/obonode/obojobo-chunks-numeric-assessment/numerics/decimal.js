const { INPUT_TYPE_DECIMAL } = require('./types/input-types')
const { MATCH_EXACT } = require('../entry/match-types')
const Numeric = require('./numeric')
const big = require('../big')

//0
//+0
//-0
//0.0
//0.
//.0
const decimalRegex = /^[-+]?([0-9]+\.[0-9]+|\.[0-9]+|[0-9]+\.|[0-9]+)+$/
const trailingZeroesRegex = /0+$/
const removeTrailingDotRegex = /\.$/

/**
 * A decimal numeric type.
 * @example
 * new Decimal("42")
 * new Decimal("100.") // Syntax to specify significant figures
 * new Decimal("+51.07") // Plus sign optional and is ignored
 * new Decimal("1,024") // Commas optional and are ignored
 */
class Decimal extends Numeric {
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
	 * Returns any trailing zeroes or a trailing dot from a decimal string.
	 * This information does not change the actual numerical value of the number,
	 * but is needed for calculating significant figures.
	 * @param {string} str A decimal string
	 * @return {string}
	 * @example
	 * Decimal.getTrailingSigFigContentFromString("0010.00200") // "00"
	 * Decimal.getTrailingSigFigContentFromString("0010.501") // ""
	 * Decimal.getTrailingSigFigContentFromString("0010") // ""
	 * Decimal.getTrailingSigFigContentFromString("100.") // "."
	 */
	static getTrailingSigFigContentFromString(str) {
		const dotPos = str.indexOf('.')
		if (dotPos === -1) {
			return ''
		}

		if (dotPos === str.length - 1) {
			return '.'
		}

		const tokens = str.split('.')
		if (!tokens[1]) {
			return ''
		}

		const matches = trailingZeroesRegex.exec(tokens[1])
		if (!matches || !matches.length) {
			return ''
		}

		return matches[0]
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a decimal value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Decimal.parse("-5") //{ matchType:'exact', valueString:'-5' }
	 * Decimal.parse("0.2") //{ matchType:'exact', valueString:'0.2' }
	 * Decimal.parse("2/3") //{ matchType:'none', valueString:'' }
	 * Decimal.parse("+010.00") //{ matchType:'exact', valueString:'10.00' }
	 */
	static parse(str) {
		const matches = decimalRegex.exec(str)
		if (!matches || !matches.length) return Numeric.getNullParseObject()

		const unparsedValueString = matches[0]
		const bigValueString = Decimal.getStringFromBigValue(
			Decimal.getBigValueFromString(unparsedValueString)
		)
		const trailingContent = Decimal.getTrailingSigFigContentFromString(unparsedValueString)
		let valueString
		if (bigValueString.indexOf('.') === -1 && trailingContent && trailingContent !== '.') {
			valueString = `${bigValueString}.${trailingContent}`
		} else {
			valueString = `${bigValueString}${trailingContent}`
		}

		return {
			matchType: MATCH_EXACT,
			valueString
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
	static getBigValueFromString(valueString) {
		// Handle special case where number ends in a dot (e.g. "100.")
		valueString = valueString.replace(removeTrailingDotRegex, '')

		return big(valueString)
	}

	/**
	 * Return a string representation of this value of this instance.
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Decimal.getStringFromBigValue(big(2)) //"2"
	 */
	static getStringFromBigValue(bigValue) {
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
		// Remove negative sign
		valueString = valueString.replace('-', '').replace('+', '')

		const [leftString, rightString] = valueString.split('.').concat(null)

		const bigLeft = big(leftString !== '' ? leftString : '0').abs()
		const bigRight = rightString ? big(rightString) : null

		if (rightString === null) {
			return Decimal.getStringFromBigValue(bigLeft).replace(/0+$/, '').length
		}

		if (bigLeft.eq(0)) {
			if (bigRight && bigRight.eq(0)) return 0
			return bigRight ? Decimal.getStringFromBigValue(bigRight).length : 0
		}

		return Decimal.getStringFromBigValue(bigLeft).length + rightString.length
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
		const bigValue = big(valueString)
		return bigValue.minus(bigValue.mod(1)).eq(bigValue)
	}

	/**
	 * Determine the number of decimal digits represented by the string
	 * @param {string} valueString
	 * @return {number}
	 * @example
	 * Decimal.getNumDecimalDigits('-96.2') //1
	 */

	static getNumDecimalDigits(valueString) {
		return (
			Decimal.getStringFromBigValue(Decimal.getBigValueFromString(valueString)).split('.')[1] || ''
		).length
	}
}

module.exports = Decimal
