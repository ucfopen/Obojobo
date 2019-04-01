import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import TableMenu from './table-menu.js'

describe('TableMenu', () => {
	let onMenuCommandMock
	let tableMenuRow
	let tableMenuCol
	let expectCommandToFire
	beforeEach(() => {
		onMenuCommandMock = jest.fn()
		tableMenuRow = <TableMenu type="row" onMenuCommand={onMenuCommandMock} row={0} col={0} />
		tableMenuCol = <TableMenu type="col" onMenuCommand={onMenuCommandMock} row={0} col={0} />

		expectCommandToFire = (componentToMount, elClassName, command) => {
			const wrapper = mount(componentToMount)
			wrapper.find(elClassName).simulate('click')
			expect(onMenuCommandMock).toBeCalledWith({ row: 0, col: 0, command })
		}
	})

	test('renders without error', () => {
		const component = renderer.create(tableMenuRow)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('inserts a row above', () => {
		expectCommandToFire(tableMenuRow, 'li.insert-above', 'insertRowAbove')
	})

	test('inserts a row below', () => {
		expectCommandToFire(tableMenuRow, 'li.insert-below', 'insertRowBelow')
	})

	test('deletes a row', () => {
		expectCommandToFire(tableMenuRow, 'li.delete', 'deleteRow')
	})

	test('inserts a column left', () => {
		expectCommandToFire(tableMenuCol, 'li.insert-left', 'insertColLeft')
	})

	test('inserts a column right', () => {
		expectCommandToFire(tableMenuCol, 'li.insert-right', 'insertColRight')
	})

	test('deletes a column', () => {
		expectCommandToFire(tableMenuCol, 'li.delete', 'deleteCol')
	})

	test('render unhandled type as nothing', () => {
		const component = renderer.create(
			<TableMenu onMenuCommand={onMenuCommandMock} row={0} col={0} />
		)
		expect(component.toJSON()).toMatchSnapshot()
	})
})
