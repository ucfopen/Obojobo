import {
	ROUND_TYPE_NONE,
	ROUND_TYPE_ROUND_DIGITS,
	ROUND_TYPE_ROUND_SIG_FIGS
} from './round-types.js'
import { INPUT_TYPE_SCIENTIFIC, INPUT_TYPE_FRACTIONAL } from '../numerics/types/input-types.js'
import ValueRange from '../range/value-range.js'
import getPercentError from '../util/percent-error.js'
import { PERCENT_ERROR, ABSOLUTE_ERROR, NO_ERROR } from './rule-error-types.js'
import { IGNORE_UNIT, ANY_UNIT, MATCHES_UNIT, NO_UNIT } from './unit-types.js'

/**
 * @typedef {Object} NumericRuleScoreOutcomeObject
 * Gets details about how correct a student's answer is
 * @property {Big} roundedBigValue
 * @property {object} errorAmount
 * @property {number} errorAmount.percentError
 * @property {Big} errorAmount.absoluteError
 * @property {boolean} isWithinError
 * @property {'percent'|'absolute'|'noError'} errorType
 */

/**
 * Represents the outcome of checking a NumericRule against a NumericEntry.
 * An instance of this class tells you which parts of a given NumericRule match
 * the NumericEntry.
 * @example
 * const entry = new NumericEntry('4')
 * // Student's answer must have 2-3 significant figures ("4.0" or "4.00")
 * const rule = new NumericRule({ value:'4.0', numSigFigs:'[2,3]', score:100 })
 * const outcome = new NumericRuleOutcome(entry, rule)
 * outcome.isMatched // false (Rule does not match)
 * outcome.scoreOutcome.isWithinError // true (Student answer is the correct value)
 * outcome.isExpectedNumSigFigs // false (Student failed to specify the correct number of sig figs)
 */
export default class NumericRuleOutcome {
	/**
	 * Returns a new range of valid values based on the rule's allowed percentError.
	 * @param {NumericRule} rule
	 * @return {NumericEntryRange}
	 * @example
	 * const rule = new NumericRule({ value:'2', percentError:1 })
	 * const newRange = NumericRuleOutcome.getPercentErrorRange(rule)
	 * newRange.toString() // [1,3]
	 */
	static getPercentErrorRange(rule) {
		const percentError = rule.errorValue
		const cloneRange = rule.value.clone()
		const min = cloneRange.min ? cloneRange.min.numericInstance : null
		const max = cloneRange.max ? cloneRange.max.numericInstance : null

		let newMin, newMax, diff

		if (min) {
			diff = min.bigValue.minus(min.bigValue.div(percentError + 1))
		} else if (max) {
			diff = max.bigValue.minus(max.bigValue.div(percentError + 1))
		}

		if (min) {
			newMin = min.bigValue.minus(diff)
			min.setBigValue(newMin)
		}

		if (max) {
			newMax = max.bigValue.plus(diff)
			max.setBigValue(newMax)
		}

		return cloneRange
	}

	/**
	 * Returns a new range of valid values based on the rule's allowed absoluteError.
	 * @param {NumericRule} rule
	 * @return {NumericEntryRange}
	 * @example
	 * const rule = new NumericRule({ value:'2', absoluteError:0.5 })
	 * const newRange = NumericRuleOutcome.getPercentErrorRange(rule)
	 * newRange.toString() // [1.5,2.5]
	 */
	static getAbsoluteErrorRange(rule) {
		const absError = rule.errorValue
		const cloneRange = rule.value.clone()
		const min = cloneRange.min ? cloneRange.min.numericInstance : null
		const max = cloneRange.max ? cloneRange.max.numericInstance : null

		if (min) {
			const newMin = min.bigValue.minus(absError)
			min.setBigValue(newMin)
		}

		if (max) {
			const newMax = max.bigValue.plus(absError)
			max.setBigValue(newMax)
		}

		console.log('absabsabs', min.getString(), max.getString())

		return cloneRange
	}

