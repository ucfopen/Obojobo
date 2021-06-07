jest.mock('./module-menu-hoc', () => props => {
	return <mock-ModuleMenu {...props}>{props.children}</mock-ModuleMenu>
})

import React from 'react'
import Module from './module'
import ModuleMenu from './module-menu-hoc'

import { create, act } from 'react-test-renderer'

describe('Module', () => {
	let defaultProps

	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		defaultProps = {
			draftId: 'mockDraftId',
			title: 'Mock Module Title',
			hasMenu: true,
			isNew: false,
			isSelected: false,
			isMultiSelectMode: false
		}
	})

	test('renders with expected standard props', () => {
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe(
			'repository--module-icon is-not-open is-not-selected is-not-new'
		)

		const checkboxComponent = component.root.children[0].children[0]
		expect(checkboxComponent.type).toBe('input')
		expect(checkboxComponent.props.checked).toBe(false)
		expect(checkboxComponent.props.className).toBe('is-not-multi-select-mode')

		const mainChildComponent = component.root.children[0].children[1]
		expect(mainChildComponent.type).toBe('button')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with expected standard props but hasMenu=false', () => {
		defaultProps.hasMenu = false
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe(
			'repository--module-icon is-not-open is-not-selected is-not-new'
		)

		const checkboxComponent = component.root.children[0].children[0]
		expect(checkboxComponent.type).toBe('input')
		expect(checkboxComponent.props.checked).toBe(false)
		expect(checkboxComponent.props.className).toBe('is-not-multi-select-mode')

		const mainChildComponent = component.root.children[0].children[1]
		expect(mainChildComponent.type).toBe('a')
		expect(mainChildComponent.props.href).toBe('/library/mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with expected standard props but isNew=true', () => {
		defaultProps.isNew = true
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe(
			'repository--module-icon is-not-open is-not-selected is-new'
		)

		const checkboxComponent = component.root.children[0].children[0]
		expect(checkboxComponent.type).toBe('input')
		expect(checkboxComponent.props.checked).toBe(false)
		expect(checkboxComponent.props.className).toBe('is-not-multi-select-mode')

		const mainChildComponent = component.root.children[0].children[1]
		expect(mainChildComponent.type).toBe('button')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with expected standard props but isSelected=true', () => {
		defaultProps.isSelected = true
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe(
			'repository--module-icon is-not-open is-selected is-not-new'
		)

		const checkboxComponent = component.root.children[0].children[0]
		expect(checkboxComponent.type).toBe('input')
		expect(checkboxComponent.props.checked).toBe(true)
		expect(checkboxComponent.props.className).toBe('is-not-multi-select-mode')

		const mainChildComponent = component.root.children[0].children[1]
		expect(mainChildComponent.type).toBe('button')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with expected standard props but isMultiSelectMode=true', () => {
		defaultProps.isMultiSelectMode = true
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe(
			'repository--module-icon is-not-open is-not-selected is-not-new'
		)

		const checkboxComponent = component.root.children[0].children[0]
		expect(checkboxComponent.type).toBe('input')
		expect(checkboxComponent.props.checked).toBe(false)
		expect(checkboxComponent.props.className).toBe('is-multi-select-mode')

		const mainChildComponent = component.root.children[0].children[1]
		expect(mainChildComponent.type).toBe('button')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('clicking the main child component when hasMenu=true renders the module menu', () => {
		const reusableComponent = <Module {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		const mockClickEvent = {
			preventDefault: jest.fn()
		}
		act(() => {
			component.root.children[0].children[1].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByType(ModuleMenu).length).toBe(1)
	})

	test('clicking the main child component when isMultiSelectMode=true selects the module', () => {
		defaultProps.isMultiSelectMode = true
		defaultProps.onSelect = jest.fn()
		const reusableComponent = <Module {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const mockClickEvent = {
			preventDefault: jest.fn()
		}
		act(() => {
			component.root.children[0].children[1].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
		expect(defaultProps.onSelect).toHaveBeenCalledTimes(1)
	})

	test('clicking the input component selects the module', () => {
		defaultProps.onSelect = jest.fn()
		const reusableComponent = <Module {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		act(() => {
			component.root.children[0].children[0].props.onClick()
			component.update(reusableComponent)
		})
		expect(defaultProps.onSelect).toHaveBeenCalledTimes(1)
	})

	test('the module menu is not rendered after onMouseLeave is called', () => {
		const reusableComponent = <Module {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		act(() => {
			const mockClickEvent = {
				preventDefault: jest.fn()
			}
			component.root.children[0].children[1].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(component.root.findAllByType(ModuleMenu).length).toBe(1)

		act(() => {
			component.root.children[0].props.onMouseLeave()
			component.update(reusableComponent)
		})

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)
	})

	test('keyboard focus and blur close the collection menu as necessary', () => {
		const reusableComponent = <Module {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		act(() => {
			component.root.children[0].props.onFocus()
		})

		expect(window.clearTimeout).toHaveBeenCalledTimes(1)

		// bring up the module menu now so we can make sure it's gone later
		act(() => {
			const mockClickEvent = {
				preventDefault: jest.fn()
			}
			component.root.children[0].children[1].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(component.root.findAllByType(ModuleMenu).length).toBe(1)

		act(() => {
			component.root.children[0].props.onBlur()

			expect(window.setTimeout).toHaveBeenCalledTimes(1)
			jest.runAllTimers()

			component.update(reusableComponent)
		})

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)
	})
})
