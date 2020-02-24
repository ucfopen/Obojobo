import React from 'react'
import { shallow } from 'enzyme'

import VariableBlock from '../../../../src/scripts/oboeditor/components/variables/variable-block'

describe('VariableBlock', () => {
	test('VariableBlock component is selected"', () => {
		const variable = {
			name: 'mock_var',
			type: 'static-value',
			value: '3'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
				isSelected={true}
			/>
		)

		expect(component.find('.single-variable').hasClass('variable-is-selected')).toEqual(true)

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "static-value"', () => {
		const variable = {
			name: 'mock_var',
			type: 'static-value',
			value: '3'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "static-value" and no default value', () => {
		const variable = {
			name: 'mock_var',
			type: 'static-value'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-number"', () => {
		const variable = {
			name: 'b',
			type: 'random-number',
			start: '9',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '4',
			decimalPlacesMin: '4'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-number" with no default value', () => {
		const variable = {
			name: 'b',
			type: 'random-number'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "static-list"', () => {
		const variable = {
			name: 'c',
			type: 'static-list',
			value: '4, 5, 6'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "static-list" with no default value', () => {
		const variable = {
			name: 'c',
			type: 'static-list'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-list"', () => {
		const variable = {
			name: 'd',
			type: 'random-list',
			unique: 'false',
			sizeMax: '5',
			sizeMin: '3',
			valueMax: '10',
			valueMin: '3',
			decimalPlacesMax: '1',
			decimalPlacesMin: '1'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-list" with no default value', () => {
		const variable = {
			name: 'd',
			type: 'random-list'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-list" - when sizeMin = sizeMax = 1, item should be singular', () => {
		const variable = {
			name: 'd',
			type: 'random-list',
			sizeMin: '1',
			sizeMax: '1',
			valueMin: '3',
			valueMax: '33'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-list" - when sizeMin > 1, item should be plural', () => {
		const variable = {
			name: 'd',
			type: 'random-list',
			sizeMin: '4',
			sizeMax: '4'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-sequence"', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMax: '10',
			sizeMin: '3',
			start: '3',
			seriesType: 'geometric'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-sequence" with no default value', () => {
		const variable = {
			name: 'e',
			type: 'random-sequence'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-one"', () => {
		const variable = {
			name: 'f',
			type: 'pick-one',
			value: '3, 4, 5, 3, 5'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-sequence" - when sizeMin = sizeMax = 1, item should be singular', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMax: '1',
			sizeMin: '1',
			start: '3',
			seriesType: 'geometric'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "random-sequence" - when size > 1, item should be plural', () => {
		const variable = {
			name: 'e',
			step: '1.1',
			type: 'random-sequence',
			sizeMax: '4',
			sizeMin: '4',
			start: '3',
			seriesType: 'geometric'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-one" with no default value', () => {
		const variable = {
			name: 'f',
			type: 'pick-one'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-list"', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: 'false',
			chooseMax: '40',
			chooseMin: '5'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-list" with no default value', () => {
		let variable = {
			name: 'g',
			type: 'pick-list'
		}

		let component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()

		variable = {
			name: 'g',
			type: 'pick-list',
			chooseMax: '40',
			chooseMin: '5'
		}

		component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-list" - when chooseMax = choseMin = 1, item should be singular', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: 'false',
			chooseMax: '1',
			chooseMin: '1'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableBlock with type "pick-list" - when choose > 1, item should be plural', () => {
		const variable = {
			name: 'g',
			type: 'pick-list',
			value: '33, 3, 4, 55, 23, 444',
			ordered: 'false',
			chooseMax: '4',
			chooseMin: '4'
		}

		const component = shallow(
			<VariableBlock
				variable={variable}
				index={0}
				currSelect={0}
				creatingVariable={false}
				onClickVarible={jest.fn()}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
