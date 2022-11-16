import RadioIcons from './radio-icons'
import renderer from 'react-test-renderer'
import React from 'react'
import { mount } from 'enzyme'

describe('Radio Icons', () => {
	const options = [
		{ label: 'small', icon: 'image' },
		{ label: 'medium', icon: 'image' },
		{ label: 'large', icon: 'image' }
	]

	const selectedOption = 'medium'

	const ariaLabel = 'sizes'

	const onChange = jest.fn()

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('Node builds the expected component', () => {
		const component = renderer.create(
			<RadioIcons
				name="sizes"
				ariaLabel={ariaLabel}
				options={options}
				selectedOption={selectedOption}
				onChangeOption={onChange}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Handles mouse down event', () => {
		const component = mount(
			<RadioIcons
				name="sizes"
				ariaLabel={ariaLabel}
				options={options}
				selectedOption={selectedOption}
				onChangeOption={onChange}
			/>
		)

		// console.log(component.debug());

		component
			.find('label')
			.at(0)
			.simulate('mousedown')

		expect(onChange).toHaveBeenCalled()
		expect(onChange).toHaveBeenCalledWith('small')
	})

	test('Handles change event', () => {
		const component = mount(
			<RadioIcons
				name="sizes"
				ariaLabel={ariaLabel}
				options={options}
				selectedOption={selectedOption}
				onChangeOption={onChange}
			/>
		)

		component
			.find('input')
			.at(0)
			.simulate('change')

		expect(onChange).toHaveBeenCalled()
		expect(onChange).toHaveBeenCalledWith('small')
	})
})
