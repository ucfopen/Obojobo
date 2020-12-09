/* eslint-disable react/display-name */

import React from 'react'
import renderer from 'react-test-renderer'
import UpdatedModuleDialog from './updated-module-dialog'
import { mount } from 'enzyme'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util', () => {
	return {
		hide: jest.fn()
	}
})

describe('UnfinishedAttemptDialog', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('UnfinishedAttemptDialog component', () => {
		const onConfirm = jest.fn()
		const component = renderer.create(<UpdatedModuleDialog onConfirm={onConfirm} />)
    const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
  })

  test('UnfinishedAttemptDialog component cancels', () => {
    const onConfirm = jest.fn()
    const component = mount(<UpdatedModuleDialog onConfirm={onConfirm} />)

    component
      .find('button')
      .at(0)
      .simulate('click')

    expect(ModalUtil.hide).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  test('UnfinishedAttemptDialog component confirms', () => {
    const onConfirm = jest.fn()
    const component = mount(<UpdatedModuleDialog onConfirm={onConfirm} />)

    component
      .find('button')
      .at(1)
      .simulate('click')

    expect(ModalUtil.hide).not.toHaveBeenCalled()
    expect(onConfirm).toHaveBeenCalled()
  })
})
