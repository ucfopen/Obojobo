/* eslint-disable no-undefined */
import Converter from './converter'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: type => ({
			slateToObo: () => ({
				slateToOboReturnFor: type
			}),
			oboToSlate: type => ({
				oboToSlateReturnFor: type
			})
		})
	},
	models: {
		OboModel: {
			models: {
				mockKey: {
					get: jest.fn()
				}
			}
		}
	}
}))

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Assessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode', () => {
		const createSlateNode = triggersValue => ({
			id: 'mockKey',
			type: 'mockType',
			content: {
				rubric: true,
				triggers: triggersValue
			},
			children: [
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
				}
			]
		})

		let slateNode = createSlateNode([])
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()

		slateNode = createSlateNode(undefined)
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()

		slateNode = createSlateNode([{ type: 'someTrigger' }])
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with no model', () => {
		const createSlateNode = triggersValue => ({
			id: 'otherMockKey',
			type: 'mockType',
			content: {
				rubric: true,
				triggers: triggersValue
			},
			children: [
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
				}
			]
		})

		let slateNode = createSlateNode([])
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()

		slateNode = createSlateNode(undefined)
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()

		slateNode = createSlateNode([{ type: 'someTrigger' }])
		expect(Converter.slateToObo(slateNode)).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const createOboNode = (rubric, triggers) => ({
			attributes: {
				id: 'mockKey',
				content: {
					triggers,
					scoreActions: 'someScoreActions',
					rubric: rubric
				},
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
		let oboNode = createOboNode({}, [])
		expect(Converter.oboToSlate(oboNode)).toMatchSnapshot()

		// startAttemptLock && endAttemptLock == true
		// rubric does not exist
		oboNode = createOboNode(false, [
			{ type: 'onNavEnter', actions: [{ type: 'nav:lock' }] },
			{ type: 'onEndAttempt', actions: [{ type: 'nav:unlock' }] },
			{ type: 'onNavExit', actions: [{ type: 'nav:unlock' }] }
		])
		expect(Converter.oboToSlate(oboNode)).toMatchSnapshot()
	})
})
