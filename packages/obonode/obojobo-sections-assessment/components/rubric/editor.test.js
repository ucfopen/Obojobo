/* eslint no-undefined: 0 */

import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
import SlateReact from 'slate-react'
jest.mock('slate-react')

import Rubric from './editor'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

describe('Rubric editor', () => {
	test('Node component', () => {
		const Node = Rubric.components.Node
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
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const editor = {
			insertNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={editor}
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

		const editor = {
			insertNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
		const component = mount(
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
				editor={editor}
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
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const Node = Rubric.components.Node
		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('ModList component', () => {
		const Node = Rubric.components.ModList
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

	test('Mod component', () => {
		const Node = Rubric.components.Mod
		const component = renderer.create(<Node />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Mod component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
				document: {
					getDescendant: jest.fn().mockReturnValueOnce({
						nodes: {
							get: jest.fn().mockReturnValueOnce(true)
						}
					})
				}
			}
		}

		const Node = Rubric.components.Mod
		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('Mod component deletes self and parent', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
				document: {
					getDescendant: jest.fn().mockReturnValueOnce({
						nodes: {
							get: jest.fn() // No sibling
						}
					})
				}
			}
		}

		const Node = Rubric.components.Mod
		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
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

	test('plugins.onPaste deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onPaste(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onPaste deals with pasting into rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				}
			}
		}
		editor.insertText = jest.fn().mockReturnValueOnce(editor)

		SlateReact.getEventTransfer.mockReturnValueOnce({ text: 'mock text' })

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onPaste(event, editor, jest.fn())

		expect(editor.insertText).toHaveBeenCalled()
	})

	test('plugins.onCut deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			},
			extractTextToFragment: jest.fn()
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCut(event, editor, jest.fn())

		expect(editor.extractTextToFragment).not.toHaveBeenCalled()
		expect(KeyDownUtil.deleteNodeContents).not.toHaveBeenCalled()
	})

	test('plugins.onCut deals with cutting from rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				},
				fragment: { text: 'selected text' }
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCut(event, editor, jest.fn())

		expect(editor.extractTextToFragment).toHaveBeenCalled()
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.onCopy deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCopy(event, editor, jest.fn())

		expect(editor.extractTextToFragment).not.toHaveBeenCalled()
	})

	test('plugins.onCopy deals with copying from rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				},
				fragment: { text: 'selected text' }
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCopy(event, editor, jest.fn())

		expect(editor.extractTextToFragment).toHaveBeenCalled()
	})

	test('plugins.renderNode renders the rubric when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: RUBRIC_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Rubric.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('extractTextToFragment copies the current text', () => {
		const editor = {
			value: {
				fragment: { text: 'selected text' }
			}
		}
		expect(Rubric.plugins.queries.extractTextToFragment(editor)).toMatchSnapshot()
	})
})
