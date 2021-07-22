jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: () => ({
				mockChild: true
			}),
			oboToSlate: jest.fn()
		})
	}
}))

jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')

import Converter from './converter'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import newNodeJSON from './empty-node.json'

describe('NumericAssessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = { ...newNodeJSON, id: 'mockId' }

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toEqual({
			id: 'mockId',
			type: 'ObojoboDraft.Chunks.NumericAssessment',
			children: [{ mockChild: true }],
			content: {
				units: [
					{
						text: {
							value: '',
							styleList: null
						},
						data: {}
					}
				]
			}
		})
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockId',
			type: 'ObojoboDraft.Chunks.NumericAssessment',
			children: [
				{
					id: 'mockChoice1Id',
					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
					content: {
						score: 100
					},
					children: [
						{
							id: 'mockAnswer1Id',
							type: 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer',
							content: {
								answer: '1',
								requirement: 'exact'
							}
						},
						{
							id: 'mockFeedback1Id',
							type: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
							content: {},
							children: [
								{
									id: 'mockFeedback1TextId',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												data: {
													indent: 0
												},
												text: {
													value: 'Feedback1',
													styleList: []
												}
											}
										]
									},
									children: []
								}
							]
						}
					]
				},
				{
					id: 'mockChoice2Id',
					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
					content: {
						score: 0
					},
					children: [
						{
							id: 'mockAnswer2Id',
							type: 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer',
							content: {
								answer: '0',
								requirement: 'exact'
							}
						},
						{
							id: 'mockFeedback2Id',
							type: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
							content: {},
							children: [
								{
									id: 'mockFeedback2TextId',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												data: {
													indent: 0
												},
												text: {
													value: 'Feedback2',
													styleList: []
												}
											}
										]
									},
									children: []
								}
							]
						}
					]
				}
			],
			content: {
				units: [
					{
						text: {
							value: 'grams',
							styleList: []
						},
						data: {}
					}
				]
			}
		}

		OboModel.models.mockId = {
			parent: {
				attributes: {
					content: {
						type: 'mockQuestionType'
					}
				}
			}
		}

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
