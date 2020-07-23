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
 * "(*,*)" // All NumericEntries
 * "[0,*)" // All NumericEntries 0 or higher
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
 */

/**
 * A super class of ValueRange which uses NumericEntry instances instead of numbers.
 * @example
 * const range = new NumericEntryRange("[9,10]")
 * range.min // equal to new NumericEntry("9")
 * range.max // equal to new NumericEntry("10")
 */
module.exports = class NumericEntryRange extends ValueRange {
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
		super(
			rangeStringOrRangeObject,
			NumericEntryRange.parseValue.bind(null, types),
			NumericEntryRange.compareValues,
			NumericEntryRange.serializeValue,
			NumericEntryRange.toStringValue
		)
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
}
