/* eslint no-undefined: 0 */

import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Pages/Page/editor')
jest.mock('../../../../ObojoboDraft/Chunks/QuestionBank/editor')
jest.mock('../../../../ObojoboDraft/Sections/Assessment/components/rubric/editor')
jest.mock('../../../../ObojoboDraft/Sections/Assessment/post-assessment/editor')

import Assessment from '../../../../ObojoboDraft/Sections/Assessment/editor'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Assessment editor', () => {
	test('Node component', () => {
		const Node = Assessment.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: {
						size: 5
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

		const Node = Assessment.components.Node
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

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ModList component', () => {
		const Node = Assessment.components.Settings
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

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return {}
				}
			},
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
						get: () => {
							return {
								text: 'mockText',
								data: {
									get: jest.fn()
								}
							}
						}
					}
				}
			]
		}
		const oboNode = Assessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = {
			get: jest.fn().mockReturnValueOnce({}),
			attributes: {
				children: [
					{
						type: PAGE_NODE
					},
					{
						type: QUESTION_BANK_NODE
					}
				]
			}
		}
		const slateNode = Assessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = {
			get: jest.fn().mockReturnValueOnce({ rubric: 'mockRubric' }),
			attributes: {
				children: [
					{
						type: PAGE_NODE
					},
					{
						type: QUESTION_BANK_NODE
					}
				]
			}
		}
		const slateNode = Assessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders the Assessment when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: ASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Assessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders Settings when passed', () => {
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

		expect(Assessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.validateNode exits if not the right type', () => {
		expect(
			Assessment.plugins.validateNode({
				object: 'text'
			})
		).toEqual(undefined)

		expect(
			Assessment.plugins.validateNode({
				object: 'block',
				type: ASSESSMENT_NODE
			})
		).toEqual(undefined)

		expect(
			Assessment.plugins.validateNode({
				object: 'block',
				type: SETTINGS_NODE,
				nodes: {
					first: jest.fn().mockReturnValueOnce({
						object: 'text'
					})
				}
			})
		).toEqual(undefined)

		expect(
			Assessment.plugins.validateNode({
				object: 'block',
				type: SETTINGS_NODE,
				nodes: {
					first: jest.fn().mockReturnValueOnce({
						object: 'object'
					}),
					size: 2
				}
			})
		).toEqual(undefined)

		expect(
			Assessment.plugins.validateNode({
				object: 'block',
				type: SETTINGS_NODE,
				nodes: {
					first: jest
						.fn()
						.mockReturnValueOnce({
							object: 'object'
						})
						.mockReturnValueOnce({
							object: 'object',
							data: { get: () => 'attempts' }
						}),
					size: 1
				}
			})
		).toEqual(undefined)
	})

	test('plugins.validateNode fixes improper settings', () => {
		const node = {
			object: 'block',
			type: SETTINGS_NODE,
			nodes: {
				size: 1,
				first: jest.fn().mockReturnValue({
					object: 'object',
					data: { get: () => 'review' }
				})
			}
		}

		const changer = Assessment.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid first child in Assessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid second child in Assessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid third child in Assessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 2
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid fourth child in Assessment', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 3
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in Assessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in Assessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing third child in Assessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 2
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing fourth child in Assessment', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[ASSESSMENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 3
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid second child in Settings', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Assessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid first child in mod', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Assessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in mod', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in Settings', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Assessment.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
