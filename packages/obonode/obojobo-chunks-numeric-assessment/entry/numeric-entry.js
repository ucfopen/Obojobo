const NumericClasses = require('../numerics/numeric-classes')
const NumericMatches = require('./numeric-matches')

const {
	MATCH_EXACT,
	MATCH_NONE,
	MULTIPLE_EXACT,
	MULTIPLE_INFERRED,
	SINGLE_EXACT,
	SINGLE_INFERRED,
	MATCH_INFERRED,
	NO_MATCHES
} = require('./match-types')
const {
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_SAFE,
	INPUT_NOT_MATCHED,
	INPUT_INVALID,
	OK
} = require('./numeric-entry-statuses')

/**
 * Represents, processes and validates a numeric value in an accepted format. Used as
 * answer values in numeric questions.
 * @example
 * const entry = new NumericEntry('6.02e23 mols', ['decimal', 'scientific'])
 * entry.status // 'ok'
 * entry.numericInstance.type // 'scientific'
 *
 * const badEntry = new NumericEntry('6.02e23 mols', ['decimal'])
 * entry.status // 'inputNotMatched'
 * entry.numericInstance // null
 */
module.exports = class NumericEntry {
	/**
	 * Returns a new NumericMatches object which returns possible NumericEntry instances
	 * which match the type of the entry string.
	 * @param {string} str
	 * @param {string[]|null} [types=null]
	 * @return {NumericMatches}
	 */
	static getMatchingTypes(str, types = null) {
		const matches = new NumericMatches()

		let numericClasses = {}

		if (!types) {
			numericClasses = NumericClasses
		} else {
			types.forEach(t => {
				numericClasses[t] = NumericClasses[t]
			})
		}

		Object.values(numericClasses).forEach(C => {
			const numericInstance = new C(str)

			if (numericInstance.matchType !== MATCH_NONE) {
				matches.add(numericInstance)
			}
		})

		return matches
	}

	/**
	 * Returns the first exact Numeric match (or the first inferred match if no exact
	 * match exists)
	 * @param {NumericMatches} matches
	 * @param {string} status
	 * @return {Numeric|null}
	 */
	static getNumericInstance(matches, status) {
		switch (status) {
			case SINGLE_EXACT:
				return matches.getNumericTypesForMatches(MATCH_EXACT).instances[0]

			case SINGLE_INFERRED:
				return matches.getNumericTypesForMatches(MATCH_INFERRED).instances[0]
		}

		return null
	}

	// Normalizes input by lower-casing the string and removes invalid characters
	/**
	 * Cleans input by removing commas, reducing whitespace to single spaces and
	 * removes extraneous whitespace before and after the string.
	 * @param {string} s
	 * @return {string}
	 * @example
	 * NumericEntry.getProcessedInput('  4,000  g ') //4000 g
	 */
	static getProcessedInput(s) {
		return s
			.replace(/,/g, '') // Remove commas
			.replace(/\s+/g, ' ') // Replace all whitespace with single spaces
			.trim()
	}

	/**
	 * Reduces the given data to a single status value.
	 * Possible status values:
	 * * `inputMatchesMultipleTypes`: There are a few inferred matches and it is not clear which one was intended.
	 * * `inputNotSafe`: The computed value is larger than can be safely computed.
	 * * `inputInvalid`: There was no matching Numeric type, meaning the entry string is malformed.
	 * * `inputNotMatched`: There was no matching Numeric type from the included allowed types, meaning the entry was in a format that is not allowed.
	 * * `ok`: The entry matched one exact or inferred Numeric type.
	 * @param {NumericMatches} matches
	 * @param {Numeric} numericInstance
	 * @param {boolean} isValidInput
	 * @throws Error if multiple exact matches are found
	 * @throws Error if the arguments have unexpected values
	 * @return {'inputMatchesMultipleTypes'|'inputNotSafe'|'inputInvalid'|'inputNotMatched' | 'ok'}
	 */
	static getStatus(matches, numericInstance, isValidInput) {
		if (!isValidInput) {
			return INPUT_INVALID
		}

		if (matches.status === MULTIPLE_EXACT) {
			throw 'critical error'
		}

		if (numericInstance && !numericInstance.isSafe) {
			return INPUT_NOT_SAFE
		}

		if (matches.status === MULTIPLE_INFERRED) {
			return INPUT_MATCHES_MULTIPLE_TYPES
		}

		if (matches.status === NO_MATCHES) {
			return INPUT_NOT_MATCHED
		}

		if (
			numericInstance &&
			(matches.status === SINGLE_EXACT || matches.status === SINGLE_INFERRED)
		) {
			return OK
		}

		throw 'Invalid state'
	}

	/**
	 * Create a new NumericEntry.
	 * @param {string} inputString
	 * @param {string[]} types
	 * @throw Error if inputString exactly matches multiple Numeric types. This should not happen and is a fatal error.
	 */
	constructor(inputString, types = null) {
		if (typeof inputString !== 'string') throw 'inputString must be of type string!'

		/**
		 * The string passed to the constructor
		 * @type {string}
		 */
		this.inputString = inputString

		/**
		 * The allowed formats that the inputString can be in
		 * @type {string[]}
		 */
		this.types = types

		/**
		 * The cleaned up input string
		 * @type {string}
		 */
		this.processedInputString = NumericEntry.getProcessedInput(inputString)

		/**
		 * NumericMatches instance for all Numeric types
		 * @type {NumericMatches}
		 */
		this.allMatches = NumericEntry.getMatchingTypes(this.processedInputString)

		/**
		 * NumericMatches instance for the supplied types
		 * @type {NumericMatches}
		 */
		this.matches = NumericEntry.getMatchingTypes(this.processedInputString, types)

		/**
		 * True if the input didn't match any Numeric type
		 * @type {boolean}
		 */
		this.isValidInput = this.allMatches.numMatches > 0

		/**
		 * The created Numeric class instance.
		 * @type {Numeric|null}
		 */
		this.numericInstance = NumericEntry.getNumericInstance(this.matches, this.matches.status)

		/**
		 * Describes if the input string was understood or matched to a Numeric type.
		 */
		this.status = NumericEntry.getStatus(this.matches, this.numericInstance, this.isValidInput)
	}

	/**
	 * Return a copy of this instance.
	 * @return {NumericEntry}
	 */
	clone() {
		return new NumericEntry(this.inputString, this.types)
	}

	toString() {
		if (!this.numericInstance) return ''
		return this.numericInstance.toString()
	}

	toJSON() {
		return {
			inputString: this.inputString,
			processedInputString: this.processedInputString
		}
	}
}
