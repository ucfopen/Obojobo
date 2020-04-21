jest.mock('./module-menu-hoc')

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
			hasMenu: true
		}
	})

	test('renders with expected standard props', () => {
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe('repository--module-icon is-not-open')

		const mainChildComponent = component.root.children[0].children[0]
		expect(mainChildComponent.type).toBe('button')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with expected standard props but hasMenu=false', () => {
		defaultProps.hasMenu = false
		const component = create(<Module {...defaultProps} />)

		expect(component.root.findAllByType(ModuleMenu).length).toBe(0)

		expect(component.root.children[0].props.className).toBe('repository--module-icon is-not-open')

		const mainChildComponent = component.root.children[0].children[0]
		expect(mainChildComponent.type).toBe('a')
		expect(mainChildComponent.props.href).toBe('/library/mockDraftId')

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
			component.root.children[0].children[0].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByType(ModuleMenu).length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
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
			component.root.children[0].children[0].props.onClick(mockClickEvent)
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
			component.root.children[0].children[0].props.onClick(mockClickEvent)
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
