const CHOICE_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Choice'
const FEEDBACK_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Feedback'

// Whenever an inheriting component is created
// Add its Assessment type to the valid assessments, its answer type to valid answers
// and place its default json into the assessmentToAnswer and answer to Assessment maps
import { NUMERIC_ASSESSMENT_NODE, NUMERIC_ANSWER_NODE } from 'obojobo-chunks-numeric-assessment/constants'
import numericAssessment from 'obojobo-chunks-numeric-assessment/empty-node.json'

import { MC_ASSESSMENT_NODE, MC_ANSWER_NODE } from 'obojobo-chunks-multiple-choice-assessment/constants'
import mcAssessment from 'obojobo-chunks-multiple-choice-assessment/empty-node.json'

const assessmentToAnswer = {
	[NUMERIC_ASSESSMENT_NODE]: numericAssessment.children[0].children[0],
	[MC_ASSESSMENT_NODE]: mcAssessment.children[0].children[0],
}

const answerToAssessment = {
	[NUMERIC_ANSWER_NODE]: numericAssessment,
	[MC_ANSWER_NODE]: mcAssessment,
}

const validAssessments = [NUMERIC_ASSESSMENT_NODE, MC_ASSESSMENT_NODE]
const validAnswers = [NUMERIC_ANSWER_NODE, MC_ANSWER_NODE]

export {
	CHOICE_NODE,
	FEEDBACK_NODE,
	assessmentToAnswer,
	answerToAssessment,
	validAssessments,
	validAnswers
}
