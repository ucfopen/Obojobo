const Numeric = require('./numeric')
const Decimal = require('./decimal')
const { INPUT_TYPE_FRACTIONAL } = require('./types/input-types')
const { MATCH_EXACT, MATCH_NONE } = require('../entry/match-types')
const Big = require('../big')
const getPercentError = require('../util/percent-error')

const DEFAULT_TO_FRACTION_ERROR_VALUE = 0.000001

const fractionalRegex = /^[-+]?[0-9]+\/[0-9]+/

/**
 * Object representing the terms of a fraction
 * @typedef {Object} FractionalTermsObject
 * @property {Big} bigNumerator
 * @property {Big} bigDenominator
 */

/**
 * Same as FractionalTermsObject but includes the resulting Big value
 * @typedef FractionalTermsValueObject
 * @property {Big} bigNumerator
 * @property {Big} bigDenominator
 * @property {Big} bigValue
 */

/**
 * A fractional numeric type.  Units may have whitespace between the value but are not required.
 * @example
 * new Fractional("1/2")
 * new Fractional("-1 / 3") // Spaces allowed and are ignored
 * new Fractional("2/4") // Do not have to be reduced (equal to 1/2)
 * new Fractional("99/1g") // Supports units next to value
 * new Fractional("+22/7") // Plus sign optional and is ignored
 * new Fractional("7,392/8,040,112") // Commas optional and are ignored
 */
