import React from 'react'
import renderer from 'react-test-renderer'

import List from './editor-component'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.mock('slate-react', () => ({ ReactEditor: { findPath: jest.fn() } }))
jest.mock('slate', () => ({
	Editor: {
		withoutNormalizing: (editor, cb) => {
			cb()
		},
		nodes: jest.fn()
	},
	Transforms: {
		setNodes: jest.fn()
	}
}))

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('List Editor Node', () => {
	test('List component when not selected', () => {
		const props = {
			selected: false,
			editor: {},
			element: {
				content: {
					listStyles: {}
				}
			}
		}
		const component = renderer.create(<List {...props} />)
		// make sure there's no switch button
		expect(() => component.root.findByProps({ children: 'Switch to ordered' })).toThrow()
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('List component when selected', () => {
		const listPath = [0, 1, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: listPath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)

		// make sure the switch button is displayed
		expect(() => component.root.findByProps({ children: 'Switch to ordered' })).not.toThrow()

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('List component when selected and ordered', () => {
		const listPath = [0, 1, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: listPath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {
						type: 'ordered'
					}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)

		// make sure the switch button is displayed
		expect(() => component.root.findByProps({ children: 'Switch to unordered' })).not.toThrow()
	})

	test('List component when selected and unordered', () => {
		const listPath = [0, 1, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: listPath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {
						type: 'unordered'
					}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)

		// make sure the switch button is displayed
		expect(() => component.root.findByProps({ children: 'Switch to ordered' })).not.toThrow()
	})

	test('List component when selected but other nodes are slected', () => {
		const listPath = [0, 1, 1]
		const prevNodePath = [0, 0, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: prevNodePath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {
						type: 'unordered'
					}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)

		// make sure the switch button is displayed
		expect(() => component.root.findByProps({ children: 'Switch to ordered' })).toThrow()
	})

	test('List toggleType switches from ordered to unorded', () => {
		const listPath = [0, 1, 1]
		const prevNodePath = [0, 0, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: prevNodePath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {
						type: 'unordered'
					}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)

		// make sure the switch button is displayed
		expect(() => component.root.findByProps({ children: 'Switch to ordered' })).toThrow()
	})

	test('List toggleType calls setNodes on the list and each level', () => {
		const listPath = [0, 1, 1]
		const props = {
			selected: true,
			editor: {
				selection: {
					anchor: {
						path: listPath
					},
					focus: {
						path: listPath
					}
				}
			},
			element: {
				content: {
					listStyles: {
						type: 'unordered'
					}
				}
			}
		}
		ReactEditor.findPath.mockReturnValueOnce(listPath).mockReturnValueOnce(listPath)
		const component = renderer.create(<List {...props} />)
		Editor.nodes.mockReturnValueOnce([[null, 'mock-level-path']])
		component.root.findByProps({ children: 'Switch to ordered' }).props.onClick()

		// make sure the Editor.node's match filter matches level nodes
		expect(Editor.nodes.mock.calls[0][1].match({ subtype: 'not-a-level' })).toBe(false)
		expect(Editor.nodes.mock.calls[0][1].match({ subtype: 'ObojoboDraft.Chunks.List.Level' })).toBe(
			true
		)

		expect(Transforms.setNodes).toHaveBeenCalledTimes(2)

		// make sure the first call changes the list
		expect(Transforms.setNodes.mock.calls[0]).toMatchSnapshot()

		// make sure the next call changes each list level
		expect(Transforms.setNodes.mock.calls[1]).toMatchSnapshot()
	})
})
