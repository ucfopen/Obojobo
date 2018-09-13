/* eslint no-undefined: 0 */

import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Rubric from '../../../../../../ObojoboDraft/Sections/Assessment/components/rubric/editor'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

describe('Rubric editor', () => {
	test('Node component', () => {
		const Node = Rubric.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
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
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			insertNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
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

	test('Node component adds child to existing mod list', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			insertNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: {
						size: 5,
						get: jest.fn().mockReturnValueOnce({
							key: 'mockModList',
							nodes: { size: 0 }
						})
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

		expect(tree).toMatchSnapshot()
	})

	test('Rubric component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
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

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('ModList component', () => {
		const Node = Rubric.components.ModList
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
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

	test('Mod component', () => {
		const Node = Rubric.components.Mod
		const component = renderer.create(<Node attributes={{ dummy: 'dummyData' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Mod component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Mod
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
					value: {
						change: () => change,
						document: {
							getDescendant: jest.fn().mockReturnValueOnce({
								nodes: {
									get: jest.fn().mockReturnValueOnce(true)
								}
							})
						}
					},
					onChange: jest.fn()
				}}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('Mod component deletes self and parent', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Mod
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
					value: {
						change: () => change,
						document: {
							getDescendant: jest.fn().mockReturnValueOnce({
								nodes: {
									get: jest.fn() // No sibling
								}
							})
						}
					},
					onChange: jest.fn()
				}}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

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
					}
				},
				{
					data: {
						get: () => {
							return {}
						}
					},
					text: ''
				},
				{
					type: MOD_LIST_NODE,
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
						{
							key: 'mockMod',
							nodes: {
								get: () => {
									return { text: 'mockParameter' }
								}
							}
						}
					]
				}
			]
		}
		const oboNode = Rubric.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with no mods', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return null
				}
			},
			nodes: []
		}
		const oboNode = Rubric.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
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
		const slateNode = Rubric.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node without mods', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: 100,
			failedResult: 0,
			unableToPassResult: 0
		}
		const slateNode = Rubric.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders the rubric when passed', () => {
		const props = {
			node: {
				type: RUBRIC_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			node: {
				type: MOD_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.validateNode exits if not the right type', () => {
		expect(
			Rubric.plugins.validateNode({
				object: 'text'
			})
		).toEqual(undefined)

		expect(
			Rubric.plugins.validateNode({
				object: 'block',
				type: MOD_LIST_NODE
			})
		).toEqual(undefined)

		expect(
			Rubric.plugins.validateNode({
				object: 'block',
				type: MOD_NODE,
				nodes: {
					first: jest.fn().mockReturnValueOnce({
						object: 'text'
					})
				}
			})
		).toEqual(undefined)
	})

	test('plugins.validateNode exits on proper Mod', () => {
		const node = {
			object: 'block',
			type: MOD_NODE,
			nodes: {
				size: 2,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'attemptCondition' }
				})
			}
		}

		expect(Rubric.plugins.validateNode(node)).toEqual(undefined)

		node.nodes.size = 1

		expect(Rubric.plugins.validateNode(node)).toEqual(undefined)
	})

	test('plugins.validateNode fixes mod', () => {
		const node = {
			object: 'block',
			type: MOD_NODE,
			nodes: {
				size: 1,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'reward' }
				})
			}
		}

		const changer = Rubric.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.validateNode fixes first node in rubric', () => {
		const node = {
			object: 'block',
			type: RUBRIC_NODE,
			nodes: {
				size: 1,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'passedResult' }
				})
			}
		}

		const changer = Rubric.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.validateNode fixes second node in rubric', () => {
		const node = {
			object: 'block',
			type: RUBRIC_NODE,
			nodes: {
				size: 3,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'passingAttemptScore' }
				}),
				get: jest.fn().mockReturnValueOnce({
					data: { get: () => 'failedResult' }
				})
			}
		}

		const changer = Rubric.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.validateNode fixes third node in rubric', () => {
		const node = {
			object: 'block',
			type: RUBRIC_NODE,
			nodes: {
				size: 3,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'passingAttemptScore' }
				}),
				get: jest
					.fn()
					.mockReturnValueOnce({
						data: { get: () => 'passedResult' }
					})
					.mockReturnValueOnce({
						data: { get: () => 'unableToPassResult' }
					})
			}
		}

		const changer = Rubric.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.validateNode fixes fourth node in rubric', () => {
		const node = {
			object: 'block',
			type: RUBRIC_NODE,
			nodes: {
				size: 3,
				first: jest.fn().mockReturnValue({
					object: 'block',
					data: { get: () => 'passingAttemptScore' }
				}),
				get: jest
					.fn()
					.mockReturnValueOnce({
						data: { get: () => 'passedResult' }
					})
					.mockReturnValueOnce({
						data: { get: () => 'failedResult' }
					})
			}
		}

		const changer = Rubric.plugins.validateNode(node)
		const change = {
			insertNodeByKey: jest.fn()
		}

		expect(changer).toEqual(expect.any(Function))
		changer(change)
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.validateNode exits on proper RUBRIC_NODE', () => {
		const node = {
			object: 'block',
			type: RUBRIC_NODE,
			nodes: {
				size: 4,
				first: jest.fn().mockReturnValue({
					object: 'block'
				})
			}
		}

		expect(Rubric.plugins.validateNode(node)).toEqual(undefined)
	})

	test('plugins.schema.normalize fixes invalid first child in rubric', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid second child in rubric', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid third child in rubric', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 2
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid fourth child in rubric', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 3
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in rubric', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in rubric', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing third child in rubric', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 2
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing third child in rubric', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[RUBRIC_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 3
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in ModList', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[MOD_LIST_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in ModList', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[MOD_LIST_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid second child in mod', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		change.withoutNormalization = funct => {
			funct(change)
		}

		Rubric.plugins.schema.blocks[MOD_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

		Rubric.plugins.schema.blocks[MOD_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

		Rubric.plugins.schema.blocks[MOD_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in mod', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Rubric.plugins.schema.blocks[MOD_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
