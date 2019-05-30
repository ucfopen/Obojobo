/* eslint-disable no-undefined */

const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Converter from './converter'

// Page
jest.mock('obojobo-pages-page/editor', () => ({
	helpers: {
		slateToObo: () => 'PageChild',
		oboToSlate: () => 'PageOboToSlate'
	}
}))

// QuestionBank
jest.mock('obojobo-chunks-question-bank/editor', () => ({
	helpers: {
		slateToObo: () => 'QuestionBankChild',
		oboToSlate: () => 'QuestionBankChildOboToSlate'
	}
}))

// ScoreActions
jest.mock('./post-assessment/editor-component', () => ({
	helpers: {
		slateToObo: () => 'ActionsChild',
		oboToSlate: () => 'ActionsChildOboToSlate'
	}
}))

// Rubric
jest.mock('./components/rubric/editor', () => ({
	helpers: {
		slateToObo: () => 'RubricChild',
		oboToSlate: () => 'RubricChildOboToSlate'
	}
}))

describe('Assessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode', () => {
		const createSlateNode = (checkedValue, triggersValue) => ({
			key: 'mockKey',
			type: 'mockType',
			data: { get: () => ({ rubric: true, triggers: triggersValue }) },
			nodes: [
				{
					type: PAGE_NODE
				},
				{
					type: QUESTION_BANK_NODE
				},
				{
					type: ACTIONS_NODE
				},
				{
					type: RUBRIC_NODE
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						get() {
							return {
								text: 'someAttemptText',
								data: {
									get(arg) {
										if (arg === 'current') return 'someReview'
										// checked
										return checkedValue
									}
								}
							}
						}
					}
				}
			]
		})
		let slateNode = createSlateNode(true, [])
		let oboNode = Converter.slateToObo(slateNode)

		// shouldLockAssessment true
		expect(oboNode).toMatchSnapshot()

		// shouldLockAssessment true and triggers undefined
		slateNode = createSlateNode(true, undefined)
		oboNode = Converter.slateToObo(slateNode)
		expect(oboNode).toMatchSnapshot()

		// shouldLockAssessment false
		slateNode = createSlateNode(false, [])
		oboNode = Converter.slateToObo(slateNode)
		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const createOboNode = (hasRubric, triggers) => ({
			id: 'mockKey',
			get() {
				return {
					triggers,
					scoreActions: 'someScoreActions',
					rubric: hasRubric
				}
			},
			attributes: {
				children: [
					{
						type: PAGE_NODE
					},
					{ type: 'otherType' }
				]
			}
		})

		// startAttemptLock && endAttemptLock == false
		// rubric exists
		let oboNode = createOboNode(true, [])
		let slateNode = Converter.oboToSlate(oboNode)
		expect(slateNode).toMatchSnapshot()

		// startAttemptLock && endAttemptLock == true
		// rubric does not exist
		oboNode = createOboNode(false, [
			{ type: 'onStartAttempt', actions: [{ type: 'nav:lock' }] },
			{ type: 'onEndAttempt', actions: [{ type: 'nav:unlock' }] }
		])
		slateNode = Converter.oboToSlate(oboNode)
		expect(slateNode).toMatchSnapshot()
	})
})
