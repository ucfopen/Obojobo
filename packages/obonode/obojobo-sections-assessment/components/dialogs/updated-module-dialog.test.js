/* eslint-disable react/display-name */

import React from 'react'
import renderer from 'react-test-renderer'
import UpdatedModuleDialog from './updated-module-dialog'
import { mount } from 'enzyme'

describe('UpdatedModuleDialog', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('UpdatedModuleDialog component', () => {
		const onRestart = jest.fn()
		const onClose = jest.fn()
		const component = renderer.create(
			<UpdatedModuleDialog onClose={onClose} onRestart={onRestart} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('UpdatedModuleDialog component cancels', () => {
		const onRestart = jest.fn()
		const onClose = jest.fn()
		const component = mount(<UpdatedModuleDialog onClose={onClose} onRestart={onRestart} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onClose).toHaveBeenCalled()
		expect(onRestart).not.toHaveBeenCalled()
	})

	test('UpdatedModuleDialog component confirms', () => {
		const onRestart = jest.fn()
		const onClose = jest.fn()
		const component = mount(<UpdatedModuleDialog onClose={onClose} onRestart={onRestart} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onClose).not.toHaveBeenCalled()
		expect(onRestart).toHaveBeenCalled()
	})
})
