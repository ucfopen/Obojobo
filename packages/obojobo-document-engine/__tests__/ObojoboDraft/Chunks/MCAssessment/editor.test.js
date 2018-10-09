import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/editor')

import MCAssessment from '../../../../ObojoboDraft/Chunks/MCAssessment/editor'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

describe('MCAssessment editor', () => {
	test('Node builds the expected component', () => {
		const Node = MCAssessment.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ChoiceList builds the expected component', () => {
		const Node = MCAssessment.components.ChoiceList
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ChoiceList component adds choice', () => {
		const Node = MCAssessment.components.ChoiceList

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Settings builds the expected component', () => {
		const Node = MCAssessment.components.Settings
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

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
					type: CHOICE_LIST_NODE,
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
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						first: () => ({
							data: {
								get: () => 'pick-one-multiple-correct'
							}
						}),
						last: () => ({
							data: {
								get: () => false
							}
						})
					}
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

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
					type: CHOICE_LIST_NODE,
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
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						first: () => ({
							data: {
								get: () => 'pick-one'
							}
						}),
						last: () => ({
							data: {
								get: () => false
							}
						})
					}
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: MCCHOICE_NODE
				},
				{
					type: 'NotADefinedNode'
				}
			],
			content: {}
		}
		const slateNode = MCAssessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a MCAssessment when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAssessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a Setting when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SETTINGS_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAssessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a ChoiceList when passed', () => {
		const props = {
			node: {
				attributes: { dummy: 'dummyData' },
				type: CHOICE_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAssessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid first child in MCAssessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid second child in MCAssessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required first child in MCAssessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required first child in MCAssessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in ChoiceList', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[CHOICE_LIST_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children in ChoiceList', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[CHOICE_LIST_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes first invalid child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		change.withoutNormalization = funct => funct(change)

		MCAssessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		change.withoutNormalization = funct => funct(change)

		MCAssessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
