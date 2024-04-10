import React from 'react'
import DeleteButton from '../../../src/scripts/common/components/delete-button'
import DeleteButtonBase from '../../../src/scripts/common/components/delete-button-base'
import renderer from 'react-test-renderer'

jest.mock('../../../src/scripts/common/page/focus')

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
		const focus = require('../../../src/scripts/common/page/focus').default
		const component = renderer.create(<DeleteButton focus={focus} />)
		const inst = component.root.findByType(DeleteButtonBase).instance // Get the instance of DeleteButton
		inst.focus() // Call the focus method
		expect(focus).toHaveBeenCalledWith(inst.deleteButtonRef) // Check if focus callback is called with correct argument
	})
})
