const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const SCORE_RULE_NODE = 'ScoreRule'
const NUMERIC_FEEDBACK = 'NumericFeedback'

const EXACT_ANSWER = 'Exact answer'
const MARGIN_OF_ERROR = 'Margin of error'
const WITHIN_A_RANGE = 'Within a range'
const PRECISE_RESPONSE = 'Precise response'
const PERCENT = 'Percent'
const ABSOLUTE = 'Absolute'
const SIGNIFICANT_DIGITS = 'Significant digits'
const DECIMAL_PLACES = 'Decimal places'

const requirementDropdown = [EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE, PRECISE_RESPONSE]
const marginDropdown = [PERCENT, ABSOLUTE]
const precisionDropdown = [SIGNIFICANT_DIGITS, DECIMAL_PLACES]

const simplified = {
	[EXACT_ANSWER]: 'exact',
	[MARGIN_OF_ERROR]: 'margin',
	[WITHIN_A_RANGE]: 'range',
	[PRECISE_RESPONSE]: 'precise'
}

const complexified = {
	exact: EXACT_ANSWER,
	margin: MARGIN_OF_ERROR,
	range: WITHIN_A_RANGE,
	precise: PRECISE_RESPONSE
}

export {
	NUMERIC_ASSESSMENT_NODE,
	SCORE_RULE_NODE,
	NUMERIC_FEEDBACK,
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	PERCENT,
	ABSOLUTE,
	SIGNIFICANT_DIGITS,
	DECIMAL_PLACES,
	requirementDropdown,
	marginDropdown,
	precisionDropdown,
	simplified,
	complexified
}
