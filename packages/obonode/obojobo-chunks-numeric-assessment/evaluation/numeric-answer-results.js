const {
	FAILED,
	PASSED,
	FAILED_VALIDATION,
	INPUT_INVALID,
	INPUT_NOT_SAFE,
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_MATCHED
} = require('./numeric-answer-result-statuses')
const { RULE_MATCHED } = require('./numeric-rule-set-evaluator-statuses')

/**
 * Object representing the evaluation of a student answer
 * @typedef {Object} NumericAnswerResultsObject
 * @property {('failed' | 'passed' | 'failedValidation' | 'inputMatchesMultipleTypes' | 'inputInvalid' | 'inputNotMatched' | 'inputNotSafe')} status The status
 * @property {NumericEntry} entry NumericEntry of the student's answer
 * @property {Object} details Properties differ depending on status
 */

/**
 * Contains a few utility methods used by NumericAnswerEvaluator to summarize the
 * evaluation results.
 */
module.exports = class NumericAnswerResults {
	/**
	 * Returns an object of suggestions from a NumericMatches instance where there
	 * are multiple inferred matches. This would be used to create a UI asking a student
	 * to clarify what they meant by their answer.
	 * @param {NumericMatches} matches
	 * @return {object[]} suggestions
	 * @property {string} suggestions.label
	 * @property {string} suggestions.stringValue
	 * @example
	 * const matches = new NumericMatches()
	 * matches.add(new Hexadecimal('1101'))
	 * matches.add(new Binary('1101'))
	 * matches.status //'multipleInferred'
	 * // Unclear if student meant 0x1101 or 0b1101!
	 * const suggestions = NumericAnswerResults.getSuggestions(matches)
	 * console.log(suggestions)
	 * // [
	 * //	{ label:'Hexadecimal', stringValue:'0x1101' },
	 * //	{ label:'Binary', stringValue:'0b1101' }
	 * // ]
	 */
	static getSuggestions(matches) {
		return matches.getNumericTypesForMatches('inferred').numericTypes.map(type => ({
			label: matches.getInstance(type).label,
			stringValue: matches.getInstance(type).toString()
		}))
	}

	/**
	 * Returns a summary of the a student's answer, the validation result and the
	 * score result.
	 * Possible status values:
	 * * `'inputMatchesMultipleTypes'`: It's unclear what the student meant as their answer matches multiple Numeric classes. Student should be asked to clarify.
	 * * `'inputNotSafe'`: Students response was larger than could be safely computed - Student will need to resubmit with a smaller value.
	 * * `'inputInvalid'`: Students response wasn't understood as it didn't match any Numeric type. Student will need to fix their response and resubmit.
	 * * `'inputNotMatched'`: Students response didn't match one of the allowed Numeric types (for example, they entered '1/2' but only decimal values were allowed).
	 * * `'failedValidation'`: Students response matched one of the validation rules, meaning something about their response is not valid. Student may be given feedback but will need to resubmit.
	 * * `'failed'`: Student did not answer correctly - either they matched a 0-scoring score rule or no score rule was matched.
	 * * `'passed'`: Student answered correctly, meaning their response matched a 100-scoring score rule.
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRuleSetEvaluatorResultObject} validationResult
	 * @param {NumericRuleSetEvaluatorResultObject} scoreResult
	 */
	static getStatus(numericEntry, validationResult, scoreResult) {
		switch (numericEntry.status) {
			case INPUT_MATCHES_MULTIPLE_TYPES:
			case INPUT_NOT_SAFE:
			case INPUT_INVALID:
			case INPUT_NOT_MATCHED:
				return numericEntry.status
		}

		if (validationResult.status === RULE_MATCHED) {
			return FAILED_VALIDATION
		}

		if (scoreResult.details.score !== 100) {
			return FAILED
		}

		return PASSED
	}

	/**
	 * Summarizes the results of a student's response and the validation & score
	 * evaluations.
	 * @param {NumericEntry} numericEntry
	 * @param {NumericRuleSetEvaluatorResultObject} validationResult
	 * @param {NumericRuleSetEvaluatorResultObject} scoreResult
	 * @return {NumericAnswerResultsObject}
	 */
	static getResult(numericEntry, validationResult, scoreResult) {
		let details = {}
		const status = NumericAnswerResults.getStatus(numericEntry, validationResult, scoreResult)

		switch (status) {
			case INPUT_MATCHES_MULTIPLE_TYPES:
				details = {
					suggestions: NumericAnswerResults.getSuggestions(numericEntry.matches)
				}
				break

			case INPUT_NOT_SAFE:
				details = {
					maxNumber: Number.MAX_SAFE_INTEGER
				}
				break

			case INPUT_INVALID:
			case INPUT_NOT_MATCHED:
				details = {}
				break

			case FAILED_VALIDATION:
				details = {
					matchingOutcome: validationResult.details.matchingOutcome
				}
				break

			case FAILED:
				details = {
					matchingOutcome: scoreResult.details.matchingOutcome || null,
					score: scoreResult.details.score
				}
				break

			case PASSED:
				details = {
					matchingOutcome: scoreResult.details.matchingOutcome,
					score: scoreResult.details.score
				}
				break
		}

		return {
			status,
			details,
			entry: numericEntry
		}
	}
}
