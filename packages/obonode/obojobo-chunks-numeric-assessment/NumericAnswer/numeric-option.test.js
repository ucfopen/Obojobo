import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import NumericOption from './numeric-option'

describe('NumericOption', () => {
	test('NumericOption renders as expected with requirement of `exact`', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: 'exact' }} />)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption renders as expected with requirement of `range`', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: 'range' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption renders as expected with requirement of `margin`', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: 'margin' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption renders as expected with default requirement', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: '' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption select and input changes call the given prop methods', () => {
		const onSelectChange = jest.fn()
		const onInputChange = jest.fn()
		const component = mount(
			<NumericOption
				numericChoice={{ requirement: 'exact' }}
				onHandleSelectChange={onSelectChange}
				onHandleInputChange={onInputChange}
			/>
		)

		const event = jest.fn()

		component
			.find('.input-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(1)
		expect(onSelectChange).toHaveBeenCalledTimes(0)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(1)
		expect(onSelectChange).toHaveBeenCalledTimes(1)

		component.setProps({ numericChoice: { requirement: 'range' } })

		component
			.find('.input-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(2)
		expect(onSelectChange).toHaveBeenCalledTimes(1)

		component
			.find('.input-item')
			.at(1)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(3)
		expect(onSelectChange).toHaveBeenCalledTimes(1)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(3)
		expect(onSelectChange).toHaveBeenCalledTimes(2)

		component.setProps({ numericChoice: { requirement: 'margin' } })

		component
			.find('.input-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(4)
		expect(onSelectChange).toHaveBeenCalledTimes(2)

		component
			.find('.input-item')
			.at(1)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(5)
		expect(onSelectChange).toHaveBeenCalledTimes(2)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(5)
		expect(onSelectChange).toHaveBeenCalledTimes(3)

		component
			.find('.select-item')
			.at(1)
			.simulate('change', event)

		expect(onInputChange).toHaveBeenCalledTimes(5)
		expect(onSelectChange).toHaveBeenCalledTimes(4)
	})
})
