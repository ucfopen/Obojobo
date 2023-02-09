import RadioIcons from './radio-icons'
import renderer from 'react-test-renderer'
import React from 'react'
import { mount } from 'enzyme'

describe('Radio Icons', () => {
	const options = [
		{ label: 'small', icon: 'image1' },
		{ label: 'medium', icon: 'image2' },
		{ label: 'large', icon: 'image3' }
	]

	const selectedOption = 'medium'

	const ariaLabel = 'sizes'

	const onChange = jest.fn()

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('Node builds the expected component - icons are strings', () => {
		const component = renderer.create(
			<RadioIcons
				name="sizes"
				ariaLabel={ariaLabel}
				options={options}
				selectedOption={selectedOption}
				onChangeOption={onChange}
			/>
		)
		const icons = component.root.findAllByType('img')
		expect(icons.length).toBe(3)
		expect(icons[0].props['src']).toBe('image1')
		expect(icons[1].props['src']).toBe('image2')
		expect(icons[2].props['src']).toBe('image3')

		const labels = component.root.findAllByType('label')
		expect(labels.length).toBe(3)
		expect(labels[0].props['className']).toBe('is-not-selected is-option-small')
		expect(labels[1].props['className']).toBe('is-selected is-option-medium')
		expect(labels[2].props['className']).toBe('is-not-selected is-option-large')

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node builds the expected component - icons are functions', () => {
		const imageFunction1 = jest.fn(() => <svg>one</svg>)
		const imageFunction2 = jest.fn(() => <svg>two</svg>)
		const imageFunction3 = jest.fn(() => <svg>three</svg>)

		const newOptions = [
			{ label: 'small', icon: imageFunction1 },
			{ label: 'medium', icon: imageFunction2 },
			{ label: 'large', icon: imageFunction3 }
		]

		const component = renderer.create(
			<RadioIcons
				name="sizes"
				ariaLabel={ariaLabel}
				options={newOptions}
				selectedOption={selectedOption}
				onChangeOption={onChange}
			/>
		)
		const icons = component.root.findAllByType('svg')
		expect(icons.length).toBe(3)
		expect(imageFunction1).toHaveBeenCalledTimes(1)
		expect(imageFunction2).toHaveBeenCalledTimes(1)
		expect(imageFunction3).toHaveBeenCalledTimes(1)

		const labels = component.root.findAllByType('label')
		expect(labels.length).toBe(3)
		expect(labels[0].props['className']).toBe('is-not-selected is-option-small')
		expect(labels[1].props['className']).toBe('is-selected is-option-medium')
		expect(labels[2].props['className']).toBe('is-not-selected is-option-large')

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
