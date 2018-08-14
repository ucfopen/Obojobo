import React from 'react'
import { mount } from 'enzyme'

import SingleInputBubble from '../../../../../src/scripts/common/components/modal/bubble/single-input-bubble'
jest.useFakeTimers()

describe('SingleInputBubble', () => {
	let onClose, onCancel, onChange

	beforeEach(() => {
		onClose = jest.fn()
		onCancel = jest.fn()
		onChange = jest.fn()
	})

	test('SingleInputBubble Snapshot', () => {
		const component = mount(
			<SingleInputBubble
				label="Label"
				value="Value"
				onClose={onClose}
				onCancel={onCancel}
				onChange={onChange}
			/>
		)

		expect(component.html()).toMatchSnapshot()
	})

	test('SingleInputBubble times out', () => {
		const el = mount(
			<SingleInputBubble
				label="Timed"
				value="Value"
				onClose={onClose}
				onCancel={onCancel}
				onChange={onChange}
			/>
		)

		const spy = jest.spyOn(el.instance().refs.input, 'select')

		jest.runAllTimers()

		expect(spy).toHaveBeenCalled()
	})

	test('SingleInputBubble cancels on ESC', () => {
		const el = mount(
			<SingleInputBubble
				label="Label"
				value="Value"
				onClose={onClose}
				onCancel={onCancel}
				onChange={onChange}
			/>
		)

		const input = el.find('input')

		input.simulate('keyup', {
			keyCode: 13
		})

		expect(onCancel).not.toHaveBeenCalled()

		input.simulate('keyup', {
			keyCode: 27
		})

		expect(onCancel).toHaveBeenCalled()
	})

	test('SingleInputBubble handles changes', () => {
		const el = mount(
			<SingleInputBubble
				label="Label"
				value="Value"
				onClose={onClose}
				onCancel={onCancel}
				onChange={onChange}
			/>
		)

		const input = el.find('input')

		expect(onChange).not.toHaveBeenCalled()

		input.simulate('change', {
			target: {
				value: 'Test123'
			}
		})

		expect(onChange).toHaveBeenCalledWith('Test123')
	})

	test('SingleInputBubble closes when submitted', () => {
		const el = mount(
			<SingleInputBubble
				label="Label"
				value="Value"
				onClose={onClose}
				onCancel={onCancel}
				onChange={onChange}
			/>
		)

		const form = el.find('form')

		expect(onClose).not.toHaveBeenCalled()

		form.simulate('submit')

		expect(onClose).toHaveBeenCalled()
	})
})
