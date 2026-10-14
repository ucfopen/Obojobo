import React from 'react'
import DeleteButton from './delete-button'
import DeleteButtonBase from './delete-button-base'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('../page/focus')

describe('DeleteButton', () => {
	test('DeleteButton component', () => {
		const component = renderer.create(<DeleteButton />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with shouldPreventTab', () => {
		const component = renderer.create(<DeleteButton shouldPreventTab={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with tabIndex', () => {
		const component = renderer.create(<DeleteButton tabIndex={50} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component disabled', () => {
		const component = renderer.create(<DeleteButton disabled />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with onClick', () => {
		const component = renderer.create(<DeleteButton onClick={() => {}} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton calls focus callback with ref argument', () => {
		const focus = require('../page/focus').default
		const wrapper = mount(<DeleteButton focus={focus} />)
		const inst = wrapper.find(DeleteButtonBase).instance()
		inst.focus()
		expect(focus).toHaveBeenCalledWith(inst.deleteButtonRef)
	})
})
