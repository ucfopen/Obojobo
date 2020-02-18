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
			sizeMax: '10',
			sizeMin: '3',
			valueMax: '100',
			valueMin: '1',
			seriesType: 'geometric'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual(variable.sizeMin)
		expect(inputs.at(1).props().value).toEqual(variable.sizeMax)
		expect(inputs.at(2).props().value).toEqual(variable.valueMin)
		expect(inputs.at(3).props().value).toEqual(variable.valueMax)
		expect(inputs.at(4).props().value).toEqual(variable.step)

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
		expect(inputs.at(4).props().value).toEqual('')

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
			valueMax: '40',
			valueMin: '5'
		}

		const component = shallow(<VariableValue variable={variable} onChange={jest.fn()} />)

		const inputs = component.find('input')
		expect(inputs.at(0).props().value).toEqual(variable.value)
		expect(inputs.at(1).props().value).toEqual(variable.valueMin)
		expect(inputs.at(2).props().value).toEqual(variable.valueMax)

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

	test('onChangeMin (valueMin, valueMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
		const variable = {
			name: 'g',
			type: 'random-number',
			valueMax: '5',
			valueMin: '5'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(0).simulate('change', { target: { name: 'valueMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMax', value: '10' } })
	})

	test('onChangeMin (decimalPlacesMin, decimalPlacesMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
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

		inputs.at(2).simulate('change', { target: { name: 'decimalPlacesMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMin', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMax', value: '10' } })
	})

	test('onChangeMin (sizeMin, sizeMax) - when both values are equal and the first value is changed then the second value should match the first', () => {
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

		inputs.at(2).simulate('change', { target: { name: 'sizeMin', value: '0' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '0' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '0' } })

		inputs.at(2).simulate('change', { target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '7' } })
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

		inputs.at(2).simulate('change', { target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '7' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '7' } })
	})

	test('onChangeMax (valueMin, valueMax) - when both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'g',
			type: 'random-number',
			valueMax: '15',
			valueMin: '15'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(1).simulate('change', { target: { name: 'sizeMax', value: '40' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '40' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '40' } })

		inputs.at(1).simulate('change', { target: { name: 'valueMax', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMin', value: '1' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'valueMax', value: '1' } })
	})

	test('onChangeMax (decimalPlacesMin, decimalPlacesMax) - When both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'b',
			type: 'random-number',
			decimalPlacesMax: '4',
			decimalPlacesMin: '4'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(3).simulate('change', { target: { name: 'sizeMax', value: '30' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '30' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '30' } })

		inputs.at(3).simulate('change', { target: { name: 'decimalPlacesMax', value: '2' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMax', value: '2' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'decimalPlacesMin', value: '2' } })
	})

	test('onChangeMax (sizeMin, sizeMax) - When both values are equal and the second value is decreased the first value should match the second. Increasing the second value should not update the first', () => {
		const variable = {
			name: 'e',
			type: 'random-sequence',
			sizeMax: '3',
			sizeMin: '3'
		}

		const onChange = jest.fn()
		const component = shallow(<VariableValue variable={variable} onChange={onChange} />)
		const inputs = component.find('input')

		inputs.at(3).simulate('change', { target: { name: 'sizeMax', value: '10' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '10' } })
		expect(onChange).not.toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '10' } })

		inputs.at(3).simulate('change', { target: { name: 'sizeMax', value: '' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMin', value: '' } })
		expect(onChange).toHaveBeenCalledWith({ target: { name: 'sizeMax', value: '' } })
	})
})
