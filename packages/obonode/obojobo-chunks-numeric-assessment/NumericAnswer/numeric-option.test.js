import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import NumericOption from './numeric-option'
import NumericEntry from '../entry/numeric-entry'
import {
	OK,
	INPUT_INVALID,
	INPUT_NOT_SAFE,
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_MATCHED
} from '../entry/numeric-entry-statuses'

jest.mock('../entry/numeric-entry.js')

describe('NumericOption', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

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

	test('NumericOption exact answer input shows expected error messages, clears error when new inputs given', () => {
		const onSelectChange = jest.fn()
		const onInputChange = jest.fn()
		const component = mount(
			<NumericOption
				numericChoice={{ requirement: 'exact' }}
				onHandleSelectChange={onSelectChange}
				onHandleInputChange={onInputChange}
			/>
		)
		const setCustomValidity = jest.fn()
		const reportValidity = jest.fn()

		NumericEntry.mockImplementation(() => ({
			status: INPUT_INVALID
		}))
		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '-'
				}
			})

		expect(setCustomValidity).toHaveBeenCalledTimes(1)
		expect(setCustomValidity).toHaveBeenLastCalledWith('Not a valid numeric value')
		expect(reportValidity).toHaveBeenCalledTimes(1)

		component
			.find('.input-item')
			.at(0)
			.simulate('change', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '-2'
				}
			})

		NumericEntry.mockImplementation(() => ({
			status: OK
		}))
		expect(setCustomValidity).toHaveBeenCalledTimes(2)
		expect(setCustomValidity).toHaveBeenLastCalledWith('')
		expect(reportValidity).toHaveBeenCalledTimes(1)

		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '-2'
				}
			})

		expect(setCustomValidity).toHaveBeenCalledTimes(3)
		expect(setCustomValidity).toHaveBeenLastCalledWith('')
		expect(reportValidity).toHaveBeenCalledTimes(2)
	})

	test('Input reports expected error messages', () => {
		const onSelectChange = jest.fn()
		const onInputChange = jest.fn()
		const component = mount(
			<NumericOption
				numericChoice={{ requirement: 'exact' }}
				onHandleSelectChange={onSelectChange}
				onHandleInputChange={onInputChange}
			/>
		)
		const setCustomValidity = jest.fn()
		const reportValidity = jest.fn()

		NumericEntry.mockImplementation(() => ({
			status: OK
		}))

		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: ''
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith('Missing a value')

		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith('')

		NumericEntry.mockImplementation(() => ({
			status: INPUT_INVALID
		}))
		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith('Not a valid numeric value')

		NumericEntry.mockImplementation(() => ({
			status: INPUT_NOT_SAFE
		}))
		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith('This answer is too large of a value')

		NumericEntry.mockImplementation(() => ({
			status: INPUT_MATCHES_MULTIPLE_TYPES
		}))
		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith('This answer matches multiple types')

		NumericEntry.mockImplementation(() => ({
			status: INPUT_NOT_MATCHED
		}))
		component
			.find('.input-item')
			.at(0)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenLastCalledWith(
			"This answer doesn't match one of the allowed numeric types"
		)
	})

	test('Error amount reports input error if a non-positive number', () => {
		const onSelectChange = jest.fn()
		const onInputChange = jest.fn()
		const component = mount(
			<NumericOption
				numericChoice={{ requirement: 'margin', type: 'percent' }}
				onHandleSelectChange={onSelectChange}
				onHandleInputChange={onInputChange}
			/>
		)
		const setCustomValidity = jest.fn()
		const reportValidity = jest.fn()

		component
			.find('.input-item')
			.at(1)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '1'
				}
			})
		expect(setCustomValidity).toHaveBeenCalledTimes(1)
		expect(setCustomValidity).toHaveBeenLastCalledWith('')
		expect(reportValidity).toHaveBeenCalledTimes(1)

		component
			.find('.input-item')
			.at(1)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0'
				}
			})
		expect(setCustomValidity).toHaveBeenCalledTimes(2)
		expect(setCustomValidity).toHaveBeenLastCalledWith('Error amount must be greater than 0')
		expect(reportValidity).toHaveBeenCalledTimes(2)

		component
			.find('.input-item')
			.at(1)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: ''
				}
			})
		expect(setCustomValidity).toHaveBeenCalledTimes(3)
		expect(setCustomValidity).toHaveBeenLastCalledWith('Enter a numeric error amount')
		expect(reportValidity).toHaveBeenCalledTimes(3)

		component
			.find('.input-item')
			.at(1)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: 'x'
				}
			})
		expect(setCustomValidity).toHaveBeenCalledTimes(4)
		expect(setCustomValidity).toHaveBeenLastCalledWith('Enter a numeric error amount')
		expect(reportValidity).toHaveBeenCalledTimes(4)

		component
			.find('.input-item')
			.at(1)
			.simulate('blur', {
				target: {
					setCustomValidity,
					reportValidity,
					value: '0.001'
				}
			})
		expect(setCustomValidity).toHaveBeenCalledTimes(5)
		expect(setCustomValidity).toHaveBeenLastCalledWith('')
		expect(reportValidity).toHaveBeenCalledTimes(5)
	})
})
