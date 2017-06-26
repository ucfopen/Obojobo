import React from 'react';
import { shallow, mount } from 'enzyme';
import TableMenu from '../../../../ObojoboDraft/Chunks/Table/table-menu.js';

// TODO: Test functionality of the onclick method
//       Test renderRow/renderCol functionality
//       Shallow render the component and snapshot test.

describe('TableMenu', () => {
  let onMenuCommandMock
  let tableMenu
  beforeEach(() => {
    onMenuCommandMock = jest.fn()
    tableMenu = (
      <TableMenu 
        type='row' 
        onMenuCommand={ onMenuCommandMock } 
        row={0} 
        col={0}
      />
    )
  })

  it('renders without blowing up', () => {
    expect(shallow(tableMenu)).toMatchSnapshot()
  })

  it('inserts a row above', () => {
    const wrapper = mount(tableMenu)
    wrapper.find('.insert-above').simulate('click')
    expect(onMenuCommandMock).toBeCalledWith({ row: 0, col: 0, command: 'insertRowAbove' })
  })

  it('inserts a row below', () => {
    const wrapper = mount(tableMenu)
    wrapper.find('.insert-below').simulate('click')
    expect(onMenuCommandMock).toBeCalledWith({ row: 0, col: 0, command: 'insertRowBelow' })
  })

  it('deletes a row', () => {
    const wrapper = mount(tableMenu)
    wrapper.find('li.delete').at(0).simulate('click')
    expect(onMenuCommandMock).toBeCalledWith({ row: 0, col: 0, command: 'deleteRow' })
  })
})

