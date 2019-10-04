import { shallow } from 'enzyme'
import React from 'react'

import Toolbar from 'obojobo-document-engine/src/scripts/oboeditor/components/toolbar'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('Editor Toolbar', () => {
	test('Node component', () => {
		const Node = Toolbar.components.Node
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles Basic Mark', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const Node = Toolbar.components.Node
		const editor = {
			toggleMark: jest.fn()
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(5)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})

	test('Node component toggles link', () => {
		const Node = Toolbar.components.Node
		const editor = {
			addMark: jest.fn(),
			removeMark: jest.fn(),
			value: {
				marks: [
					{
						type: 'b'
					}
				]
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(6)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeLinkValue calls onChange with empty href', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const Node = Toolbar.components.Node
		const editor = {
			addMark: jest.fn(),
			removeMark: jest.fn(),
			value: {
				marks: {
					forEach: funct => {
						const mark = {
							type: 'a',
							data: { get: () => 1, toJSON: () => ({}) }
						}
						return funct({ type: 'mockMark' }) || funct(mark)
					}
				}
			}
		}

		const component = shallow(<Node getEditor={() => editor} />)

		component.instance().changeLinkValue('   ')

		expect(editor.removeMark).toHaveBeenCalled()
	})

	test('changeLinkValue calls onChange with href', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const Node = Toolbar.components.Node
		const editor = {
			addMark: jest.fn(),
			removeMark: jest.fn(),
			value: {
				marks: {
					forEach: funct => {
						const mark = {
							type: 'a',
							data: { get: () => 1, toJSON: () => ({}) }
						}
						return funct({ type: 'mockMark' }) || funct(mark)
					}
				}
			}
		}

		const component = shallow(<Node getEditor={() => editor} />)

		component.instance().changeLinkValue('mockHref')

		expect(editor.addMark).toHaveBeenCalled()
	})

	test('Node component toggles Superscript', () => {
		const Node = Toolbar.components.Node
		const editor = {
			removeMark: jest.fn(),
			value: {
				marks: {
					some: funct => {
						const mark = {
							type: 'sup',
							data: { get: () => 1 }
						}
						return funct({ type: 'mockMark' }) || funct(mark)
					}
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(7)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.removeMark).toHaveBeenCalled()
	})

	test('Node component toggles Subscript', () => {
		const Node = Toolbar.components.Node
		const editor = {
			addMark: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({ type: 'mockMark' })
					}
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(8)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.addMark).toHaveBeenCalled()
	})

	test('Node component toggles left align', () => {
		const Node = Toolbar.components.Node
		const editor = {
			setNodeByKey: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({ type: 'mockMark' })
					}
				},
				blocks: {
					forEach: funct => {
						funct({
							data: { toJSON: () => ({}) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: 'mockNode'
						})
					}
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(9)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Node component toggles indent', () => {
		const Node = Toolbar.components.Node
		const editor = {
			setNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({ type: 'mockMark' })
					}
				},
				blocks: {
					forEach: funct => {
						funct({
							data: { toJSON: () => ({}) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: CODE_LINE_NODE
						})

						// unordered list
						funct({
							data: { toJSON: () => ({}) },
							type: LIST_LINE_NODE
						})

						// ordered list
						funct({
							data: { toJSON: () => ({}) },
							type: LIST_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: 'mockNode'
						})
					}
				},
				document: {
					getClosest: jest
						.fn()
						.mockImplementationOnce((key, funct) => {
							funct({ type: LIST_LEVEL_NODE })
							return {
								data: {
									get: () => ({
										bulletStyle: 'disc',
										type: 'unordered'
									})
								}
							}
						})
						.mockReturnValueOnce({
							data: {
								get: () => ({
									bulletStyle: 'decimal',
									type: 'ordered'
								})
							}
						})
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(12)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('Node component toggles unindent', () => {
		const Node = Toolbar.components.Node
		const editor = {
			setNodeByKey: jest.fn(),
			unwrapNodeByKey: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({ type: 'mockMark' })
					}
				},
				blocks: {
					forEach: funct => {
						funct({
							data: { toJSON: () => ({ indent: 2 }) },
							type: TEXT_LINE_NODE
						})
						funct({
							data: { toJSON: () => ({ indent: 0 }) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: { indent: 2 } }) },
							type: CODE_LINE_NODE
						})
						funct({
							data: { toJSON: () => ({ content: { indent: 0 } }) },
							type: CODE_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: { indent: 0 } }) },
							type: LIST_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: 'mockNode'
						})
					}
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(13)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('Node component toggles hangingIndent', () => {
		const Node = Toolbar.components.Node
		const editor = {
			setNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({ type: 'mockMark' })
					}
				},
				blocks: {
					forEach: funct => {
						funct({
							data: { toJSON: () => ({ hangingIndent: true }) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ hangingIndent: false }) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: CODE_LINE_NODE
						})

						// unordered list
						funct({
							data: { toJSON: () => ({ hangingIndent: true }) },
							type: LIST_LINE_NODE
						})

						// ordered list
						funct({
							data: { toJSON: () => ({}) },
							type: LIST_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: 'mockNode'
						})
					}
				},
				document: {
					getClosest: jest
						.fn()
						.mockImplementationOnce((key, funct) => {
							funct({ type: LIST_LEVEL_NODE })
							return {
								data: {
									get: () => ({
										bulletStyle: 'disc',
										type: 'unordered'
									})
								}
							}
						})
						.mockReturnValueOnce({
							data: {
								get: () => ({
									bulletStyle: 'decimal',
									type: 'ordered'
								})
							}
						})
				}
			}
		}
		const component = shallow(<Node getEditor={() => editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(14)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Bold component', () => {
		const Node = Toolbar.components.Bold
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Italics component', () => {
		const Node = Toolbar.components.Italics
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Strike component', () => {
		const Node = Toolbar.components.Strike
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Quote component', () => {
		const Node = Toolbar.components.Quote
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Monospace component', () => {
		const Node = Toolbar.components.Monospace
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Latex component', () => {
		const Node = Toolbar.components.Latex
		const component = shallow(<Node />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Link component', () => {
		const Node = Toolbar.components.Link
		const component = shallow(
			<Node
				mark={{
					data: { get: () => '/view/00000000-0000-0000-0000-000000000000' }
				}}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Superscript component', () => {
		const Node = Toolbar.components.Superscript
		const component = shallow(
			<Node
				mark={{
					data: { get: () => 1 }
				}}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Subscript component', () => {
		const Node = Toolbar.components.Superscript
		const component = shallow(
			<Node
				mark={{
					data: { get: () => -1 }
				}}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
