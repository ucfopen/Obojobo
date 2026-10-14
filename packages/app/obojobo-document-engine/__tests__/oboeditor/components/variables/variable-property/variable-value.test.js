import React from 'react'
import { shallow } from 'enzyme'

import VariableValue from '../../../../../src/scripts/oboeditor/components/variables/variable-property/variable-value'

describe('VariableValue', () => {
	test('VariableValue', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)
		// inputs should not indicate errors - static-value types are inputs, not selects
		expect(
			component
				.find('.variable-values--group input')
				.at(0)
				.props().className
		).toBe('variable-property--input-item')
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component without valid type', () => {
		const variable = {
			name: 'g',
			type: 'mock-type'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.length).toEqual(0)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "static-value"', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('3')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "static-value" without default value', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "static-list"', () => {
		const variable = {
			name: 'c',
			type: 'static-list',
			value: '4, 5, 6'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('4, 5, 6')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "static-value" without default value', () => {
		const variable = {
			name: 'c',
			type: 'static-list'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-number"', () => {
		const variable = {
			name: 'b',
			type: 'random-number',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '4',
			decimalPlacesMin: '4'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('3')
		expect(inputs.at(1).props().value).toEqual('10')
		expect(inputs.at(2).props().value).toEqual('4')
		expect(inputs.at(3).props().value).toEqual('4')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-number" without default value', () => {
		const variable = {
			name: 'b',
			type: 'random-number'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')
		expect(inputs.at(1).props().value).toEqual('')
		expect(inputs.at(2).props().value).toEqual('')
		expect(inputs.at(3).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-list"', () => {
		const variable = {
			name: 'd',
			type: 'random-list',
			unique: true,
			sizeMax: '5',
			sizeMin: '3',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '1',
			decimalPlacesMin: '1'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual(variable.sizeMin)
		expect(inputs.at(1).props().value).toEqual(variable.sizeMax)
		expect(inputs.at(3).props().value).toEqual(variable.valueMin)
		expect(inputs.at(4).props().value).toEqual(variable.valueMax)
		expect(inputs.at(5).props().value).toEqual(variable.decimalPlacesMin)
		expect(inputs.at(6).props().value).toEqual(variable.decimalPlacesMax)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-list" without default value', () => {
		const variable = {
			name: 'd',
			type: 'random-list'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')
		expect(inputs.at(1).props().value).toEqual('')
		expect(inputs.at(3).props().value).toEqual('')
		expect(inputs.at(4).props().value).toEqual('')
		expect(inputs.at(5).props().value).toEqual('')
		expect(inputs.at(6).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-sequence"', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMin: '1',
			sizeMax: '10',
			start: '10',
			seriesType: 'geometric'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		// inputs should not indicate errors - random-sequence types are selects, not inputs
		expect(inputs.at(0).props().value).toEqual(variable.sizeMin)
		expect(inputs.at(0).props().className).toBe('variable-property--input-item')
		expect(inputs.at(1).props().value).toEqual(variable.sizeMax)
		expect(inputs.at(1).props().className).toBe('variable-property--input-item')
		expect(inputs.at(2).props().value).toEqual(variable.start)
		expect(inputs.at(2).props().className).toBe('variable-property--input-item')
		expect(inputs.at(3).props().value).toEqual(variable.step)
		expect(inputs.at(3).props().className).toBe('variable-property--input-item')
		expect(
			component
				.find('select')
				.at(0)
				.props().className
		).toBe('variable-property--select-item')
		expect(component.find('.invalid-value-warning').length).toBe(0)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "random-sequence" without default value', () => {
		const variable = {
			name: 'e',
			type: 'random-sequence'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')
		expect(inputs.at(1).props().value).toEqual('')
		expect(inputs.at(2).props().value).toEqual('')
		expect(inputs.at(3).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "pick-one"', () => {
		const variable = {
			name: 'f',
			type: 'pick-one',
			value: '3, 4, 5, 3, 5'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual(variable.value)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "pick-one" without default value', () => {
		const variable = {
			name: 'f',
			type: 'pick-one'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "pick-list"', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: false,
			chooseMax: '40',
			chooseMin: '5'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual(variable.value)
		expect(inputs.at(1).props().value).toEqual(variable.chooseMin)
		expect(inputs.at(2).props().value).toEqual(variable.chooseMax)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue component type "pick-list" without default value', () => {
		const variable = {
			name: 'g',
			type: 'pick-list'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual('')
		expect(inputs.at(1).props().value).toEqual('')
		expect(inputs.at(2).props().value).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('onBlurMin (valueMin, valueMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
		const variable = {
			name: 'g',
			type: 'random-number',
			valueMax: '5',
			valueMin: '5'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(0).simulate('blur', { target: { name: 'valueMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMax', value: '10' } })
	})

	test('onBlurMin (decimalPlacesMin, decimalPlacesMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
		const variable = {
			name: 'b',
			type: 'random-number',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '4',
			decimalPlacesMin: '4'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(2).simulate('blur', { target: { name: 'decimalPlacesMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMax', value: '10' } })
	})

	test('onBlurMin (sizeMin, sizeMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMax: '3',
			sizeMin: '3',
			valueMax: '100',
			valueMin: '1',
			seriesType: 'geometric'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(2).simulate('blur', { target: { name: 'sizeMin', value: '0' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '0' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '0' } })

		inputs.at(2).simulate('blur', { target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '7' } })
	})

	test('onBlurMin (chooseMin, chooseMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: 'false',
			chooseMax: '5',
			chooseMin: '5'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(1).simulate('blur', { target: { name: 'chooseMin', value: '0' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMin', value: '0' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'chooseMax', value: '0' } })

		inputs.at(1).simulate('blur', { target: { name: 'chooseMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMax', value: '7' } })
	})

	test('onChangeMin - if second value does not exist, it should match the first', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMin: '3',
			valueMax: '100',
			valueMin: '1',
			seriesType: 'geometric'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(2).simulate('blur', { target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '7' } })
	})

	test('onBlurMax (valueMin, valueMax) - when both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'g',
			type: 'random-number',
			valueMax: '15',
			valueMin: '15'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(1).simulate('blur', { target: { name: 'sizeMax', value: '40' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '40' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '40' } })

		inputs.at(1).simulate('blur', { target: { name: 'valueMax', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMin', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMax', value: '1' } })
	})

	test('onBlurMax (decimalPlacesMin, decimalPlacesMax) - When both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'b',
			type: 'random-number',
			decimalPlacesMax: '4',
			decimalPlacesMin: '4'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(3).simulate('blur', { target: { name: 'sizeMax', value: '30' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '30' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '30' } })

		inputs.at(3).simulate('blur', { target: { name: 'decimalPlacesMax', value: '2' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMax', value: '2' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMin', value: '2' } })
	})

	test('onBlurMax (sizeMin, sizeMax) - When both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'd',
			type: 'random-list',
			unique: true,
			sizeMax: '3',
			sizeMin: '3',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '1',
			decimalPlacesMin: '1'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(1).simulate('blur', { target: { name: 'sizeMax', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '10' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '10' } })

		inputs.at(1).simulate('blur', { target: { name: 'sizeMax', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '1' } })
	})

	test('onBlurMax (chooseMin, chooseMax) - When both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: 'false',
			chooseMax: '5',
			chooseMin: '5'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(2).simulate('blur', { target: { name: 'chooseMax', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMax', value: '10' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'chooseMin', value: '10' } })

		inputs.at(2).simulate('blur', { target: { name: 'chooseMax', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMin', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'chooseMax', value: '1' } })
	})

	test('renders with errors, no type match', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMin: '1',
			sizeMax: '10',
			start: '10',
			seriesType: 'geometric',
			errors: {
				irrelevantProp: true
			}
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		// inputs should not indicate errors - random-sequence types are selects, not inputs
		expect(inputs.at(0).props().value).toEqual(variable.sizeMin)
		expect(inputs.at(0).props().className).toBe('variable-property--input-item')
		expect(inputs.at(1).props().value).toEqual(variable.sizeMax)
		expect(inputs.at(1).props().className).toBe('variable-property--input-item')
		expect(inputs.at(2).props().value).toEqual(variable.start)
		expect(inputs.at(2).props().className).toBe('variable-property--input-item')
		expect(inputs.at(3).props().value).toEqual(variable.step)
		expect(inputs.at(3).props().className).toBe('variable-property--input-item')
		expect(
			component
				.find('select')
				.at(0)
				.props().className
		).toBe('variable-property--select-item')
	})

	// bonus test here to make sure the seriesType invalid option warning appears
	test('renders with errors, type matches', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMin: '1',
			sizeMax: '10',
			start: '10',
			seriesType: 'invalid',
			errors: {
				sizeMin: true,
				seriesType: true
			}
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		// inputs should not indicate errors - random-sequence types are selects, not inputs
		expect(inputs.at(0).props().value).toEqual(variable.sizeMin)
		expect(inputs.at(0).props().className).toBe('variable-property--input-item has-error')
		expect(inputs.at(1).props().value).toEqual(variable.sizeMax)
		expect(inputs.at(1).props().className).toBe('variable-property--input-item')
		expect(inputs.at(2).props().value).toEqual(variable.start)
		expect(inputs.at(2).props().className).toBe('variable-property--input-item')
		expect(inputs.at(3).props().value).toEqual(variable.step)
		expect(inputs.at(3).props().className).toBe('variable-property--input-item')
		expect(
			component
				.find('select')
				.at(0)
				.props().className
		).toBe('variable-property--select-item has-error')
		expect(component.find('.invalid-value-warning').length).toBe(1)
	})
})
