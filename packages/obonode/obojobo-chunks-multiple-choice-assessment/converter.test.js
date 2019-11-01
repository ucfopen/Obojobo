jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: () => ({
			slateToObo: jest.fn(),
			oboToSlate: jest.fn()
		})
	},
	components: {
		Slider: jest.fn()
	}
}))

jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')

import Converter from './converter'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

describe('MCAssessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: 'NotADefinedNode',
					data: () => ({})
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { responseType: 'pick-one-multiple-correct' }
				}
			},
			nodes: [
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with two correct', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { responseType: 'pick-one' }
				}
			},
			nodes: [
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				},
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				},
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 0 }
						}
					}
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					id: 'mockId',
					type: MCCHOICE_NODE
				},
				{
					type: 'NotADefinedNode'
				}
			],
			content: {}
		}
		OboModel.models = {
			mockKey: {
				parent: {
					attributes: {
						content: {
							type: 'mock-question-type'
						}
					}
				}
			}
		}

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
