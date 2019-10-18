jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	}
}))

jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')

import Converter from './converter'
import {
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_CHOICE_NODE,
	NUMERIC_ANSWER_NODE,
	NUMERIC_FEEDBACK_NODE
} from './constants'

describe('NumericAssessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mock_key',
			type: 'mock_type',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: 'invalid_type'
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mock_key',
			type: 'mock_type',
			data: {
				get: () => {}
			},
			nodes: [
				{
					type: NUMERIC_CHOICE_NODE,
					nodes: [
						{
							type: NUMERIC_ANSWER_NODE,
							nodes: [],
							data: {
								get: () => ({
									requirement: 'exact'
								})
							}
						},
						{
							type: NUMERIC_FEEDBACK_NODE,
							nodes: []
						}
					]
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with two correct', () => {
		const slateNode = {
			key: 'mock_key',
			type: 'mock_type',
			nodes: [
				{
					type: NUMERIC_ASSESSMENT_NODE,
					nodes: [
						{
							type: NUMERIC_CHOICE_NODE,
							data: {
								get: () => {
									return { score: 100 }
								}
							}
						},
						{
							type: NUMERIC_CHOICE_NODE,
							data: {
								get: () => {
									return { score: 100 }
								}
							}
						},
						{
							type: NUMERIC_CHOICE_NODE,
							data: {
								get: () => {
									return { score: 0 }
								}
							}
						}
					]
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with no content', () => {
		const oboNode = {
			id: 'mock_key',
			type: 'mock_type'
		}

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mock_id',
			type: 'mock_type',
			content: {
				numericChoices: [
					{
						type: 'percent',
						score: 100,
						answer: '3',
						margin: '3',
						feedback: {
							id: 'feedback_id',
							type: NUMERIC_FEEDBACK_NODE,
							content: {},
							children: [
								{
									id: 'text_id',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												data: {
													indent: 0
												},
												text: {
													value: '3222',
													styleList: []
												}
											}
										]
									},
									children: []
								}
							]
						},
						requirement: 'margin'
					},
					{
						type: 'absolute',
						score: 100,
						answer: '3',
						margin: '3',
						requirement: 'margin'
					}
				]
			}
		}

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
