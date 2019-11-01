/* eslint-disable no-undefined */

import Converter from './converter'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter',
	() => ({
		helpers: {
			slateToObo: () => 'ActionsChild',
			oboToSlate: () => 'ActionsChildOboToSlate'
		}
	})
)

describe('Assessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				// no nodes or text with get returning null
				// creates `"null": undefined`
				{
					data: {
						get: () => null
					}
				},
				// no nodes or text with get returning a key
				// creates `"mock-name-1": undefined`
				{
					data: {
						get: () => 'mock-name-1'
					}
				},
				// no nodes, has text and get returns a key
				// creates "mock-name-2": "mock-node-2-text",
				{
					data: {
						get: () => 'mock-name-2'
					},
					text: 'mock-node-2-text'
				},
				// no nodes, EMPTRY text, get returns a key
				// is not added
				{
					data: {
						get: () => 'mock-name-3'
					},
					text: ''
				},
				// list node
				// creates mods array
				{
					type: MOD_LIST_NODE,
					data: {
						get: () => ({})
					},
					nodes: [
						{
							key: 'mockMod',
							nodes: {
								get: () => ({
									text: 'mockParameter'
								})
							}
						}
					]
				}
			]
		}

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchInlineSnapshot(`
		Object {
		  "failedResult": undefined,
		  "passedResult": undefined,
		  "unableToPassResult": undefined,
		}
	`)
	})

	test('slateToObo converts a Slate node to an OboNode with no mods', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: []
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchInlineSnapshot(`
		Object {
		  "failedResult": undefined,
		  "passedResult": undefined,
		  "unableToPassResult": undefined,
		}
	`)
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: 100,
			failedResult: 0,
			unableToPassResult: 0,
			mods: [
				{
					attemptCondition: 1,
					reward: 10
				}
			]
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node without mods', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: 100,
			failedResult: 0,
			unableToPassResult: 0
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
