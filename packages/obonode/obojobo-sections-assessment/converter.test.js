/* eslint-disable no-undefined */

const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
import Common from 'obojobo-document-engine/src/scripts/common'
import Converter from './converter'

jest.mock('./post-assessment/editor-registration', () => ({
	helpers: {
		slateToObo: () => 'ActionsChild',
		oboToSlate: () => 'ActionsChildOboToSlate'
	}
}))

jest.mock('./components/rubric/editor-registration', () => ({
	helpers: {
		slateToObo: () => 'RubricChild',
		oboToSlate: () => 'RubricChildOboToSlate'
	}
}))

// Page
Common.Registry.registerEditorModel({
	name: PAGE_NODE,
	menuLabel: 'PAGE_NODE',
	isInsertable: false,
	supportsChildren: true,
	helpers: {
		slateToObo: () => 'PageChild',
		oboToSlate: () => 'PageOboToSlate'
	},
	plugins: {
		renderNode: jest.fn(),
		schema: {}
	},
	getNavItem: jest.fn()
})

// QuestionBank
Common.Registry.registerEditorModel({
	name: QUESTION_BANK_NODE,
	menuLabel: 'QUESTION_BANK_NODE',
	isInsertable: false,
	supportsChildren: true,
	helpers: {
		slateToObo: () => 'QuestionBankChild',
		oboToSlate: () => 'QuestionBankChildOboToSlate'
	},
	plugins: {
		renderNode: jest.fn(),
		schema: {}
	},
	getNavItem: jest.fn()
})

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

		// shouldLockAssessment false -- content.triggers deleted
		slateNode = createSlateNode(false, [])
		oboNode = Converter.slateToObo(slateNode)
		expect(oboNode).toMatchSnapshot()

		// shouldLockAssessment false -- content.triggers retained
		slateNode = createSlateNode(false, [{ type: 'someTrigger' }])
		oboNode = Converter.slateToObo(slateNode)
		expect(oboNode).toMatchSnapshot()

		// shouldLockAssessment false -- content.triggers is undefined
		slateNode = createSlateNode(false, undefined)
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
			{ type: 'onNavEnter', actions: [{ type: 'nav:lock' }] },
			{ type: 'onEndAttempt', actions: [{ type: 'nav:unlock' }] },
			{ type: 'onNavExit', actions: [{ type: 'nav:unlock' }] }
		])
		slateNode = Converter.oboToSlate(oboNode)
		expect(slateNode).toMatchSnapshot()
	})
})
