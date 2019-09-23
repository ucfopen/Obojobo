import NumericRuleOutcome from '../rule/numeric-rule-outcome'
import { NO_RULES, RULE_MATCHED, NO_MATCHING_RULES } from './numeric-rule-set-evaluator-statuses'

/**
 * @typedef {Object} NumericRuleSetEvaluatorResultObject
 * @property {('noRules'|'noMatchingRules'|'ruleMatched')} status
 * @property {object} details
 * @property {NumericRuleOutcome[]} details.ruleOutcomes An array of NumericRuleOutcomes for every NumericRule
 * @property {NumericRuleOutcome[]} [details.matchingOutcomes] An array of NumericRuleOutcomes for every *matching* NumericRule
 * @property {NumericRuleOutcome} [details.matchingOutcome] The first matching NumericRuleOutcome (if there is one)
 * @property {number} details.score (Number 0-100)
 */

/**
 * Given a NumericEntry and a set of NumericRules this class will evaluate and
 * determine the first matching rule (or specify that no rules matched). This is done
 * by creating NumericRuleOutcomes for each NumericRule when given a NumericEntry.
 * @example
 * const evaluator = new NumericRuleSetEvaluator({
 * 	rules: [new NumericRule({ value:'4', score:100 })]
 * })
 * const results = evaluator.evaluate(new NumericEntry('4'))
 * results.status //'ruleMatched'
 * results.details.score //100
 * results.details.matchingOutcome //NumericRuleOutcome instance
 */
export default class NumericRuleSetEvaluator {
	/**
	 * Creates NumericRuleOutcome objects from a NumericEntry and an array of NumericRules
	 * @param {NumericEntry} studentEntry
	 * @param {rules} NumericRule[]
	 * @return {NumericRuleOutcome[]}
	 */
	static getRuleOutcomes(studentEntry, rules) {
		return rules.map(rule => new NumericRuleOutcome(studentEntry, rule))
	}

	/**
	 * Create a new NumericRuleSetEvaluator
	 * @param {object} args
	 * @param {NumericRule[]} args.rules
	 * @param {string[]|null} [args.types=null]
	 */
	constructor({ rules, types = null }) {
		/**
		 * The rules which a NumericEntry will be evaluated against
		 * @type {NumericRule[]}
		 */
		this.rules = null

		/**
		 * Allowed types used to evaluate the NumericEntry and rules
		 * @type {string[]|null}
		 */
		this.types = null

		this.init({ rules, types })
	}

	/**
	 * Reset rules and types
	 * @param {object} args
	 * @param {NumericRule[]} args.rules
	 * @param {string[]|null} [args.types=null]
	 */
	init({ rules, types = null }) {
		this.rules = rules
		this.types = types
	}

	/**
	 * Get details on a given NumericEntry with this instances rule set.
	 * Possible status values:
	 * * `'noRules'`: No NumericRules were specified
	 * * `'noMatchingRules'`: None of the NumericRules matched the NumericEntry
	 * * `'ruleMatched'`: One or more of the NumericRules matched the NumericEntry
	 * @param {NumericEntry} studentEntry
	 * @returns {NumericRuleSetEvaluatorResultObject}
	 */
	evaluate(studentEntry) {
		if (this.rules.length === 0) {
			return {
				status: NO_RULES
			}
		}

		const ruleOutcomes = this.constructor.getRuleOutcomes(studentEntry, this.rules)
		const matchingOutcomes = ruleOutcomes.filter(o => o.isMatched)

		if (matchingOutcomes.length === 0) {
			return {
				status: NO_MATCHING_RULES,
				details: {
					ruleOutcomes,
					score: 0
				}
			}
		}

		const matchingOutcome = matchingOutcomes[0]

		return {
			status: RULE_MATCHED,
			details: {
				ruleOutcomes,
				matchingOutcomes,
				matchingOutcome,
				score: matchingOutcome.rule.score
			}
		}
	}
}
