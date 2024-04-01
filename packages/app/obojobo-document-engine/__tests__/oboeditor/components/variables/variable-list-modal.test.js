jest.mock('react', () => {
	const ActualReact = jest.requireActual('react')
	return {
		...ActualReact,
		useRef: jest.fn()
	}
})

jest.mock(
	'../../../../src/scripts/oboeditor/components/variables/variable-property/variable-property'
)
jest.mock('../../../../src/scripts/oboeditor/components/variables/new-variable/new-variable')
jest.mock('../../../../src/scripts/oboeditor/components/variables/variable-block')
jest.mock('../../../../src/scripts/oboeditor/components/variables/variable-util')

jest.mock(
	'../../../../src/scripts/oboeditor/components/variables/variable-property/variable-property',
	() => props => {
		return <mock-VariableProperty {...props}>{props.children}</mock-VariableProperty>
	}
)
jest.mock(
	'../../../../src/scripts/oboeditor/components/variables/new-variable/new-variable',
	() => props => {
		return <mock-NewVariable {...props}>{props.children}</mock-NewVariable>
	}
)
jest.mock('../../../../src/scripts/oboeditor/components/variables/variable-block', () => props => {
	return <mock-VariableBlock {...props}>{props.children}</mock-VariableBlock>
})

import React from 'react'

import { create, act } from 'react-test-renderer'

import VariableListModal from '../../../../src/scripts/oboeditor/components/variables/variable-list-modal'
import {
	changeVariableToType,
	validateVariableValue,
	validateMultipleVariables,
	rangesToIndividualValues,
	individualValuesToRanges
} from '../../../../src/scripts/oboeditor/components/variables/variable-util'

import VariableProperty from '../../../../src/scripts/oboeditor/components/variables/variable-property/variable-property'
import NewVariable from '../../../../src/scripts/oboeditor/components/variables/new-variable/new-variable'
import VariableBlock from '../../../../src/scripts/oboeditor/components/variables/variable-block'

