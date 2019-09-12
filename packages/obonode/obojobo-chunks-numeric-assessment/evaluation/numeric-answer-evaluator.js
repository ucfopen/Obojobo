import NumericRuleSetEvaluator from './numeric-rule-set-evaluator'
import NumericRule from '../rule/numeric-rule'
import NumericEntry from '../entry/numeric-entry'

import NumericAnswerResults from './numeric-answer-results'
import { OK } from '../entry/numeric-entry-statuses'
import { RULE_MATCHED } from './numeric-rule-set-evaluator-statuses'

/**
 * @external {Big} http://mikemcl.github.io/big.js/
 */

/**
 * Class which evaluates a student answer for a numeric question given validation
 * and scoring rules. The answer is restricted based on the given list of types, and behavior
 * changes depending on the types. For example, if only decimal values are allowed then a student
 * answer like "1/2" will result with an invalid input status. If only hexadecimal values are
 * allowed then a student will be able to type 'FF' instead of '0xFF'. By default all types are
 * allowed and equivalent values will be marked as correct. For example, if the answer is '1/3' and
 * the answer '0.333333333' is evaluated this will be considered correct.
 * @example
 * const evaluator = new NumericAnswerEvaluator({
 * 	scoreRuleConfigs: [
 * 		{ value:"1/3", score:100 }
 * 	],
 * 	types: "decimal"
 * })
 *
 * const results = evaluator.evaluate("0.3333333333")
 *
 * console.log(results.status) //"passed"
 * console.log(results.details.score) //100
 */
class NumericAnswerEvaluator {
	/**
	 * Validates and converts a comma separated string of types to an array of types
	 * @param {string} [types] Comma separated list of types (i.e. "decimal,fractional")
	 * @throws Will throw error if invalid type is given
	 * @return {Array|null} An array of valid type strings (or null if called with no argument)
	 */
	static getTypes(types = '') {
		if (types === '') {
			return null
		}

		types = types.split(',').map(t => t.trim().toLowerCase())

		if (!NumericRule.isTypesValid(types)) {
			throw 'Invalid types'
		}

		return types
	}

	/**
	 * Converts RuleConfigObjects into NumericRule instances
	 * @param {RuleConfigObject} ruleConfigs
	 * @param {string[]} types
	 * @return {NumericRule[]} An array of NumericRule instances
	 */
	static getRules(ruleConfigs, types) {
		return ruleConfigs.map(r => new NumericRule(r, types))
	}

	/**
	 * @param {Object} o
	 * @param {RuleConfigObject[]} o.scoreRuleConfigs Rules used to grade the student's answer
	 * @param {RuleConfigObject[]} [o.validationRuleConfigs] Rules used to validate a student's answer
	 * @param {string} [o.types] Comma separated list of types
	 */
	constructor({ validationRuleConfigs = [], scoreRuleConfigs, types = '' }) {
		this.init({ validationRuleConfigs, scoreRuleConfigs, types })
	}

	/**
	 * Initialize all properties
	 * @param {Object} o
	 * @param {RuleConfigObject[]} o.scoreRuleConfigs Rules used to grade the student's answer
	 * @param {RuleConfigObject[]} [o.validationRuleConfigs] Rules used to validate a student's answer
	 * @param {string} [o.types] Comma separated list of types
	 */
	init({ validationRuleConfigs = [], scoreRuleConfigs, types = '' }) {
		/**
		 * @type {string[]}
		 */
		this.types = NumericAnswerEvaluator.getTypes(types)

		/**
		 * @type {NumericRuleSetEvaluator}
		 */
		this.validator = new NumericRuleSetEvaluator({
			rules: NumericAnswerEvaluator.getRules(validationRuleConfigs, this.types),
			types: this.types
		})

		/**
		 * @type {NumericRuleSetEvaluator}
		 */
		this.grader = new NumericRuleSetEvaluator({
			rules: NumericAnswerEvaluator.getRules(scoreRuleConfigs, this.types),
			types: this.types
		})
	}

	/**
	 * Evaluates the given student input against the validation and score rules
	 * @param {string} studentAnswerString
	 * @return {NumericAnswerResultsObject}
	 */
	evaluate(studentAnswerString) {
		let validationResult = null
		let scoreResult = null
		const studentEntry = new NumericEntry(studentAnswerString, this.types)

		if (studentEntry.status === OK) {
			validationResult = this.validator.evaluate(studentEntry)
		}

		if (validationResult && validationResult.status !== RULE_MATCHED) {
			scoreResult = this.grader.evaluate(studentEntry)
		}

		return NumericAnswerResults.getResult(studentEntry, validationResult, scoreResult)
	}
}

export default NumericAnswerEvaluator
