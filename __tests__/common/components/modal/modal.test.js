import { mount } from 'enzyme'
import React from 'react'
import Modal from '../../../../src/scripts/common/components/modal/modal'
import ModalUtil from '../../../../src/scripts/common/util/modal-util'
import renderer from 'react-test-renderer'

describe('Modal', () => {
	let onClose, focusOnFirstElement

	beforeEach(() => {
		onClose = jest.fn()
		focusOnFirstElement = jest.fn()
	})

	test('Modal', () => {
		const component = renderer.create(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Modal close button closes the modal', () => {
		const component = mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		expect(onClose).toHaveBeenCalledTimes(0)

		component
			.find('DeleteButton')
			.find('button')
			.simulate('click')

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	test('Esc closes modal', () => {
		const component = mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		expect(onClose).toHaveBeenCalledTimes(0)

		document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	test('Tab will focus on the first element if no close button', () => {
		const component = mount(
			<Modal focusOnFirstElement={focusOnFirstElement}>
				<textarea />
			</Modal>
		)

		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)

		component
			.find('div')
			.at(0)
			.find('.first-tab')
			.simulate('focus')

		expect(focusOnFirstElement).toHaveBeenCalledTimes(1)
	})

	test('Tab will focus on the close button if it exists', () => {
		const component = mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				<textarea />
			</Modal>
		)

		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)

		component
			.find('div')
			.at(0)
			.find('.first-tab')
			.simulate('focus')

		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)
		expect(document.activeElement.parentElement.className).toBe(
			'obojobo-draft--components--delete-button'
		)
	})

	test('Unmounts', () => {
		const component = mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		component.unmount()
	})
})
