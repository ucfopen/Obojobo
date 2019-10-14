const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const NUMERIC_ANSWER_NODE = 'ScoreRule'
const NUMERIC_CHOICE_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice'
const NUMERIC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback'

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

export {
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_CHOICE_NODE,
	NUMERIC_ANSWER_NODE,
	NUMERIC_FEEDBACK_NODE,
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
	precisionDropdown
}
