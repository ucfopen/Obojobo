import React from 'react'
import Button from './button'
import { mount } from 'enzyme'

describe('Button', () => {
	test('renders when given props', () => {
		const mockProps = {
			ariaLabel: 'aria label',
			className: 'extraClass'
		}

		const component = mount(<Button {...mockProps}>Button Text</Button>)

		expect(component.find('button').prop('className')).toBe('repository--button extraClass')
		expect(component.find('button').prop('disabled')).toBeUndefined()
		expect(component.find('button').text()).toBe('Button Text')
	})

	test('runs onClick callback function when clicked', () => {
		const mockOnClick = jest.fn()

		const mockProps = {
			onClick: mockOnClick
		}

		const component = mount(<Button {...mockProps}>Button Text</Button>)

		component.find('button').simulate('click')
		component.find('button').simulate('click')

		expect(mockOnClick).toHaveBeenCalledTimes(2)
	})
})
