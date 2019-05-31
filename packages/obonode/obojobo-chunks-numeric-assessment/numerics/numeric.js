import { INPUT_TYPE_INVALID } from './types/input-types'
import { MATCH_NONE } from '../entry/match-types'

/**
 * The result of parsing a string for a given numeric class
 * @typedef {Object} NumericParseObject
 * @property {string} matchType
 * @property {string} valueString
 * @property {string} unit
 */

/**
 * Represents that the given input could not be parsed by this numeric type.
 * @typedef {Object} NullNumericParseObject
 * @property {string} matchType 'none'
 * @property {string} valueString ''
 * @property {string} unit ''
 */

/**
 * Base "abstract" class representing different number formats. You shouldn't create an instance of this class directly, rather, you would create instances of one of the super classes (like Decimal or Scientific).
 */
export default class Numeric {
	/**
	 * A string representing this type. (Super classes MUST overwrite this method.)
	 * @type {'invalid'}
	 */
	static get type() {
		return INPUT_TYPE_INVALID
	}

	/**
	 * A human friendly label for this type. (Super classes MUST overwrite this method.)
	 * @type {'Numeric'}
	 */
	static get label() {
		return 'Numeric'
	}

	/**
	 * Convenience method to return a parse object when the input string could not be parsed by this numeric type.
	 * @return {NullNumericParseObject}
	 */
	static getNullParseObject() {
		return {
			matchType: MATCH_NONE,
			valueString: '',
			unit: ''
		}
	}

	/**
	 * Gets details about an answer string.
	 * (Super classes MUST overwrite this method.)
	 * @param {string} str Answer string (i.e. "9.8 m/s^2")
	 * @return {NullNumericParseObject} A null NumericParseObject
	 */
	static parse(str) {
		return Numeric.getNullParseObject()
	}

	/**
	 * Used to determine if a string is equal to a given bigValue. This is mainly used when evaluating if a student answer is equal to a correct answer.
	 * @param {string} str Answer string
	 * @param {Big} bigValue
	 * @return {boolean} True if str is equal to the given bigValue
	 */
	static getIsEqual(str, bigValue) {
		const parsed = this.parse(str)
		return this.getBigValue(parsed.valueString).eq(bigValue)
	}

	/**
	 * Get a string representation of a bigValue with an optional unit appended
	 * @param {Big} bigValue
	 * @param {String} [unit]
	 * @return {string}
	 */
	static getStringWithUnit(bigValue, unit) {
		return this.getString(bigValue) + (unit ? ' ' + unit : '')
	}

	/**
	 * Should return a string in this numeric type given a Big instance
	 * @param {Big} bigValue
	 * @return {string}
	 */
	static getString(bigValue) {
		return bigValue.toString()
	}

	/**
	 * Evaluate if a given string can be held as a value safely (meaning it is less than Number.MAX_SAFE_INTEGER)
	 * (Super classes MUST overwrite this method.)
	 * @param {string} valueString
	 * @return {boolean} False
	 */
	static isSafe(valueString) {
		return false
	}

	/**
	 * Return a Big instance given a valueString.
	 * (Super classes MUST overwrite this method.)
	 * @param {string} valueString
	 * @return {null}
	 */
	static getBigValue(valueString) {
		return null
	}

	/**
	 * Rounds a given Big instance to the number of digits specified.
	 * If toDigits is not specified a clone of the given bigValue is returned instead.
	 * @param {Big} bigValue
	 * @param {number} [toDigits]
	 * @return {Big}
	 */
	static getRoundedBigValue(bigValue, toDigits = null) {
		if (!toDigits) return Big(bigValue)
		return Big(bigValue.toPrecision(toDigits))
	}

	/**
	 * Return the number of significant figures (or null if this type doesn't define sig figs)
	 * @param {string} valueString
	 * @return {number|null}
	 */
	static getNumSigFigs(valueString) {
		return null
	}

	/**
	 * Determine if the given valueString represents an integer
	 * (Super classes MUST overwrite this method.)
	 * @param {string} valueString
	 * @return {null}
	 */
	static getIsInteger(valueString) {
		return null
	}

	/**
	 * Determine the number of digits represented by the string
	 * (Super classes MUST overwrite this method.)
	 * @param {string} valueString
	 * @return {number} 0
	 */
	static getNumDigits(valueString) {
		return 0
	}