module.exports = class Fractional extends Numeric {
	/**
	 * A string representing this type
	 * @type {'fractional'}
	 */
	static get type() {
		return INPUT_TYPE_FRACTIONAL
	}

	/**
	 * A human friendly label for this type
	 * @type {'Fraction'}
	 */
	static get label() {
		return 'Fraction'
	}

	/**
	 * Gets details about an answer string.
	 * @param {string} str A potential string representation of a fractional value
	 * @return {NumericParseObject|NullNumericParseObject}
	 * @example
	 * Fractional.parse("1/2") //{ matchType:'exact', valueString:'1/2', unit:'' }
	 * Fractional.parse("2/4g") //{ matchType:'exact', valueString:'2/4', unit:'g' }
	 * Fractional.parse("0.333333") //{ matchType:'none', valueString:'', unit:'' }
	 */
	static parse(str) {
		const matches = fractionalRegex.exec(str)

		if (!matches || !matches.length) return Numeric.getNullParseObject()

		const unit = str.substr(matches[0].length).trim()

		if (!Numeric.isValidUnit(unit)) return Numeric.getNullParseObject()
		return {
			matchType: MATCH_EXACT,
			valueString: matches[0],
			unit
		}
	}

	/**
	 * Since values are always handled as Big instances values for Fractional are always safe
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
	static getBigValueFromString(valueString) {
		return Fractional.getTerms(valueString).bigValue
	}

	/**
	 * Fractional values are never rounded so this simply returns a copy of the given bigValue
	 * @param {Big} bigValue
	 * @return {Big}
	 */
	static getRoundedBigValue(bigValue) {
		return Big(bigValue)
	}

	/**
	 * Get the most reduced terms for a given Big instance
	 * @param {Big} bigValue
	 * @return {FractionalTermsObject}
	 * @example
	 * Fractional.getBigValueReducedTerms(Big(0.5)) // {bigNumerator:Big(1), bigDenominator:Big(2)}
	 */
	static getBigValueReducedTerms(bigValue) {
		const terms = Fractional.getBigValueFractionTerms(bigValue)
		return Fractional.getReducedTerms(terms.bigNumerator, terms.bigDenominator)
	}

	/**
	 * Return a string representation of this value of this instance. Fraction will be in its most reduced form.
	 * @param {Big} bigValue
	 * @return {string}
	 * @example
	 * Fractional.getStringFromBigValue(Big(0.5)) //"1/2"
	 */
	static getStringFromBigValue(bigValue) {
		const terms = Fractional.getBigValueReducedTerms(bigValue)
		return (
			Decimal.getStringFromBigValue(terms.bigNumerator) +
			'/' +
			Decimal.getStringFromBigValue(terms.bigDenominator)
		)
	}

	/**
	 * Get the reduced form of the given values
	 * @param {Big} n Numerator
	 * @param {Big} d Denominator
	 * @return {FractionalTermsObject}
	 */
	static getReducedTerms(n, d) {
		const gcd = Fractional.getGCD(n, d)

		return {
			bigNumerator: n.div(gcd),
			bigDenominator: d.div(gcd)
		}
	}

	/**
	 * Used to determine if a string is equal to a given bigValue. This is mainly used when evaluating if a student answer is equal to a correct answer.
	 * @param {string} str
	 * @param {Big} bigValue
	 * @param {number} [error=0.000001]
	 * @return {boolean}
	 * @example
	 * Fractional.getIsEqual('1/2', Big(0.5)) //true
	 * Fractional.getIsEqual('1/3', Big(0.333)) //false
	 * Fractional.getIsEqual('1/2', Big(0.333333333)) //true
	 */
	static getIsEqual(str, bigValue, error = DEFAULT_TO_FRACTION_ERROR_VALUE) {
		const parsed = Fractional.parse(str)
		const terms = Fractional.getTerms(parsed.valueString)
		const f = Fractional.getReducedTerms(terms.bigNumerator, terms.bigDenominator)
		const g = Fractional.getBigValueReducedTerms(bigValue, error)

		return f.bigNumerator.eq(g.bigNumerator) && f.bigDenominator.eq(g.bigDenominator)
	}

	/**
	 * Compute the greatest common denominator of two Big values
	 * @param {Big} a
	 * @param {Big} b
	 * @return {Big}
	 */
	static getGCD(a, b) {
		a = a.abs()
		b = b.abs()

		return b.eq(0) ? a : Fractional.getGCD(b, a.mod(b))
	}

	/**
	 * Computes close fractional terms for a given Big value. Return values are not guaranteed to be in reduced form.
	 * @see https://stackoverflow.com/a/5128558
	 * @param {Big} bigValue
	 * @param {number} [error=0.000001]
	 * @return {FractionalTermsObject}
	 */
	static getBigValueFractionTerms(bigValue, error = DEFAULT_TO_FRACTION_ERROR_VALUE) {
		const numeratorMultiplier = bigValue.lt(0) ? -1 : 1

		bigValue = bigValue.abs()
		const n = bigValue.minus(bigValue.mod(1)) //Floor

		bigValue = bigValue.minus(n)
		if (bigValue.lt(error)) {
			return { bigNumerator: n.times(numeratorMultiplier), bigDenominator: Big(1) }
		} else if (
			Big(1)
				.minus(error)
				.lt(bigValue)
		) {
			return { bigNumerator: n.plus(1).times(numeratorMultiplier), bigDenominator: Big(1) }
		}

		//The lower fraction is 0/1
		let lowerN = Big(0)
		let lowerD = Big(1)
		//The upper fraction is 1/1
		let upperN = Big(1)
		let upperD = Big(1)

		// eslint-disable-next-line no-constant-condition
		while (true) {
			//The middle fraction is (lowerN + upperN) / (lowerD + upperD)
			const middleN = lowerN.plus(upperN)
			const middleD = lowerD.plus(upperD)
			//If bigValue + error < middle
			if (middleD.times(bigValue.plus(error)).lt(middleN)) {
				//middle is our new upper
				upperN = middleN
				upperD = middleD
				//Else If middle < bigValue - error
			} else if (middleN.lt(bigValue.minus(error).times(middleD))) {
				//middle is our new lower
				lowerN = middleN
				lowerD = middleD
				//Else middle is our best fraction
			} else {
				return {
					bigNumerator: n
						.times(middleD)
						.plus(middleN)
						.times(numeratorMultiplier),
					bigDenominator: middleD
				}
			}
		}
	}

	/**
	 * Determine the percent error between a given Big value and it's closest fractional representation
	 * @param {Big} bigValue
	 * @return {number} The percent error
	 */
	static getFractionStringPercentError(bigValue) {
		const terms = Fractional.getBigValueReducedTerms(bigValue)

		return getPercentError(Big(terms.bigNumerator).div(Big(terms.bigDenominator)), bigValue)
	}

	/**
	 * Parses a string into Big values
	 * @param {string} valueString
	 * @return {FractionalTermsValueObject}
	 * @example
	 * Fractional.getTerms("1/2") // {bigNumerator:Big(1), bigDenominator:Big(2), bigValue:Big(0.5)}
	 */
	static getTerms(valueString) {
		const tokens = valueString.split('/')

		const bigNumerator = Big(tokens[0])
		const bigDenominator = Big(tokens[1])

		return {
			bigNumerator,
			bigDenominator,
			bigValue: bigNumerator.div(bigDenominator)
		}
	}

	/**
	 * Determine if the given valueString represents an integer
	 * @param {string} valueString
	 * @return {boolean} True if the given valueString represents an integer
	 * @example
	 * Fractional.getIsInteger('4/2') //true
	 * Fractional.getIsInteger('1/2') //false
	 */
	static getIsInteger(valueString) {
		return Decimal.getIsInteger(Fractional.getBigValueFromString(valueString).toString())
	}

	/**
	 * Determine if the given valueString is in its most reduced form
	 * @param {string} valueString
	 * @return {boolean}
	 * @example
	 * Fractional.getIsReduced('6/2') //false
	 * Fractional.getIsReduced('3/2') //true
	 */
	static getIsReduced(valueString) {
		const givenTerms = Fractional.getTerms(valueString)

		return Big(Fractional.getGCD(givenTerms.bigNumerator, givenTerms.bigDenominator)).eq(Big(1))
	}

	/**
	 * Create a new instance given either a string representation of a numeric value or a Big instance. If the value could not be parsed for this type then some properties will not be set (this.matchType will be 'none').
	 * @param {string|Big} stringOrBigValue
	 */
	constructor(stringOrBigValue) {
		super(stringOrBigValue)

		if (this.matchType !== MATCH_NONE) {
			/**
			 * @type {FractionalTermsValueObject}
			 */
			this.terms = this.constructor.getTerms(this.valueString)

			/**
			 * @type {boolean}
			 */
			this.isReduced = this.constructor.getIsReduced(this.valueString)
		}
	}
}
