const mockFocus = jest.fn()

jest.mock('react', () => {
	const ActualReact = jest.requireActual('react')
	return {
		...ActualReact,
		useRef: jest.fn(() => {
			return {
				current: {
					focus: mockFocus
				}
			}
		})
	}
})

import React from 'react'
import Search from './search'
import { create, act } from 'react-test-renderer'

describe('Search', () => {
	let searchProps

	beforeEach(() => {
		searchProps = {
			value: null,
			onChange: jest.fn()
		}
		React.useRef.mockClear()
		mockFocus.mockReset()
	})

	test('renders correctly with no props', () => {
		let component
		act(() => {
			component = create(<Search />)
		})

		expect(React.useRef).toHaveBeenCalledTimes(1)
		expect(mockFocus).not.toHaveBeenCalled()

		const expectedClasses = 'repository--nav--links--search is-empty'
		expect(component.root.children[0].props.className).toBe(expectedClasses)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with focusOnMount=true', () => {
		searchProps.focusOnMount = true
		let component
		act(() => {
			component = create(<Search {...searchProps} />, {
				createNodeMock: () => {
					return {
						focus: mockFocus
					}
				}
			})
		})

		expect(React.useRef).toHaveBeenCalledTimes(1)
		expect(mockFocus).toHaveBeenCalledTimes(1)

		const expectedClasses = 'repository--nav--links--search is-empty'
		expect(component.root.children[0].props.className).toBe(expectedClasses)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with a non-empty value', () => {
		searchProps.value = 'string'
		let component
		act(() => {
			component = create(<Search {...searchProps} />)
		})

		const expectedClasses = 'repository--nav--links--search is-not-empty'
		expect(component.root.children[0].props.className).toBe(expectedClasses)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('changes to the input call onChange', () => {
		let component
		act(() => {
			component = create(<Search {...searchProps} />)
		})

		const mockChangeEvent = {
			target: { value: 'string' }
		}
		component.root.findByProps({ type: 'search' }).props.onChange(mockChangeEvent)

		expect(searchProps.onChange).toHaveBeenCalledTimes(1)
		expect(searchProps.onChange).toHaveBeenCalledWith('string')
	})

	test('clicks clear filter button', () => {
		let component
		act(() => {
			searchProps = { ...searchProps, value: 'mock-value' }
			component = create(<Search {...searchProps} />)
		})

		const mockClickEvent = {
			preventDefault: () => {}
		}
		component.root.findByType('button').props.onClick(mockClickEvent)

		expect(searchProps.onChange).toHaveBeenCalledTimes(1)
		expect(searchProps.onChange).toHaveBeenCalledWith('')
	})

	test('does not try to run props.onChange if it does not exist?', () => {
		delete searchProps.onChange
		let component
		act(() => {
			component = create(<Search {...searchProps} />)
		})

		const mockChangeEvent = {
			target: { value: 'string' }
		}
		component.root.findByProps({ type: 'search' }).props.onChange(mockChangeEvent)
	})
})