	/**
	 * Determine if the given unit is valid
	 * @param {string} unitString
	 * @return {boolean}
	 * @example
	 * Numeric.isValidUnit("") //true
	 * Numeric.isValidUnit("g") //true
	 * Numeric.isValidUnit("Grams") //true
	 * Numeric.isValidUnit("%") //true
	 * Numeric.isValidUnit(".9") //false
	 * Numeric.isValidUnit("66") //false
	 */
	static isValidUnit(unitString) {
		if (!unitString) return true
		if (unitString.indexOf(' ') > -1) return false
		return /^[^0-9,\.].*/.test(unitString)
	}

	/**
	 * Create a new instance given either a string representation of a numeric value or a Big instance. If the value could not be parsed for this type then some properties will not be set (this.matchType will be 'none').
	 * @param {string|Big} stringOrBigValue
	 */
	constructor(stringOrBigValue) {
		if (typeof stringOrBigValue !== 'string') {
			stringOrBigValue = this.constructor.getString(stringOrBigValue)
		}

		this.init(stringOrBigValue)
	}

	/**
	 * Resets all properties to new properties based on the given numeric string
	 * @param {string} str
	 */
	init(str) {
		let parsed = this.constructor.parse(str)

		if (!Numeric.isValidUnit(parsed.unit)) {
			parsed = this.constructor.getNullParseObject()
		}

		/**
		 * @type {string}
		 */
		this.string = str

		/**
		 * @type {('exact' | 'inferred' | 'none')}
		 */
		this.matchType = parsed.matchType

		/**
		 * @type {string}
		 */
		this.unit = parsed.unit

		/**
		 * @type {string}
		 */
		this.valueString = parsed.valueString

		if (this.matchType === MATCH_NONE) return

		/**
		 * @type {Big}
		 */
		this.bigValue = this.constructor.getBigValue(this.valueString)

		/**
		 * @type {string}
		 */
		this.formattedString = this.constructor.getStringWithUnit(this.bigValue, this.unit)
	}

	/**
	 * Changes the value of this instance
	 * @param {Big} bigValue
	 */
	setBigValue(bigValue) {
		this.init(this.constructor.getStringWithUnit(bigValue, this.unit))
	}

	/**
	 * Rounds this instance's bigValue to the number of digits specified
	 * @param {number} toDigits
	 */
	round(toDigits) {
		const roundedBigValue = this.constructor.getRoundedBigValue(this.bigValue, toDigits)
		this.setBigValue(roundedBigValue)
	}

	/**
	 * Set the unit property
	 * @param {string} unit
	 */
	setUnit(unit) {
		this.init(this.constructor.getStringWithUnit(this.bigValue, unit))
	}

	/**
	 * Reset the unit property to ''
	 */
	clearUnit() {
		this.setUnit('')
	}

	toObject() {
		return {
			type: this.type,
			numSigFigs: this.numSigFigs,
			decimalPrecision: this.decimalPrecision,
			bigValue: this.bigValue,
			match: this.match
		}
	}

	toJSON() {
		const o = this.toObject()
		o.bigValue = o.bigValue.toString()

		return o
	}

	/**
	 * Create a copy of this instance
	 * @return {Numeric}
	 */
	clone() {
		return new this.constructor(this.getStringWithUnit())
	}

	/**
	 * Return a string representation of this value of this instance.
	 * @return {string}
	 */
	getString() {
		return this.constructor.getString(this.bigValue)
	}

	/**
	 * Return a full string representation of this instance (value and unit)
	 * @return {string}
	 */
	getStringWithUnit() {
		return this.constructor.getStringWithUnit(this.bigValue, this.unit)
	}

	/**
	 * Determine if a given Big instance is equal to this instance
	 * @param {Big} bigValue
	 * @return {boolean}
	 */
	isEqual(bigValue) {
		return this.constructor.getIsEqual(this.string, bigValue)
	}

	/**
	 * @return {boolean} True if the internal value of this instance is "safe"
	 */
	get isSafe() {
		return this.constructor.isSafe(this.valueString)
	}

	/**
	 * @return {number|null} The number of significant figures of this instance (or null if this numeric type does not define significant figures)
	 */
	get numSigFigs() {
		return this.constructor.getNumSigFigs(this.string)
	}

	/**
	 * @return {boolean} True if the value for this instance is an integer
	 */
	get isInteger() {
		return this.constructor.getIsInteger(this.string)
	}

	/**
	 * @return {boolean} True if this instance has a unit property defined
	 */
	get isWithUnit() {
		return this.unit.length > 0
	}

	/**
	 * @return {boolean} The number of digits this value contains
	 */
	get numDigits() {
		return this.constructor.getNumDigits(this.string)
	}

	/**
	 * @return {string} The type of this instance
	 */
	get type() {
		return this.constructor.type
	}

	/**
	 * @return {string} The human friendly label for this instance
	 */
	get label() {
		return this.constructor.label
	}
}