	/**
	 * Determine if a rounded student's answer is within the allowed error amount
	 * @param {NumericRule} rule
	 * @param {NumericEntry} roundedEntry
	 * @result {boolean}
	 */
	static getIsWithinError(rule, roundedEntry) {
		switch (rule.errorType) {
			case PERCENT_ERROR:
				// return errorAmount.percentError === null || errorAmount.percentError <= rule.errorValue
				return NumericRuleOutcome.getPercentErrorRange(rule).isValueInRange(roundedEntry)

			case ABSOLUTE_ERROR:
				// return errorAmount.absoluteError.lte(rule.errorValue)
				return NumericRuleOutcome.getAbsoluteErrorRange(rule).isValueInRange(roundedEntry)

			case NO_ERROR:
				// debugger
				return rule.value.isValueInRange(roundedEntry)

			// return rule.value.isValueInRange(roundedBigValue)
			// return errorAmount.absoluteError.eq(0)
		}
	}

	/**
	 * Gets details about how correct a student's answer is
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRule} rule
	 * @return {NumericRuleScoreOutcomeObject}
	 */
	static getScoreOutcome(numericEntry, rule) {
		const roundedEntry = this.getRoundedEntryForRule(numericEntry, rule)
		const errorAmount = {
			percentError: '@TODO',
			absoluteError: '@TODO'
		}
		const isWithinError = NumericRuleOutcome.getIsWithinError(rule, roundedEntry)

		return {
			roundedBigValue: roundedEntry.numericInstance.bigValue,
			errorAmount,
			isWithinError,
			errorType: rule.errorType
		}
	}

	/**
	 * Get the percent and absolute error of a student's answer
	 * @param {NumericRule} rule
	 * @param {Big} roundedStudentBigValue
	 * @return {object} errorAmount
	 * @property {number} errorAmount.percentError
	 * @property {Big} errorAmount.absoluteError
	 */
	static getAnswerErrorAmount(rule, roundedStudentBigValue) {
		return {
			percentError: NumericRuleOutcome.getAnswerPercentErrorAmount(
				rule.value,
				roundedStudentBigValue
			),
			absoluteError: NumericRuleOutcome.getAnswerAbsoluteErrorAmount(
				rule.value,
				roundedStudentBigValue
			)
		}
	}

	/**
	 * Get the percent error of a student's answer
	 * @param {NumericEntryRange} correctAnswerRange
	 * @param {Big} roundedStudentBigValue
	 * @return {number}
	 */
	static getAnswerPercentErrorAmount(correctAnswerRange, roundedStudentBigValue) {
		switch (correctAnswerRange.getValuePosition(roundedStudentBigValue)) {
			case ValueRange.VALUE_BELOW_MIN:
				if (!correctAnswerRange.min) return 0
				return getPercentError(
					roundedStudentBigValue,
					correctAnswerRange.min.numericInstance.bigValue
				)

			case ValueRange.VALUE_ABOVE_MAX:
				if (!correctAnswerRange.max) return 0
				return getPercentError(
					roundedStudentBigValue,
					correctAnswerRange.max.numericInstance.bigValue
				)
		}

		return 0
	}

	/**
	 * Get the absolute error of a student's answer
	 * @param {NumericEntryRange} correctAnswerRange
	 * @param {Big} roundedStudentBigValue
	 * @return {Big}
	 */
	static getAnswerAbsoluteErrorAmount(correctAnswerRange, roundedStudentBigValue) {
		switch (correctAnswerRange.getValuePosition(roundedStudentBigValue)) {
			case ValueRange.VALUE_BELOW_MIN:
				if (!correctAnswerRange.min) return 0
				return correctAnswerRange.min.numericInstance.bigValue.minus(roundedStudentBigValue)

			case ValueRange.VALUE_ABOVE_MAX:
				if (!correctAnswerRange.max) return 0
				return roundedStudentBigValue.minus(correctAnswerRange.max.numericInstance.bigValue)
		}

		return Big(0)
	}

