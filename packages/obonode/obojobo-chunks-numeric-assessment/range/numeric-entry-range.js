const ValueRange = require('./value-range')
const NumericEntry = require('../entry/numeric-entry')
const BigValueRange = require('./big-value-range')

/**
 * String describing the range for NumericEntryRange.
 * @typedef {string} NumericEntryRangeString
 * @example
 * "9" // 9
 * "0xFF" // 0xFF
 * "*" // All NumericEntries
 * "(*,*) mols" // All NumericEntries (unit is 'mols')
 * "[0,*)" // All NumericEntries 0 or higher
 * "(9g,12g)" // All NumericEntries above 9 and below 12 (unit is 'g')
 * "(9,12)g" // Alternate syntax of above
 * "[1/2,3/4]" // All NumericEntries between 0.5 to 0.75
 */

/**
 * Object describing a NumericEntryRange range.
 * @typedef {Object} NumericEntryRangeObject
 * @property {NumericEntry|null} [min]
 * @property {boolean|null} [isMinInclusive]
 * @property {NumericEntry|null} [max]
 * @property {boolean|null} [isMaxInclusive]
 * @property {boolean} [isEmpty]
 * @property {string} [unit]
 */

/**
 * A super class of ValueRange which uses NumericEntry instances instead of numbers.
 * Adds the option to specify a unit in the range. The unit is not used in calcuating
 * if a given value is in a range, rather, it is a simple property on the instance.
 * This allows you to check if a student's entry is inside the range and to check if
 * they included the correct unit.
 * @example
 * const range = new NumericEntryRange("[9,10]g")
 * range.min // equal to new NumericEntry("9")
 * range.max // equal to new NumericEntry("10")
 * range.unit // "g"
 */
module.exports = class NumericEntryRange extends ValueRange {
	// Handles strings like '[1,2]g', returning '[1,2]' and 'g'.
	/**
	 * Extracts the unit from the given range string and returns an object giving you
	 * the range string without units and the extracted unit
	 * @param {NumericEntryRangeString} s
	 * @return {Object} Extracted values
	 * @property {string} unit
	 * @property {string} rangeString
	 */
	static getRangeAndUnitFromString(s) {
		const closingCharacterIndex = Math.max(s.indexOf(']'), s.indexOf(')'))

		let unit = ''
		let rangeString = s

		if (closingCharacterIndex > -1) {
			unit = s.substr(closingCharacterIndex + 1).trim()
			rangeString = s.substr(0, closingCharacterIndex + 1)
		}

		return {
			unit,
			rangeString
		}
	}

	/**
	 * Compares two NumericEntry instances. Equivalency is determined by numericInstance.isEqual and comparing the bigValues of each instance.
	 * @param {NumericEntry} a
	 * @param {NumericEntry} b
	 * @return {-1|0|1}
	 */
	static compareValues(a, b) {
		// If either numericInstance says that the two values are equal we consider
		// them equal
		const aIsEqualB = a.numericInstance.isEqual(b.numericInstance.bigValue)
		const bIsEqualA = b.numericInstance.isEqual(a.numericInstance.bigValue)

		// console.log('compareValues', a.toString(), b.toString(), aIsEqualB, bIsEqualA)

		if (aIsEqualB || bIsEqualA) return 0
		if (a.numericInstance.bigValue.lt(b.numericInstance.bigValue)) return -1
		return 1
	}

	/**
	 * Create NumericEntries out of strings
	 * @param {string[]} types
	 * @param {string} inputString
	 * @return {NumericEntry}
	 */
	static parseValue(types, inputString) {
		if (inputString === null) return null
		return new NumericEntry(inputString, types)
	}

	/**
	 * Determine the unit based on the various type syntaxes (i.e. `[4,5]`, `[4kg,5kg]` or `[4,5]kg`)
	 * @param {string} combinedUnit
	 * @param {string} minUnit
	 * @param {string} maxUnit
	 * @throws Error if given two conflicting units or specify both syntaxes (i.e. `[4g,5kg]`, `[4g,5g]kg`)
	 */
	static getUnit(combinedUnit, minUnit, maxUnit) {
		if (minUnit && maxUnit && minUnit !== maxUnit) {
			throw 'Unable to have different units'
		}
		if ((minUnit || maxUnit) && combinedUnit) {
			throw 'Unable to define both types of units'
		}

		return combinedUnit || minUnit || maxUnit || ''
	}

	/**
	 * Get a serialized value for a NumericEntry
	 * @param {NumericEntry|null} o
	 * @return {string|null}
	 */
	static serializeValue(o) {
		return o === null ? o : o.numericInstance.toString()
	}

	/**
	 * Get a string representation for a NumericEntry
	 * @param {NumericEntry|null} o
	 * @return {string}
	 */
	static toStringValue(o) {
		return o === null ? '*' : o.numericInstance.toString()
	}

	/**
	 * Create a new NumericEntryRange
	 * @param {NumericEntryRangeString|NumericEntryRangeObject} rangeStringOrRangeObject
	 * @param {string[]} types
	 */
	constructor(rangeStringOrRangeObject = true, types) {
		let unit = ''

		if (typeof rangeStringOrRangeObject === 'string') {
			const parsed = NumericEntryRange.getRangeAndUnitFromString(rangeStringOrRangeObject)
			rangeStringOrRangeObject = parsed.rangeString
			unit = parsed.unit
		} else {
			unit =
				rangeStringOrRangeObject && rangeStringOrRangeObject.unit
					? rangeStringOrRangeObject.unit
					: ''
		}

		super(
			rangeStringOrRangeObject,
			NumericEntryRange.parseValue.bind(null, types),
			NumericEntryRange.compareValues,
			NumericEntryRange.serializeValue,
			NumericEntryRange.toStringValue
		)

		/**
		 * The given unit (if any). Defaults to `''`.
		 * @type {string}
		 */
		this.unit = NumericEntryRange.getUnit(
			unit,
			this.min ? this.min.numericInstance.unit : null,
			this.max ? this.max.numericInstance.unit : null
		)

		// Remove units
		// if (this.min) this.min.numericInstance.clearUnit()
		// if (this.max) this.max.numericInstance.clearUnit()
	}

	/**
	 * Returns a BigValueRange version of this range
	 * @return {BigValueRange}
	 */
	toBigValueRange() {
		return new BigValueRange({
			isClosed: this.isClosed,
			isMinInclusive: this.isMinInclusive,
			isMaxInclusive: this.isMaxInclusive,
			min: this.min !== null && this.min.numericInstance ? this.min.numericInstance.bigValue : null,
			max: this.max !== null && this.max.numericInstance ? this.max.numericInstance.bigValue : null
		})
	}

	/**
	 * Returns a NumericEntryRangeObject representing this range.
	 * @return {NumericEntryRangeObject}
	 */
	toJSON() {
		const o = super.toJSON()

		o.unit = this.unit

		return o
	}
}
