import Modal from '../../../../src/scripts/common/components/modal/modal'
import ModalUtil from '../../../../src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('../../../../src/scripts/common/util/modal-util')

describe('Modal', () => {
	let onClose, focusOnFirstElement

	beforeEach(() => {
		onClose = jest.fn()
		focusOnFirstElement = jest.fn()
	})

	test('Modal', () => {
		const component = renderer.create(
			<Modal
				onClose={onClose}
				focusOnFirstElement={focusOnFirstElement}
				className={'mockClassName'}
			>
				Content
			</Modal>
		)
		const tree = component.toJSON()

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
		mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		expect(onClose).toHaveBeenCalledTimes(0)

		document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	test('Esc closes modal (even when no onClose method present)', () => {
		mount(<Modal focusOnFirstElement={focusOnFirstElement}>Content</Modal>)

		expect(ModalUtil.hide).toHaveBeenCalledTimes(0)

		document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
	})

	test('Modal does not close with other keys', () => {
		mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		expect(onClose).toHaveBeenCalledTimes(0)

		document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 28 }))

		expect(onClose).not.toHaveBeenCalled()
	})

	test('Tab will focus on nothing if no close or first element', () => {
		const component = mount(
			<Modal>
				<textarea />
			</Modal>
		)

		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)

		component
			.find('div')
			.at(0)
			.find('.first-tab')
			.simulate('focus')

		expect(focusOnFirstElement).not.toHaveBeenCalled()
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
		const deleteButtonFocus = jest.spyOn(component.instance().deleteButtonRef.current, 'focus')
		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)

		component
			.find('div')
			.at(0)
			.find('.first-tab')
			.simulate('focus')

		expect(focusOnFirstElement).toHaveBeenCalledTimes(0)
		expect(deleteButtonFocus).toHaveBeenCalledTimes(1)
	})

	test('Unmounts with onClose function', () => {
		const component = mount(
			<Modal onClose={onClose} focusOnFirstElement={focusOnFirstElement}>
				Content
			</Modal>
		)

		component.unmount()

		expect(onClose).not.toHaveBeenCalled()
	})

	test('Unmounts with no onClose function', () => {
		const component = mount(<Modal focusOnFirstElement={focusOnFirstElement}>Content</Modal>)

		component.unmount()

		expect(onClose).not.toHaveBeenCalled()
	})
})
