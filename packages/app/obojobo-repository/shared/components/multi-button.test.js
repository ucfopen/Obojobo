import React from 'react'
import Button from './button'
import MultiButton from './multi-button'
import { create, act } from 'react-test-renderer'

describe('Button', () => {
	let buttonProps

	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		buttonProps = {
			title: 'MultiButton Title'
		}
	})

	test('renders without props', () => {
		const component = create(<MultiButton></MultiButton>)

		// two empty spaces - one ahead of the possible extra className from props, one after
		const expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		// the button component inside MultiButton will always have an SVG child,
		//  but the second child will be based on props.title - in this case, missing
		expect(component.root.children[0].children[0].children.length).toBe(1)

		expect(component.root.findByProps({ className: 'child-buttons' }).children.length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with typical props', () => {
		const component = create(
			<MultiButton {...buttonProps}>
				<Button>Child Button</Button>
			</MultiButton>
		)

		const expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		expect(component.root.children[0].children[0].children.length).toBe(2)
		expect(component.root.children[0].children[0].children[1]).toBe('MultiButton Title')

		expect(component.root.findByProps({ className: 'child-buttons' }).children.length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with className', () => {
		buttonProps.className = 'extra-class'
		const component = create(<MultiButton {...buttonProps}></MultiButton>)

		const expectedDefaultClasses =
			'repository--button repository--multi-button extra-class is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)
	})

	test('clicking child button component toggles a class on the main component', () => {
		const reusableComponent = <MultiButton {...buttonProps}></MultiButton>
		const component = create(reusableComponent)

		let expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		const mockEvent = { preventDefault: jest.fn() }

		act(() => {
			component.root.children[0].children[0].props.onClick(mockEvent)
			component.update(reusableComponent)
		})
		expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
		mockEvent.preventDefault.mockReset()

		expectedDefaultClasses = 'repository--button repository--multi-button  is-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		act(() => {
			component.root.children[0].children[0].props.onClick(mockEvent)
			component.update(reusableComponent)
		})
		expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)

		expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)
	})

	test('keyboard focus and blur adjust a class on the main component as necessary', () => {
		const reusableComponent = <MultiButton {...buttonProps} />
		const component = create(reusableComponent)

		let expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		act(() => {
			component.root.children[0].props.onFocus()
		})
		expect(window.clearTimeout).toHaveBeenCalledTimes(1)

		const mockEvent = { preventDefault: jest.fn() }
		act(() => {
			component.root.children[0].children[0].props.onClick(mockEvent)
			component.update(reusableComponent)
		})
		expectedDefaultClasses = 'repository--button repository--multi-button  is-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)
		act(() => {
			component.root.children[0].props.onBlur()

			expect(window.setTimeout).toHaveBeenCalledTimes(1)
			jest.runAllTimers()

			component.update(reusableComponent)
		})
		expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)
	})

	test('the menu is closed after onMouseLeave is called', () => {
		const reusableComponent = <MultiButton {...buttonProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		let expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		const mockEvent = { preventDefault: jest.fn() }
		act(() => {
			component.root.children[0].children[0].props.onClick(mockEvent)
			component.update(reusableComponent)
		})
		expectedDefaultClasses = 'repository--button repository--multi-button  is-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)

		act(() => {
			component.root.children[0].props.onMouseLeave()
			component.update(reusableComponent)
		})

		expectedDefaultClasses = 'repository--button repository--multi-button  is-not-open'
		expect(component.root.children[0].props.className).toBe(expectedDefaultClasses)
	})
})
