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
import NumericEntryRange from '../range/numeric-entry-range'
import isRefRelatedTarget from './is-ref-related-target'

jest.mock('../entry/numeric-entry.js')
jest.mock('../range/numeric-entry-range')
jest.mock('./is-ref-related-target')

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

	describe('margin of error', () => {

		describe('error amount', () => {
			test('reports input error if a non-positive number', () => {
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

		describe('answer', () => {
			test('reports when blur from answer input', () => {
				const onSelectChange = jest.fn()
				const onInputChange = jest.fn()
				const component = renderer.create(
					<NumericOption
						numericChoice={{ requirement: 'margin', type: 'percent' }}
						onHandleSelectChange={onSelectChange}
						onHandleInputChange={onInputChange}
					/>
				)
				const setCustomValidity = jest.fn()
				const reportValidity = jest.fn()
				NumericEntry.mockImplementation(() => ({
					status: OK
				}))

				NumericEntryRange.mockImplementation(() => ({
					isSingular: true
				}))

				// Is ref related target
				isRefRelatedTarget.mockImplementation(() => true)
				component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: '0'
					},
					relatedTarget: component.root.findAllByProps({ className: 'select-item' })[1]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(1)
				expect(setCustomValidity).toHaveBeenLastCalledWith('')
				expect(reportValidity).toHaveBeenCalledTimes(1)

				// Is not ref related target
				isRefRelatedTarget.mockImplementation(() => false)
				component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: '0'
					},
					relatedTarget: component.root.findAllByProps({ className: 'select-item' })[0]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(2)
				expect(setCustomValidity).toHaveBeenLastCalledWith(
					'Answer cannot be 0 while Error Type is Percent'
				)
				expect(reportValidity).toHaveBeenCalledTimes(2)
			})
		})

		describe('error type', () => {
			test('Expected validation is reported when blur from error type', () => {
				const onSelectChange = jest.fn()
				const onInputChange = jest.fn()
				let component = renderer.create(
					<NumericOption
						numericChoice={{ requirement: 'margin', type: 'percent', answer: 0 }}
						onHandleSelectChange={onSelectChange}
						onHandleInputChange={onInputChange}
					/>
				)
				const setCustomValidity = jest.fn()
				const reportValidity = jest.fn()
				NumericEntry.mockImplementation(() => ({
					status: OK
				}))

				NumericEntryRange.mockImplementation(() => ({
					isSingular: true
				}))

				// Is ref related target
				isRefRelatedTarget.mockImplementation(() => true)

				component.root.findAllByType('input')[0].value = '0'

				component.root.findAllByType('select')[1].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: 'Percent'
					},
					relatedTarget: component.root.findAllByProps({ className: 'margin-value' })[0]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(0)

				// Is not ref related target
				isRefRelatedTarget.mockImplementation(() => false)
				component.root.findAllByType('select')[1].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: 'Percent'
					},
					relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(1)
				expect(setCustomValidity).toHaveBeenLastCalledWith(
					'Answer cannot be 0 while Error Type is Percent'
				)
				expect(reportValidity).toHaveBeenCalledTimes(1)

				component = renderer.create(
					<NumericOption
						numericChoice={{ requirement: 'margin', type: 'percent', answer: 1 }}
						onHandleSelectChange={onSelectChange}
						onHandleInputChange={onInputChange}
					/>
				)

				isRefRelatedTarget.mockImplementation(() => false)
				component.root.findAllByType('select')[1].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: 'Percent'
					},
					relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(2)
				expect(setCustomValidity).toHaveBeenLastCalledWith('')
				expect(reportValidity).toHaveBeenCalledTimes(2)
			})

			test('Expected validation is reported when blur from error type as absolute', () => {
				const onSelectChange = jest.fn()
				const onInputChange = jest.fn()
				const component = renderer.create(
					<NumericOption
						numericChoice={{ requirement: 'margin', type: 'Absolute', answer: 0 }}
						onHandleSelectChange={onSelectChange}
						onHandleInputChange={onInputChange}
					/>
				)
				const setCustomValidity = jest.fn()
				const reportValidity = jest.fn()
				NumericEntry.mockImplementation(() => ({
					status: OK
				}))

				NumericEntryRange.mockImplementation(() => ({
					isSingular: true
				}))

				// Is not ref related target
				isRefRelatedTarget.mockImplementation(() => false)
				component.root.findAllByType('select')[1].props.onBlur({
					target: {
						setCustomValidity,
						reportValidity,
						value: 'Absolute'
					},
					relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
				})
				expect(setCustomValidity).toHaveBeenCalledTimes(1)
				expect(setCustomValidity).toHaveBeenLastCalledWith('')
				expect(reportValidity).toHaveBeenCalledTimes(1)
			})
		})


	})

	describe('within a range', () => {
		test('Expected validation is reported when blur from start input', () => {
			const onSelectChange = jest.fn()
			const onInputChange = jest.fn()
			const component = renderer.create(
				<NumericOption
					numericChoice={{ requirement: 'range', start: '1', end: '1' }}
					onHandleSelectChange={onSelectChange}
					onHandleInputChange={onInputChange}
				/>
			)
			const setCustomValidity = jest.fn()
			const reportValidity = jest.fn()
			NumericEntry.mockImplementation(() => ({
				status: OK
			}))

			NumericEntryRange.mockImplementation(() => ({
				isSingular: true
			}))

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '1'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(1)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(1)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '1'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(2)
			expect(setCustomValidity).toHaveBeenLastCalledWith(
				'Start value should be smaller than the end value'
			)
			expect(reportValidity).toHaveBeenCalledTimes(2)

			NumericEntryRange.mockImplementation(() => {
				throw 'Invalid range: min value must be larger than max value'
			})

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(3)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(3)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(4)
			expect(setCustomValidity).toHaveBeenLastCalledWith(
				"Start value can't be larger than the end value"
			)
			expect(reportValidity).toHaveBeenCalledTimes(4)

			NumericEntryRange.mockImplementation(() => {
				throw 'Some other error'
			})

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(5)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(5)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[0].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[1]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(6)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(6)
		})

		test('Expected validation is reported when blur from end input', () => {
			const onSelectChange = jest.fn()
			const onInputChange = jest.fn()
			const component = renderer.create(
				<NumericOption
					numericChoice={{ requirement: 'range', start: '1', end: '1' }}
					onHandleSelectChange={onSelectChange}
					onHandleInputChange={onInputChange}
				/>
			)
			const setCustomValidity = jest.fn()
			const reportValidity = jest.fn()
			NumericEntry.mockImplementation(() => ({
				status: OK
			}))

			NumericEntryRange.mockImplementation(() => ({
				isSingular: true
			}))

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '1'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(1)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(1)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '1'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(2)
			expect(setCustomValidity).toHaveBeenLastCalledWith(
				'End value should be larger than the start value'
			)
			expect(reportValidity).toHaveBeenCalledTimes(2)

			NumericEntryRange.mockImplementation(() => {
				throw 'Invalid range: min value must be larger than max value'
			})

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(3)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(3)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(4)
			expect(setCustomValidity).toHaveBeenLastCalledWith(
				"End value can't be smaller than the start value"
			)
			expect(reportValidity).toHaveBeenCalledTimes(4)

			NumericEntryRange.mockImplementation(() => {
				throw 'Some other error'
			})

			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(5)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(5)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(6)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(6)

			NumericEntryRange.mockImplementation(() => ({
				isSingular: false
			}))
			isRefRelatedTarget.mockImplementation(() => true)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(7)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(7)

			isRefRelatedTarget.mockImplementation(() => false)
			component.root.findAllByProps({ className: 'input-item' })[1].props.onBlur({
				target: {
					setCustomValidity,
					reportValidity,
					value: '2'
				},
				relatedTarget: component.root.findAllByProps({ className: 'input-item' })[0]
			})
			expect(setCustomValidity).toHaveBeenCalledTimes(8)
			expect(setCustomValidity).toHaveBeenLastCalledWith('')
			expect(reportValidity).toHaveBeenCalledTimes(8)
		})
	})
})
