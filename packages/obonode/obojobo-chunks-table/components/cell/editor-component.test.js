import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Cell from './editor-component'

import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Cell Editor Node', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()
	})

	test('Cell component', () => {
		const component = renderer.create(<Cell element={{ content: { header: false } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as header', () => {
		const component = renderer.create(<Cell element={{ content: { header: true } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component selected', () => {
		const component = renderer.create(
			<Cell element={{ content: { header: false } }} selected={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as selected header', () => {
		const component = renderer.create(
			<Cell element={{ content: { header: true } }} selected={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component handles tabbing', () => {
		const component = mount(
			<table>
				<thead>
					<tr>
						<Cell element={{ content: { header: true } }} selected={true} />
					</tr>
				</thead>
			</table>
		)

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'Tab', metaKey: 'true', shiftKey: 'true' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Cell component opens drop down', () => {
		const component = mount(
			<table>
				<thead>
					<tr>
						<Cell element={{ content: { header: true } }} selected={true} />
					</tr>
				</thead>
			</table>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Cell component adds row above', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('Cell component adds header row above', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { header: true },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: true } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Cell component adds row below', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('Cell component adds col left', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Cell component adds col right', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(4)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Cell component deletes only row', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalledWith(editor, { at: [0] })
	})

	test('Cell component deletes first row', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalledWith(editor, { at: [0, 0] })
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Cell component deletes non-first row', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 1, 0])

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalledWith(editor, { at: [0, 1] })
	})

	test('Cell component deletes only col', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 1 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalledWith(editor, { at: [0] })
	})

	test('Cell component deletes col', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: { numCols: 2 },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			]
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell element={{ content: { header: false } }} selected={true} editor={editor} />
					</tr>
				</tbody>
			</table>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0, 0])

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('showDropDownMenu does nothing if Cell is not selected', () => {
		const thisValue = {
			setState: jest.fn(),
			props: {
				selected: false
			}
		}

		Cell.prototype.showDropDownMenu.bind(thisValue)()

		expect(thisValue.setState).not.toHaveBeenCalled()
	})

	test('showDropDownMenu updates state when Cell is selected', () => {
		const thisValue = {
			setState: jest.fn(),
			props: {
				selected: true
			}
		}

		Cell.prototype.showDropDownMenu.bind(thisValue)()

		expect(thisValue.setState).toHaveBeenCalledWith({ isShowingDropDownMenu: true })
	})

	test('onFocus updates classnames and state on first selection', () => {

		const button = { classList: { add: jest.fn() }}

		const event = {
			target: button
		}

		const thisValue = {
			setState: jest.fn(),
			state: {
				focusedDropdownSelection: null
			}
		}

		Cell.prototype.onFocus.bind(thisValue, event)()

		expect(thisValue.setState).toHaveBeenCalled()
		expect(thisValue.setState.mock.calls[0][0]).toEqual({ focusedDropdownSelection: button })
		expect(button.classList.add).toHaveBeenCalled()

	})

	test('onFocus updates classnames and state after first selection', () => {

		const oldButton = { classList: { remove: jest.fn() }}
		const newButton = { classList: { add: jest.fn() }}

		const event = {
			target: newButton
		}

		const thisValue = {
			setState: jest.fn(),
			state: {
				focusedDropdownSelection: oldButton
			}
		}

		Cell.prototype.onFocus.bind(thisValue, event)()

		expect(thisValue.setState).toHaveBeenCalled()
		expect(thisValue.setState.mock.calls[0][0]).toEqual({ focusedDropdownSelection: newButton })
		expect(oldButton.classList.remove).toHaveBeenCalled()
		expect(newButton.classList.add).toHaveBeenCalled()

	})

	test('componentDidMount does nothing when Cell is not selected', () => {
		const thisValue = {
			props: {
				selected: false
			},
			showDropDownMenu: jest.fn()
		}

		Cell.prototype.componentDidMount.bind(thisValue)()

		expect(thisValue.showDropDownMenu).not.toHaveBeenCalled()
	})

	test('componentDidMount calls showDropDownMenu when Cell is selected', () => {
		const thisValue = {
			props: {
				selected: true
			},
			showDropDownMenu: jest.fn()
		}

		Cell.prototype.componentDidMount.bind(thisValue)()

		expect(thisValue.showDropDownMenu).toHaveBeenCalled()
	})

	test.each`
		selectedBefore | selectedAfter | action
		${false}       | ${false}      | ${'does nothing'}
		${false}       | ${true}       | ${'calls showDropDownMenu'}
		${true}        | ${false}      | ${'calls setState'}
		${true}        | ${true}       | ${'does nothing'}
	`(
		'Changing props.selected from $selectedBefore to $selectedAfter $action',
		({ selectedBefore, selectedAfter, action }) => {
			const thisValue = {
				props: {
					selected: selectedAfter
				},
				setState: jest.fn(),
				showDropDownMenu: jest.fn()
			}

			jest.useFakeTimers()
			Cell.prototype.componentDidUpdate.bind(thisValue)({ selected: selectedBefore })
			jest.runAllTimers()

			switch (action) {
				case 'does nothing':
					expect(thisValue.setState).not.toHaveBeenCalled()
					expect(thisValue.showDropDownMenu).not.toHaveBeenCalled()
					break

				case 'calls showDropDownMenu':
					expect(thisValue.setState).not.toHaveBeenCalled()
					expect(thisValue.showDropDownMenu).toHaveBeenCalled()
					break

				case 'calls setState':
					expect(thisValue.setState).toHaveBeenCalledWith({
						isOpen: false,
						isShowingDropDownMenu: false
					})
					expect(thisValue.showDropDownMenu).not.toHaveBeenCalled()
					break
			}
		}
	)
})
