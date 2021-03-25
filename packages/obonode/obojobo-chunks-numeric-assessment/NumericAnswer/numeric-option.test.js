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

	test('NumericOption with requirement of `exact`, event.stopPropagation() is called when click', () => {
		const component = mount(<NumericOption numericChoice={{ requirement: 'exact' }} />)

		const stopPropagation = jest.fn()

		component
			.find('.select-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(stopPropagation).toBeCalledTimes(2)
	})

	test('NumericOption renders as expected with requirement of `range`', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: 'range' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption with requirement of `range`, event.stopPropagation() is called when click', () => {
		const component = mount(<NumericOption numericChoice={{ requirement: 'range' }} />)

		const stopPropagation = jest.fn()
		component
			.find('.select-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(1)
			.simulate('click', {
				stopPropagation
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(stopPropagation).toBeCalledTimes(3)
	})

	test('NumericOption renders as expected with requirement of `margin`', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: 'margin' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption with requirement of `margin`, event.stopPropagation() is called when click', () => {
		const component = mount(<NumericOption numericChoice={{ requirement: 'margin' }} />)

		const stopPropagation = jest.fn()

		component
			.find('.select-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.select-item')
			.at(1)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(1)
			.simulate('click', {
				stopPropagation
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(stopPropagation).toBeCalledTimes(4)
	})

	test('NumericOption with requirement of `margin`, percent error, event.stopPropagation() is called when click', () => {
		const component = mount(
			<NumericOption numericChoice={{ requirement: 'margin', type: 'percent' }} />
		)

		const stopPropagation = jest.fn()

		component
			.find('.select-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.select-item')
			.at(1)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(0)
			.simulate('click', {
				stopPropagation
			})

		component
			.find('.input-item')
			.at(1)
			.simulate('click', {
				stopPropagation
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(stopPropagation).toBeCalledTimes(4)
	})

	test('NumericOption renders as expected with default requirement', () => {
		const component = renderer.create(<NumericOption numericChoice={{ requirement: '' }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericOption input calls focus on the element after a short delay', () => {
		jest.useFakeTimers()

		const component = renderer.create(<NumericOption numericChoice={{ requirement: '' }} />)

		const event = { target: { focus: jest.fn() }, stopPropagation: jest.fn() }
		component.root.findAllByType('input')[0].props.onFocus(event)

		jest.runAllTimers()

		expect(event.stopPropagation).toHaveBeenCalled()
		expect(event.target.focus).toHaveBeenCalledTimes(2)
	})
})
