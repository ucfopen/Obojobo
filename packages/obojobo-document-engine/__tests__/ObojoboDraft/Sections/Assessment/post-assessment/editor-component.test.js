/* eslint no-undefined: 0 */

import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('ObojoboDraft/Pages/Page/editor')

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

import Actions from 'ObojoboDraft/Sections/Assessment/post-assessment/editor-component'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'

describe('Actions editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Node component', () => {
		const Node = Actions.components.Node
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

	test('Node component adds child', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		const Node = Actions.components.Node
		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('addAction adds an action with the given range', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		const Node = Actions.components.Node
		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component.instance().addAction('mock range')

		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('Score component', () => {
		const Node = Actions.components.Score
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

	test('Score component changes range', () => {
		const Node = Actions.components.Score
		const component = shallow(<Node node={{ data: { get: () => ({}) } }} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeRange updates the range', () => {
		const Node = Actions.components.Score
		const change = {
			setNodeByKey: jest.fn()
		}
		const component = shallow(
			<Node
				node={{ data: { get: () => ({}) } }}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.instance().changeRange('mock range')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('Score component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Actions.components.Score
		const component = shallow(
			<Node
				node={{
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

		component.find('.delete-button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return null
				}
			},
			nodes: [
				{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
						{
							key: 'mockPage'
						}
					]
				}
			]
		}
		const oboNode = Actions.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = [
			{
				for: 'dummyRange',
				page: 'dummyPage'
			}
		]
		const slateNode = Actions.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders all actions when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: ACTIONS_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Actions.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a score action when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SCORE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Actions.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Actions.plugins.schema.blocks[SCORE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Actions.plugins.schema.blocks[SCORE_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Actions.plugins.schema.blocks[ACTIONS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Actions.plugins.schema.blocks[ACTIONS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
