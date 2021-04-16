const DraftNodeStore = require('obojobo-express/server/draft_node_store')
const Draft = require('obojobo-express/server/models/draft')
const NumericAnswerEvaluator = require('../../evaluation/numeric-answer-evaluator')
const NumericAssessment = require('../../server/numericassessment')

DraftNodeStore.add(NumericAssessment)

describe('Question', () => {
	let draftTree

	beforeEach(() => {
		draftTree = new Draft(null, {
			id: 'id-na',
			type: 'ObojoboDraft.Chunks.NumericAssessment',
			content: {
				units: [
					{
						data: {},
						text: {
							value: '',
							styleList: null
						}
					}
				]
			},
			children: [
				{
					id: 'id-nc',
					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
					content: {
						score: 100
					},
					children: [
						{
							id: 'id-nc-na',
							type: 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer',
							content: {
								answer: '4',
								requirement: 'exact'
							},
							children: []
						}
					]
				}
			]
		})
	})

	test('nodeName is expected value', () => {
		expect(NumericAssessment.nodeName).toBe('ObojoboDraft.Chunks.NumericAssessment')
	})

	test('Node registers events', () => {
		const spy = jest.spyOn(NumericAssessment.prototype, 'registerEvents')
		const na = new NumericAssessment(jest.fn(), jest.fn(), jest.fn())

		expect(spy).toHaveBeenCalledWith({
			'ObojoboDraft.Chunks.Question:calculateScore': na.onCalculateScore
		})
	})

	test('onCalculateScore does nothing if the question does not contain this node', () => {
		const na = draftTree.root
		const setScore = jest.fn()
		const question = {
			contains: () => false
		}
		const responseRecord = {
			response: {
				value: '4'
			}
		}

		na.onCalculateScore(null, question, responseRecord, setScore)

		expect(setScore).not.toHaveBeenCalled()
	})

	test('onCalculateScore sets a correct score when question is correctly answered', () => {
		const na = draftTree.root
		const setScore = jest.fn()
		const question = {
			contains: () => true
		}
		const responseRecord = {
			response: {
				value: '4'
			}
		}

		na.onCalculateScore(null, question, responseRecord, setScore)

		expect(setScore).toHaveBeenCalledWith(100)
	})

	test('onCalculateScore sets a incorrect score when question is incorrectly answered', () => {
		const na = draftTree.root
		const setScore = jest.fn()
		const question = {
			contains: () => true
		}
		const responseRecord = {
			response: {
				value: '0'
			}
		}

		na.onCalculateScore(null, question, responseRecord, setScore)

		expect(setScore).toHaveBeenCalledWith(0)
	})

	test('onCalculateScore sets a incorrect score when the evaluator status is not passed or failed', () => {
		const spy = jest
			.spyOn(NumericAnswerEvaluator.prototype, 'evaluate')
			.mockReturnValue({ status: 'some-other-status' })

		const na = draftTree.root
		const setScore = jest.fn()
		const question = {
			contains: () => true
		}
		const responseRecord = {
			response: {
				value: '4'
			}
		}

		na.onCalculateScore(null, question, responseRecord, setScore)

		expect(setScore).toHaveBeenCalledWith(0)

		spy.mockRestore()
	})
})
