import React from 'react'
import { shallow, mount } from 'enzyme'
import TableMenu from '../../../../ObojoboDraft/Chunks/Table/table-menu.js'

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

	it('renders without error', () => {
		expect(shallow(tableMenuRow)).toMatchSnapshot()
	})

	it('inserts a row above', () => {
		expectCommandToFire(tableMenuRow, 'li.insert-above', 'insertRowAbove')
	})

	it('inserts a row below', () => {
		expectCommandToFire(tableMenuRow, 'li.insert-below', 'insertRowBelow')
	})

	it('deletes a row', () => {
		expectCommandToFire(tableMenuRow, 'li.delete', 'deleteRow')
	})

	it('inserts a column left', () => {
		expectCommandToFire(tableMenuCol, 'li.insert-left', 'insertColLeft')
	})

	it('inserts a column right', () => {
		expectCommandToFire(tableMenuCol, 'li.insert-right', 'insertColRight')
	})

	it('deletes a column', () => {
		expectCommandToFire(tableMenuCol, 'li.delete', 'deleteCol')
	})
})