	/**
	 * Returns a new NumericEntry with the value rounded based on the rounding setting
	 * in the given rule. This rounded NumericEntry will be used in calculating the
	 * correctness of a student's answer.
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRule} rule
	 * @return {NumericEntry}
	 */
	static getRoundedEntryForRule(numericEntry, rule) {
		const roundedEntry = numericEntry.clone()

		switch (rule.round) {
			case ROUND_TYPE_NONE:
				return roundedEntry

			case ROUND_TYPE_ROUND_DIGITS:
				let numDigits = Math.max(
					rule.value.min.numericInstance.numDigits,
					rule.value.max.numericInstance.numDigits
				)

				roundedEntry.numericInstance.round(numDigits)
				return roundedEntry

			case ROUND_TYPE_ROUND_SIG_FIGS:
				let numSigFigs = Math.max(
					rule.value.min.numericInstance.numSigFigs,
					rule.value.max.numericInstance.numSigFigs
				)

				roundedEntry.numericInstance.round(numSigFigs)
				return roundedEntry
		}
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedNumSigFigs(numericInstance, rule) {
		return !rule.expectedNumSigFigs || numericInstance.numSigFigs === rule.expectedNumSigFigs
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsOneOfAllowedTypes(numericInstance, rule) {
		return rule.allowedTypes.indexOf(numericInstance.type) > -1
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedFractionReduced(numericInstance, rule) {
		return (
			!rule.isFractionReduced ||
			rule.type !== INPUT_TYPE_FRACTIONAL ||
			numericInstance.isFractionReduced
		)
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedInteger(numericInstance, rule) {
		return rule.isInteger === null || rule.isInteger === numericInstance.isInteger
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedUnits(numericInstance, rule) {
		switch (rule.unitsMatch) {
			case IGNORE_UNIT:
				return true

			case ANY_UNIT:
				return numericInstance.isWithUnit

			case NO_UNIT:
				return !numericInstance.isWithUnit

			case MATCHES_UNIT:
				console.log('kompare', numericInstance.unit, rule.allUnits)
				if (rule.unitsAreCaseSensitive) {
					return rule.allUnits.indexOf(numericInstance.unit) > -1
				} else {
					return (
						rule.allUnits.map(u => u.toLowerCase()).indexOf(numericInstance.unit.toLowerCase()) > -1
					)
				}
		}
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedScientific(numericInstance, rule) {
		return (
			!rule.isValidScientific ||
			rule.type !== INPUT_TYPE_SCIENTIFIC ||
			numericInstance.isValidScientific
		)
	}

	/**
	 * Create a new NumericRuleOutcome instance
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRule} rule
	 */
	constructor(numericEntry, rule) {
		/**
		 * The passed in rule
		 * @type {NumericRule}
		 */
		this.rule = rule

		const numericInstance = numericEntry.numericInstance

		/**
		 * @type {NumericRuleScoreOutcomeObject}
		 */
		this.scoreOutcome = NumericRuleOutcome.getScoreOutcome(numericEntry, this.rule)

		/**
		 * @type {boolean}
		 */
		this.isExpectedType = NumericRuleOutcome.getIsOneOfAllowedTypes(numericInstance, this.rule)

		/**
		 * @type {boolean}
		 */
		this.isExpectedNumSigFigs = NumericRuleOutcome.getIsExpectedNumSigFigs(
			numericInstance,
			this.rule
		)

		/**
		 * @type {boolean}
		 */
		this.isExpectedFractionReduced = NumericRuleOutcome.getIsExpectedFractionReduced(
			numericInstance,
			this.rule
		)

		/**
		 * @type {boolean}
		 */
		this.isExpectedInteger = NumericRuleOutcome.getIsExpectedInteger(numericInstance, this.rule)

		/**
		 * @type {boolean}
		 */
		this.isExpectedUnits = NumericRuleOutcome.getIsExpectedUnits(numericInstance, this.rule)

		/**
		 * @type {boolean}
		 */
		this.isExpectedScientific = NumericRuleOutcome.getIsExpectedScientific(
			numericInstance,
			this.rule
		)

		/**
		 * If true then this rule matches the given NumericEntry
		 * @type {boolean}
		 */
		this.isMatched =
			this.scoreOutcome.isWithinError &&
			this.isExpectedNumSigFigs &&
			this.isExpectedType &&
			this.isExpectedInteger &&
			this.isExpectedFractionReduced &&
			this.isExpectedUnits &&
			this.isExpectedScientific
	}
}