describe('VariableListModal', () => {
	// making these refs available to check that focus is called appropriately
	const firstRef = { current: { focus: jest.fn() } }
	const tabRef = { current: { focus: jest.fn() } }

	beforeEach(() => {
		jest.resetAllMocks()

		validateVariableValue.mockReturnValue(false)

		validateMultipleVariables.mockReturnValue([
			{
				name: 'var1',
				type: 'mockvar'
			},
			{
				name: 'var2',
				type: 'mockvar'
			}
		])

		React.useRef.mockReset()
		React.useRef.mockReturnValueOnce(firstRef).mockReturnValueOnce(tabRef)
	})

	test('renders with no variables', () => {
		validateMultipleVariables.mockReturnValue([])

		const content = { variables: [] }
		const component = create(<VariableListModal content={content} />)

		// kind of a given, but make sure the initial state-setting util functions are called
		expect(rangesToIndividualValues).toHaveBeenCalledTimes(1)
		expect(rangesToIndividualValues).toHaveBeenCalledWith(content.variables)
		expect(validateMultipleVariables).toHaveBeenCalledTimes(1)

		// should be no variable elements
		const blockComponents = component.root.findAllByType(VariableBlock)
		expect(blockComponents.length).toBe(0)

		// should not be creating a new variable by default
		// this is represented by the absence of a 'New Variable...' heading and the presence of a button
		expect(() => {
			component.root.findByProps({
				className: 'variable-holder'
			})
		}).toThrow()

		expect(
			component.root.findByProps({
				className: 'create-variable-button'
			})
		).not.toBeNull()

		// and also by the presence of a VariableProperty component instead of a NewVariable component
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()
		const variablePropertyElement = component.root.findByType(VariableProperty)
		expect(variablePropertyElement).not.toBeNull()

		// the variable property component should not be provided with a variable if there aren't any available
		expect(variablePropertyElement.props.variable).toBeUndefined()
	})

	test('renders with variables', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'mock'
				}
			]
		}
		const component = create(<VariableListModal content={content} />)

		expect(rangesToIndividualValues).toHaveBeenCalledTimes(1)
		expect(rangesToIndividualValues).toHaveBeenCalledWith(content.variables)
		expect(validateMultipleVariables).toHaveBeenCalledTimes(1)

		// correct number of variable block components should be rendered
		const blockComponents = component.root.findAllByType(VariableBlock)
		expect(blockComponents.length).toBe(2)

		// first variable should be selected by default
		expect(blockComponents[0].props.isSelected).toBe(true)
		expect(blockComponents[1].props.isSelected).toBe(false)

		// should not be creating a new variable by default
		// this is represented by the absence of a 'New Variable...' heading and the presence of a button
		expect(() => {
			component.root.findByProps({
				className: 'variable-holder'
			})
		}).toThrow()

		expect(
			component.root.findByProps({
				className: 'create-variable-button'
			})
		).not.toBeNull()

		// ... and also by the presence of a VariableProperty component instead of a NewVariable component
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()

		const variablePropertyElement = component.root.findByType(VariableProperty)
		expect(variablePropertyElement).not.toBeNull()

		// variable property element should have been provided with the selected variable
		// this is kind of magical because we happen to know what the util function is returning
		expect(variablePropertyElement.props.variable).toEqual({
			name: 'var1',
			type: 'mockvar'
		})

		expect(firstRef.current.focus).toHaveBeenCalledTimes(0)

		// ordinarily the SimpleDialog would handle this - make sure the correct ref's focus() is called
		component.root.children[0].props.focusOnFirstElement()
		expect(firstRef.current.focus).toHaveBeenCalledTimes(1)
	})

	test('changes state when clicking the "Create Variable" buton', () => {
		let component
		// will not provide variables in props in subsequent tests - variables are determined by the
		//  return of a util function, which we can mock per test as necessary
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		// make sure the default state is not creating a new variable
		expect(() => {
			component.root.findByProps({
				className: 'variable-holder'
			})
		}).toThrow()
		const newVariableButton = component.root.findByProps({
			className: 'create-variable-button'
		})
		expect(newVariableButton).not.toBeNull()

		// state should change when the 'create new variable' button is clicked
		act(() => {
			newVariableButton.props.onClick()
			component.update(reusableComponent)
		})
		// reverse default - button should be gone, placeholder should be active
		expect(() => {
			component.root.findByProps({
				className: 'create-variable-button'
			})
		}).toThrow()
		expect(
			component.root.findByProps({
				className: 'variable-holder'
			})
		).not.toBeNull()
	})

	test('changes state when clicking a variable', () => {
		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		let blockComponents = component.root.findAllByType(VariableBlock)
		expect(blockComponents.length).toBe(2)

		// first variable should be selected by default
		expect(blockComponents[0].props.isSelected).toBe(true)
		expect(blockComponents[1].props.isSelected).toBe(false)
		let variablePropertyElement = component.root.findByType(VariableProperty)
		expect(variablePropertyElement.props.variable).toEqual({
			name: 'var1',
			type: 'mockvar'
		})

		act(() => {
			blockComponents[1].props.onClick()
			component.update(reusableComponent)
		})

		blockComponents = component.root.findAllByType(VariableBlock)
		expect(blockComponents.length).toBe(2)

		// first variable should be selected by default
		expect(blockComponents[0].props.isSelected).toBe(false)
		expect(blockComponents[1].props.isSelected).toBe(true)
		variablePropertyElement = component.root.findByType(VariableProperty)
		expect(variablePropertyElement.props.variable).toEqual({
			name: 'var2',
			type: 'mockvar'
		})
		expect(tabRef.current.focus).toHaveBeenCalledTimes(1)
	})

	test('calls util functions correctly when reacting to SimpleDialog confirmation', () => {
		const mockFinalVariables = [
			{
				name: 'var1',
				type: 'mockvar'
			},
			{
				name: 'var2',
				type: 'mockvar'
			}
		]
		individualValuesToRanges.mockReturnValue(mockFinalVariables)
		const mockOnClose = jest.fn()

		const component = create(<VariableListModal content={{}} onClose={mockOnClose} />)

		component.root.children[0].props.onConfirm()

		expect(mockOnClose).toHaveBeenCalledWith({ variables: mockFinalVariables })
	})

	test('handles variable changes - simple value change, no error', () => {
		const mockVar = {
			name: 'var1',
			type: 'mockvar',
			prop: 'value-before'
		}
		validateMultipleVariables.mockReturnValue([{ ...mockVar }])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		// can't really check the state variables on the component
		//  itself, but we can see what their values are when they're
		//  passed to child components - it'll have to do
		expect(component.root.findByType(VariableBlock).props.variable).toEqual(mockVar)

		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'prop',
					type: 'input',
					value: 'value-after'
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual({
			...mockVar,
			prop: 'value-after'
		})
		expect(component.root.findByType(VariableBlock).props.variable.errors).toBeUndefined()
	})

	test('handles variable changes - simple value change, new error', () => {
		const mockVar = {
			name: 'var1',
			type: 'mockvar',
			prop: 'value-before'
		}
		validateMultipleVariables.mockReturnValue([{ ...mockVar }])

		// pretend there's a validation error now
		validateVariableValue.mockReturnValueOnce(true)

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual(mockVar)

		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'prop',
					type: 'input',
					value: 'value-after'
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual({
			...mockVar,
			prop: 'value-after',
			// errors should only indicate the property with the validation error
			errors: {
				prop: true
			}
		})
	})

	test('handles variable changes - simple value change, clear error', () => {
		const mockVar = {
			name: 'var1',
			type: 'mockvar',
			prop: 'value-before'
		}
		validateMultipleVariables.mockReturnValue([
			{
				...mockVar,
				errors: { prop: true }
			}
		])

		// pretend there's a validation error now
		validateVariableValue.mockReturnValueOnce(false)

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual({
			...mockVar,
			errors: { prop: true }
		})

		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'prop',
					type: 'input',
					value: 'value-after'
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual({
			...mockVar,
			prop: 'value-after'
		})
		expect(component.root.findByType(VariableBlock).props.variable.errors).toBeUndefined()
	})

	test('handles variable changes - simple value change, check box', () => {
		const mockVar = {
			name: 'var1',
			type: 'mockvar',
			prop: false
		}
		validateMultipleVariables.mockReturnValue([{ ...mockVar }])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})
		expect(component.root.findByType(VariableBlock).props.variable.prop).toBe(false)

		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'prop',
					type: 'checkbox',
					checked: true
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable.prop).toBe(true)

		// bonus test - change it back
		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'prop',
					type: 'checkbox',
					checked: false
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable.prop).toBe(false)
	})

	// changing a variable's type should completely reset it
	test('handles variable changes - type change', () => {
		const mockVar = {
			name: 'var1',
			type: 'mockvar',
			prop: 'value-before',
			errors: {
				prop: true
			}
		}
		validateMultipleVariables.mockReturnValue([{ ...mockVar }])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findByType(VariableBlock).props.variable).toEqual(mockVar)

		const newVar = {
			name: 'var1',
			type: 'othertype',
			prop2: 'value2'
		}
		changeVariableToType.mockReturnValueOnce(newVar)

		act(() => {
			const mockChangeEvent = {
				target: {
					name: 'type',
					type: 'input',
					value: 'othertype'
				}
			}
			component.root.findByType(VariableProperty).props.onChange(mockChangeEvent)
			component.update(reusableComponent)
		})

		// the 'type' property is changed on the variable before it's handed to the util to be changed
		expect(changeVariableToType).toHaveBeenCalledWith(
			{ ...mockVar, type: 'othertype' },
			'othertype'
		)
		expect(component.root.findByType(VariableBlock).props.variable).toEqual(newVar)
	})

	test('adds variables, no existing variables', () => {
		validateMultipleVariables.mockReturnValueOnce([])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		// make sure there are no variables and the 'new variable' area isn't showing
		expect(component.root.findAllByType(VariableBlock).length).toBe(0)
		expect(component.root.findByType(VariableProperty)).not.toBeNull()
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()

		// click the 'create new variable' button to enable new variable mode
		act(() => {
			component.root.findByProps({ className: 'create-variable-button' }).props.onClick()
			component.update(reusableComponent)
		})

		// should still be no variables, 'new variable' area should be visible now
		expect(component.root.findAllByType(VariableBlock).length).toBe(0)
		expect(() => {
			component.root.findByType(VariableProperty)
		}).toThrow()
		expect(component.root.findByType(NewVariable)).not.toBeNull()

		const newVariableComponent = component.root.findByType(NewVariable)

		// ordinarily the util function would send more, but for testing this should suffice
		const mockNewVar = {
			name: 'var',
			type: 'vartype',
			prop: 'val'
		}
		changeVariableToType.mockReturnValueOnce(mockNewVar)

		act(() => {
			newVariableComponent.props.addVariable('vartype')
			component.update(reusableComponent)
		})

		// new variables are automatically given the name 'var' plus their index number
		// the first variable is just 'var' though
		const expectedNewVariable = {
			name: 'var',
			type: 'vartype'
		}
		expect(changeVariableToType).toHaveBeenCalledWith(expectedNewVariable, 'vartype')

		// check for new variable and that 'new variable' area is replaced by property area
		expect(component.root.findAllByType(VariableBlock).length).toBe(1)
		expect(component.root.findByType(VariableProperty)).not.toBeNull()
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()

		// kind of arbitrary since we know what value we sent back, but just to make sure
		expect(component.root.findByType(VariableBlock).props.variable).toEqual(mockNewVar)
	})

	test('adds variables, pre-existing variables', () => {
		const mockVar = {
			name: 'var',
			type: 'mockvar',
			prop: 'val1'
		}
		validateMultipleVariables.mockReturnValueOnce([mockVar])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		// same tests as above, plus one variable already
		expect(component.root.findAllByType(VariableBlock).length).toBe(1)
		expect(component.root.findByType(VariableProperty)).not.toBeNull()
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()

		// click the 'create new variable' button to enable new variable mode
		act(() => {
			component.root.findByProps({ className: 'create-variable-button' }).props.onClick()
			component.update(reusableComponent)
		})

		expect(component.root.findAllByType(VariableBlock).length).toBe(1)
		expect(() => {
			component.root.findByType(VariableProperty)
		}).toThrow()
		expect(component.root.findByType(NewVariable)).not.toBeNull()

		const newVariableComponent = component.root.findByType(NewVariable)

		const mockNewVar = {
			name: 'var2',
			type: 'vartype',
			prop: 'val'
		}
		changeVariableToType.mockReturnValueOnce(mockNewVar)

		act(() => {
			newVariableComponent.props.addVariable('vartype')
			component.update(reusableComponent)
		})

		// new variables are automatically given the name 'var' plus their index number
		//  but only if there are already variables named 'var'
		// the first variable is always just 'var' though
		const expectedNewVariable = {
			name: 'var2',
			type: 'vartype'
		}
		expect(changeVariableToType).toHaveBeenCalledWith(expectedNewVariable, 'vartype')

		expect(component.root.findAllByType(VariableBlock).length).toBe(2)
		expect(component.root.findByType(VariableProperty)).not.toBeNull()
		expect(() => {
			component.root.findByType(NewVariable)
		}).toThrow()

		// kind of arbitrary since we know what value we sent back, but just to make sure
		expect(component.root.findAllByType(VariableBlock)[0].props.variable).toEqual(mockVar)
		expect(component.root.findAllByType(VariableBlock)[1].props.variable).toEqual(mockNewVar)
	})

	test('deletes a variable', () => {
		validateMultipleVariables.mockReturnValueOnce([
			{ name: 'mockvar1', type: 'mockvar' },
			{ name: 'mockvar2', type: 'mockvar' },
			{ name: 'mockvar3', type: 'mockvar' }
		])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		let variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(3)
		expect(variableBlocks[0].props.isSelected).toBe(true)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar1')
		expect(variableBlocks[1].props.isSelected).toBe(false)
		expect(variableBlocks[1].props.variable.name).toBe('mockvar2')
		expect(variableBlocks[2].props.isSelected).toBe(false)
		expect(variableBlocks[2].props.variable.name).toBe('mockvar3')

		act(() => {
			variableBlocks[1].props.onClick()
			component.update(reusableComponent)
		})

		expect(variableBlocks[0].props.isSelected).toBe(false)
		expect(variableBlocks[1].props.isSelected).toBe(true)
		expect(variableBlocks[2].props.isSelected).toBe(false)

		// delete button just deletes the currently selected variable
		act(() => {
			component.root.findByType(VariableProperty).props.deleteVariable()
			component.update(reusableComponent)
		})

		// the selected variable (the second one) should be gone now
		variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(2)
		// and also the 'selected' variable should always be the first one after any deletion
		expect(variableBlocks[0].props.isSelected).toBe(true)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar1')
		expect(variableBlocks[1].props.isSelected).toBe(false)
		expect(variableBlocks[1].props.variable.name).toBe('mockvar3')
	})

	test('duplicates a variable - existing suffixed variables', () => {
		// in the case of existing variables having a number at the end
		//  any duplicated variables will increment that number for the new name
		validateMultipleVariables.mockReturnValueOnce([
			{ name: 'mockvar1', type: 'mockvar' },
			{ name: 'mockvar2', type: 'mockvar' }
		])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		let variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(2)
		expect(variableBlocks[0].props.isSelected).toBe(true)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar1')
		expect(variableBlocks[1].props.isSelected).toBe(false)
		expect(variableBlocks[1].props.variable.name).toBe('mockvar2')

		act(() => {
			component.root.findByType(VariableProperty).props.duplicateVariable()
			component.update(reusableComponent)
		})

		variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(3)
		expect(variableBlocks[0].props.isSelected).toBe(false)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar1')
		expect(variableBlocks[1].props.isSelected).toBe(false)
		expect(variableBlocks[1].props.variable.name).toBe('mockvar2')
		expect(variableBlocks[2].props.isSelected).toBe(true)
		expect(variableBlocks[2].props.variable.name).toBe('mockvar3')
	})

	// if no variables exist with matching names plus a number at the end,
	//  duplicated variables will append the number '2' to the new name
	test('duplicates a variable - no suffixed variables', () => {
		validateMultipleVariables.mockReturnValueOnce([{ name: 'mockvar', type: 'mockvar' }])

		let component
		const reusableComponent = <VariableListModal content={{}} />
		act(() => {
			component = create(reusableComponent)
		})

		let variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(1)
		expect(variableBlocks[0].props.isSelected).toBe(true)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar')

		act(() => {
			component.root.findByType(VariableProperty).props.duplicateVariable()
			component.update(reusableComponent)
		})

		variableBlocks = component.root.findAllByType(VariableBlock)
		expect(variableBlocks.length).toBe(2)
		expect(variableBlocks[0].props.isSelected).toBe(false)
		expect(variableBlocks[0].props.variable.name).toBe('mockvar')
		expect(variableBlocks[1].props.isSelected).toBe(true)
		expect(variableBlocks[1].props.variable.name).toBe('mockvar2')
	})
})
