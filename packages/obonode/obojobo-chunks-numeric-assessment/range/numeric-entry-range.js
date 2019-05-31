import ValueRange from './value-range'
import NumericEntry from '../entry/numeric-entry'

/**
 * String describing the range for NumericEntryRange.
 * @typedef {string} NumericEntryRangeString
 * @example
 * "9" // 9
 * "0xFF" // 0xFF
 * "[,]" // All NumericEntries
 * "[,] mols" // All NumericEntries (unit is 'mols')
 * "[0,4]" // All NumericEntries that equate to 0 to 4
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
 * @property {boolean} [isClosed]
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
 * range.min // equal to new NumericEntry("9g")
 * range.max // equal to new NumericEntry("10g")
 * range.unit // "g"
 */
export default class NumericEntryRange extends ValueRange {
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
		console.log('con', a, b)
		const aIsEqualB = a.numericInstance.isEqual(b.numericInstance.bigValue)
		const bIsEqualA = b.numericInstance.isEqual(a.numericInstance.bigValue)

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
		console.log('pv', types, inputString, new NumericEntry(inputString, types))
		return new NumericEntry(inputString, types)
	}

	/**
	 * Create a new NumericEntryRange
	 * @param {NumericEntryRangeString|NumericEntryRangeObject} rangeStringOrRangeObject
	 * @param {string[]} types
	 * @throws Error if given two conflicting units (i.e. `"[4g,5kg]"`)
	 */
	constructor(rangeStringOrRangeObject = false, types) {
		let unit = ''

		if (typeof rangeStringOrRangeObject === 'string') {
			const parsed = NumericEntryRange.getRangeAndUnitFromString(rangeStringOrRangeObject)
			rangeStringOrRangeObject = parsed.rangeString
			unit = parsed.unit
		} else {
			unit = rangeStringOrRangeObject.unit || ''
		}

		super(
			rangeStringOrRangeObject,
			NumericEntryRange.parseValue.bind(null, types),
			NumericEntryRange.compareValues
		)

		// this.types = types

		let valueUnits = []
		if (this.min) valueUnits.push(this.min.numericInstance.unit)
		if (this.max) valueUnits.push(this.max.numericInstance.unit)

		valueUnits = [...new Set(valueUnits)]

		if (valueUnits.length > 1) {
			throw 'Unable to have different units'
		}

		const valueUnit = valueUnits.length > 0 ? valueUnits[0] : ''

		if (valueUnit !== '' && unit !== '' && valueUnit !== unit) {
			throw 'Unable to have different units'
		}

		if (unit === '') {
			unit = valueUnit
		}

		// Remove units
		if (this.min) this.min.numericInstance.clearUnit()
		if (this.max) this.max.numericInstance.clearUnit()

		/**
		 * The given unit (if any). Defaults to `''`.
		 * @type {string}
		 */
		this.unit = unit
	}

	// get isSafe() {
	// 	console.log('@TODO!')
	// 	return (this.min === null || this.min.isSafe) && (this.max === null || this.max.isSafe)
	// }

	/**
	 * Returns a NumericEntryRangeObject representing this range.
	 * @return {NumericEntryRangeObject}
	 */
	toJSON() {
		const o = super.toJSON()

		o.min = o.min.numericInstance.getString()
		o.max = o.max.numericInstance.getString()
		o.unit = this.unit

		return o
	}
}
