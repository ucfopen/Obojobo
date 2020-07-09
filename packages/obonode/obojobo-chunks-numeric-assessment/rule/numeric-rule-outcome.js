const ValueRange = require('../range/value-range')
const Big = require('../big')
const getPercentError = require('../util/percent-error')
const {
	ROUND_TYPE_NONE,
	ROUND_TYPE_ROUND_DECIMAL_DIGITS,
	ROUND_TYPE_ROUND_SIG_FIGS
} = require('./round-types')
const { INPUT_TYPE_SCIENTIFIC, INPUT_TYPE_FRACTIONAL } = require('../numerics/types/input-types')
const { PERCENT_ERROR, ABSOLUTE_ERROR, NO_ERROR } = require('./rule-error-types')
const { IGNORE_UNIT, ANY_UNIT, MATCHES_UNIT, NO_UNIT } = require('./unit-types')

/**
 * @typedef {Object} NumericRuleScoreOutcomeObject
 * Gets details about how correct a student's answer is
 * @property {Big} roundedBigValue
 * @property {boolean} isWithinError
 * @property {'percent'|'absolute'|'noError'} errorType
 * @property {boolean} isExactlyCorrect
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
module.exports = class NumericRuleOutcome {
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
		const percentError = rule.errorValue / 100
		const bigValueRange = rule.value.toBigValueRange()
		let min = null
		let max = null

		if (bigValueRange.min) {
			min = bigValueRange.min.minus(bigValueRange.min.div(percentError + 1))
		}

		if (bigValueRange.max) {
			max = bigValueRange.max.minus(bigValueRange.max.div(percentError + 1))
		}

		return NumericRuleOutcome.extendBigValueRange(bigValueRange, min, max)
	}

	/**
	 * Returns a new range of valid values based on the rule's allowed absoluteError.
	 * @param {NumericRule} rule
	 * @return {NumericEntryRange}
	 * @example
	 * const rule = new NumericRule({ value:'2', absoluteError:0.5 })
	 * const newRange = NumericRuleOutcome.getAbsoluteErrorRange(rule)
	 * newRange.toString() // [1.5,2.5]
	 */
	static getAbsoluteErrorRange(rule) {
		const absError = rule.errorValue
		const bigValueRange = rule.value.toBigValueRange()

		return NumericRuleOutcome.extendBigValueRange(bigValueRange, absError, absError)
	}

	/**
	 * Modifies a BigValueRange by extending the min and max by amount
	 * @param {BigValueRange} range
	 * @param {Big} amountMin
	 * @param {Big} amountMax
	 * @return {BigValueRange}
	 */
	static extendBigValueRange(range, amountMin, amountMax) {
		if (range.min && amountMin) {
			range.min = range.min.minus(amountMin)
		}

		if (range.max && amountMax) {
			range.max = range.max.plus(amountMax)
		}

		return range
	}

	/**
	 * Determine if a student's answer is within the allowed error amount
	 * @param {NumericEntry} studentNumericEntry
	 * @param {NumericRule} rule
	 * @result {NumericRuleScoreOutcomeObject}
	 */
	static getScoreOutcome(studentNumericEntry, rule) {
		const isExactlyCorrect = rule.value.isValueInRange(studentNumericEntry)

		switch (rule.errorType) {
			case PERCENT_ERROR:
				return {
					errorType: rule.errorType,
					isExactlyCorrect,
					isWithinError: NumericRuleOutcome.getPercentErrorRange(rule).isValueInRange(
						studentNumericEntry.numericInstance.bigValue
					)
				}

			case ABSOLUTE_ERROR:
				return {
					errorType: rule.errorType,
					isExactlyCorrect,
					isWithinError: NumericRuleOutcome.getAbsoluteErrorRange(rule).isValueInRange(
						studentNumericEntry.numericInstance.bigValue
					)
				}

			case NO_ERROR:
				return {
					errorType: rule.errorType,
					isExactlyCorrect,
					isWithinError: isExactlyCorrect
				}
		}
	}

	// /**
	//  * Gets details about how correct a student's answer is
	//  * @param {NumericEntry} studentNumericEntry
	//  * @param {NumericRule} rule
	//  * @return {NumericRuleScoreOutcomeObject}
	//  */
	// static getScoreOutcome(studentNumericEntry, rule) {
	// 	// const isExactlyCorrect = rule.value.isValueInRange(studentNumericEntry)

	// 	// console.log('gso', isExactlyCorrect, rule.value.toString(), studentNumericEntry)

	// 	// const roundedBigValueRange = NumericRuleOutcome.getRoundedCorrectAnswerBigValueRange(
	// 	// 	studentNumericEntry,
	// 	// 	rule
	// 	// )
	// 	// const roundedStudentAnswer = NumericRuleOutcome.getRoundedStudentBigValue(
	// 	// 	studentNumericEntry,
	// 	// 	rule
	// 	// )

	// 	// // roundedStudentAnswer.numericInstance.round(
	// 	// // 	parseInt(rule.value.max.numericInstance.numSigFigs, 10)
	// 	// // )
	// 	// console.log('rounded correct answer=', roundedBigValueRange.toString())
	// 	// // debugger
	// 	// console.log('students answer=', roundedStudentAnswer.toString())
	// 	// console.log('value=', rule.value.max.numericInstance)
	// 	// console.log('num of correct answer sig figs=', rule.value.max.numericInstance.numSigFigs)
	// 	// console.log('correct?=', roundedBigValueRange.isValueInRange(roundedStudentAnswer))
	// 	// // const errorAmount = {
	// 	// // 	percentError: '@TODO',
	// 	// // 	absoluteError: '@TODO'
	// 	// // }

	// 	// const isWithinError = roundedBigValueRange.isValueInRange(roundedStudentAnswer)

	// 	const errorResults = NumericRuleOutcome.getIsWithinError(studentNumericEntry, rule)

	// 	console.log('iwe', isWithinError, rule, studentNumericEntry.numericInstance.bigValue)

	// 	return {
	// 		...errorResults,
	// 		// roundedBigValueRange,
	// 		// errorAmount,
	// 		// isWithinError,
	// 		errorType: rule.errorType
	// 		// isExactlyCorrect:
	// 	}
	// }

	/**
	 * Get the percent and absolute error of a student's answer
	 * @param {NumericRule} rule
	 * @param {Big} roundedStudentBigValue
	 * @return {object} errorAmount
	 * @property {number} errorAmount.percentError
	 * @property {Big} errorAmount.absoluteError
	 */
	// static getAnswerErrorAmount(rule, roundedStudentBigValue) {
	// 	return {
	// 		percentError: NumericRuleOutcome.getAnswerPercentErrorAmount(
	// 			rule.value,
	// 			roundedStudentBigValue
	// 		),
	// 		absoluteError: NumericRuleOutcome.getAnswerAbsoluteErrorAmount(
	// 			rule.value,
	// 			roundedStudentBigValue
	// 		)
	// 	}
	// }

	/**
	 * Get the percent error of a student's answer
	 * @param {NumericEntryRange} correctAnswerRange
	 * @param {Big} roundedStudentBigValue
	 * @return {number}
	 */
	// static getAnswerPercentErrorAmount(correctAnswerRange, roundedStudentBigValue) {
	// 	switch (correctAnswerRange.getValuePosition(roundedStudentBigValue)) {
	// 		case ValueRange.VALUE_BELOW_MIN:
	// 			if (!correctAnswerRange.min) return 0
	// 			return getPercentError(
	// 				roundedStudentBigValue,
	// 				correctAnswerRange.min.numericInstance.bigValue
	// 			)

	// 		case ValueRange.VALUE_ABOVE_MAX:
	// 			if (!correctAnswerRange.max) return 0
	// 			return getPercentError(
	// 				roundedStudentBigValue,
	// 				correctAnswerRange.max.numericInstance.bigValue
	// 			)
	// 	}

	// 	return 0
	// }

	/**
	 * Get the absolute error of a student's answer
	 * @param {NumericEntryRange} correctAnswerRange
	 * @param {Big} roundedStudentBigValue
	 * @return {Big}
	 */
	// static getAnswerAbsoluteErrorAmount(correctAnswerRange, roundedStudentBigValue) {
	// 	switch (correctAnswerRange.getValuePosition(roundedStudentBigValue)) {
	// 		case ValueRange.VALUE_BELOW_MIN:
	// 			if (!correctAnswerRange.min) return 0
	// 			return correctAnswerRange.min.numericInstance.bigValue.minus(roundedStudentBigValue)

	// 		case ValueRange.VALUE_ABOVE_MAX:
	// 			if (!correctAnswerRange.max) return 0
	// 			return roundedStudentBigValue.minus(correctAnswerRange.max.numericInstance.bigValue)
	// 	}

	// 	return Big(0)
	// }

	/**
	 * Returns a new NumericEntry with the value rounded based on the rounding setting
	 * in the given rule. This rounded NumericEntry will be used in calculating the
	 * correctness of a student's answer.
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRule} rule
	 * @return {NumericEntry}
	 */
	static getRoundedCorrectAnswerBigValueRange(studentNumericEntry, rule) {
		const studentRoundedNumericInstance = studentNumericEntry.clone().numericInstance
		const roundedCorrectAnswerValueRange = rule.value.clone()

		switch (rule.round) {
			case ROUND_TYPE_ROUND_DECIMAL_DIGITS: {
				const numStudentDecimalDigits = studentRoundedNumericInstance.numDecimalDigits

				roundedCorrectAnswerValueRange.min.numericInstance.round(numStudentDecimalDigits)
				roundedCorrectAnswerValueRange.max.numericInstance.round(numStudentDecimalDigits)

				break
			}

			case ROUND_TYPE_ROUND_SIG_FIGS: {
				// const numStudentSigFigs = studentRoundedNumericInstance.numSigFigs
				// debugger
				// console.log(
				// 	'rounding',
				// 	roundedCorrectAnswerValueRange.min.numericInstance.bigValue.toString(),
				// 	'to',
				// 	numStudentSigFigs
				// )

				const minNumSigFigs = parseInt(rule.sigFigs.min, 10)
				roundedCorrectAnswerValueRange.min.numericInstance.round(minNumSigFigs)
				roundedCorrectAnswerValueRange.max.numericInstance.round(minNumSigFigs)

				break
			}
		}

		return roundedCorrectAnswerValueRange.toBigValueRange()
	}

	static getRoundedStudentBigValue(studentNumericEntry, rule) {
		const roundedStudentNumericInstance = studentNumericEntry.clone().numericInstance

		switch (rule.round) {
			case ROUND_TYPE_ROUND_DECIMAL_DIGITS: {
				roundedStudentNumericInstance.round(parseInt(rule.value.min.numericInstance.decimals, 10))
				break
			}

			case ROUND_TYPE_ROUND_SIG_FIGS: {
				// debugger
				roundedStudentNumericInstance.round(parseInt(rule.sigFigs.min, 10))
				break
			}
		}

		return roundedStudentNumericInstance.bigValue
	}

	/**
	 * @param {Numeric} numericInstance
	 * @param {NumericRule} rule
	 * @return {boolean}
	 */
	static getIsExpectedNumSigFigs(numericInstance, rule) {
		// Fractional values have no sig figs, so we ignore the rule in that case
		switch (numericInstance.type) {
			case INPUT_TYPE_FRACTIONAL:
				return true

			default:
				return rule.sigFigs.isValueInRange(Big(numericInstance.numSigFigs))
		}
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
			rule.isFractionReduced === null ||
			rule.type !== INPUT_TYPE_FRACTIONAL ||
			numericInstance.isFractionReduced === rule.isFractionReduced
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
			rule.isValidScientific === null ||
			rule.type !== INPUT_TYPE_SCIENTIFIC ||
			numericInstance.isValidScientific === rule.isValidScientific
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
