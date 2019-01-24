import { shallow } from 'enzyme'
import React from 'react'

import Toolbar from 'src/scripts/oboeditor/components/toolbar'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

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
		const change = {
			toggleMark: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(5)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.toggleMark).toHaveBeenCalled()
	})

	test('Node component toggles link', () => {
		const Node = Toolbar.components.Node
		const change = {
			addMark: jest.fn(),
			removeMark: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
					marks: [
						{
							type: 'b'
						}
					]
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(6)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeLinkValue calls onChage with empty href', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const Node = Toolbar.components.Node
		const change = {
			addMark: jest.fn(),
			removeMark: jest.fn()
		}

		const onChange = jest.fn()

		const component = shallow(
			<Node
				value={{
					change: () => change,
					onChange,
					marks: {
						forEach: funct => {
							const mark = {
								type: 'a',
								data: { get: () => 1, toJSON: () => ({}) }
							}
							return funct({ type: 'mockMark' }) || funct(mark)
						}
					}
				}}
				onChange={jest.fn()}
			/>
		)

		component.instance().changeLinkValue('   ')

		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('changeLinkValue calls onChage with href', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const Node = Toolbar.components.Node
		const change = {
			addMark: jest.fn(),
			removeMark: jest.fn()
		}

		const onChange = jest.fn()

		const component = shallow(
			<Node
				value={{
					change: () => change,
					onChange,
					marks: {
						forEach: funct => {
							const mark = {
								type: 'a',
								data: { get: () => 1, toJSON: () => ({}) }
							}
							return funct({ type: 'mockMark' }) || funct(mark)
						}
					}
				}}
				onChange={jest.fn()}
			/>
		)

		component.instance().changeLinkValue('mockHref')

		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('Node component toggles Superscript', () => {
		const Node = Toolbar.components.Node
		const change = {
			removeMark: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
					marks: {
						some: funct => {
							const mark = {
								type: 'sup',
								data: { get: () => 1 }
							}
							return funct({ type: 'mockMark' }) || funct(mark)
						}
					}
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(7)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.removeMark).toHaveBeenCalled()
	})

	test('Node component toggles Subscript', () => {
		const Node = Toolbar.components.Node
		const change = {
			addMark: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
					marks: {
						some: funct => {
							return funct({ type: 'mockMark' })
						}
					}
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(8)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.addMark).toHaveBeenCalled()
	})

	test('Node component toggles left align', () => {
		const Node = Toolbar.components.Node
		const change = {
			setNodeByKey: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
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
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(9)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('Node component toggles indent', () => {
		const Node = Toolbar.components.Node
		const change = {
			setNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
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
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(12)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('Node component toggles unindent', () => {
		const Node = Toolbar.components.Node
		const change = {
			setNodeByKey: jest.fn(),
			unwrapNodeByKey: jest.fn()
		}
		const component = shallow(
			<Node
				value={{
					change: () => change,
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
				}}
				onChange={jest.fn()}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(13)
			.simulate('click', { preventDefault: jest.fn() })

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(change.unwrapNodeByKey).toHaveBeenCalled()
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
