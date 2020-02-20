const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const NUMERIC_ANSWER_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer'
const NUMERIC_CHOICE_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice'
const NUMERIC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback'

const EXACT_ANSWER = 'Exact answer'
const EXACT = 'exact'
const MARGIN_OF_ERROR = 'Margin of error'
const MARGIN = 'margin'
const WITHIN_A_RANGE = 'Within a range'
const RANGE = 'range'
const PERCENT = 'Percent'
const PERCENT_S = 'percent'
const ABSOLUTE = 'Absolute'
const ABSOLUTE_S = 'absolute'

const fullTextToSimplifed = {
	[EXACT_ANSWER]: EXACT,
	[MARGIN_OF_ERROR]: MARGIN,
	[WITHIN_A_RANGE]: RANGE,
	[PERCENT]: PERCENT_S,
	[ABSOLUTE]: ABSOLUTE_S
}

const simplifedToFullText = {
	[EXACT]: EXACT_ANSWER,
	[MARGIN]: MARGIN_OF_ERROR,
	[RANGE]: WITHIN_A_RANGE,
	[PERCENT_S]: PERCENT,
	[ABSOLUTE_S]: ABSOLUTE
}

const requirementDropdown = [EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE]
const marginDropdown = [PERCENT, ABSOLUTE]

export {
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_CHOICE_NODE,
	NUMERIC_ANSWER_NODE,
	NUMERIC_FEEDBACK_NODE,
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PERCENT,
	ABSOLUTE,
	fullTextToSimplifed,
	simplifedToFullText,
	requirementDropdown,
	marginDropdown
}
