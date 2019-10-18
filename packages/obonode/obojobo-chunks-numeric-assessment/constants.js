const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const NUMERIC_ANSWER_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericAsnwer'
const NUMERIC_CHOICE_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice'
const NUMERIC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback'

const EXACT_ANSWER = 'Exact answer'
const EXACT = 'exact'
const MARGIN_OF_ERROR = 'Margin of error'
const MARGIN = 'margin'
const WITHIN_A_RANGE = 'Within a range'
const RANGE = 'range'
const PRECISE_RESPONSE = 'Precise response'
const PRECISE = 'precise'
const PERCENT = 'Percent'
const PERCENT_S = 'percent'
const ABSOLUTE = 'Absolute'
const ABSOLUTE_S = 'absolute'
const SIGNIFICANT_DIGITS = 'Significant digits'
const SIG_FIGS = 'sig-figs'
const DECIMAL_PLACES = 'Decimal places'
const DECIMALS = 'decimals'

const fullTextToSimplifed = {
	[EXACT_ANSWER]: EXACT,
	[MARGIN_OF_ERROR]: MARGIN,
	[WITHIN_A_RANGE]: RANGE,
	[PRECISE_RESPONSE]: PRECISE,
	[PERCENT]: PERCENT_S,
	[ABSOLUTE]: ABSOLUTE_S,
	[SIGNIFICANT_DIGITS]: SIG_FIGS,
	[DECIMAL_PLACES]: DECIMALS
}

const simplifedToFullText = {
	[EXACT]: EXACT_ANSWER,
	[MARGIN]: MARGIN_OF_ERROR,
	[RANGE]: WITHIN_A_RANGE,
	[PRECISE]: PRECISE_RESPONSE,
	[PERCENT_S]: PERCENT,
	[ABSOLUTE_S]: ABSOLUTE,
	[SIG_FIGS]: SIGNIFICANT_DIGITS,
	[DECIMALS]: DECIMAL_PLACES
}

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
	fullTextToSimplifed,
	simplifedToFullText,
	requirementDropdown,
	marginDropdown,
	precisionDropdown
}
