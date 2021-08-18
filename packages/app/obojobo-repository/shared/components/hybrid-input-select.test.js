import React from 'react'
import HybridInputSelect from './hybrid-input-select'
import { create, act } from 'react-test-renderer'

describe('HybridInputSelect', () => {
	test('renders with default props', () => {
        const component = create(<HybridInputSelect />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
    })

    test('renders with a given list and placeholder', () => {
        const mockProps = {
            placeholder: 'Mock placeholder',
            list: [
                'mock-student-one',
                'mock-student-two',
                'mock-student-three',
                'mock-short',
                'mock-very-long-student-name',
                'mock-extremely-long-student-name'
            ]
        }
        const component = create(<HybridInputSelect {...mockProps} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
    })

    test('input is updated and list is filtered as expected', () => {
        // Without onChange prop
        let mockProps = {
            placeholder: 'Mock placeholder',
            list: [
                'mock-student-one',
                'mock-student-two',
                'mock-student-three'
            ]
        }
        let component = create(<HybridInputSelect {...mockProps} />)

        let input = component.root.findByProps({ type: 'text' })
        act(() => {
            input.props.onChange({ target: { value: 'mock-search-string' }})
        })
        expect(input.props.value).toBe('mock-search-string')

        // With onChange prop
        mockProps = { ...mockProps, onChange: jest.fn() }
        component = create(<HybridInputSelect {...mockProps} />)

        input = component.root.findByProps({ type: 'text' })
        act(() => {
            input.props.onChange({ target: { value: 'mock-search-string' }})
        })
        expect(input.props.value).toBe('mock-search-string')
    })

    test('clicking on an element sets input value to element\'s text', () => {
        const mockProps = {
            placeholder: 'Mock placeholder',
            list: [
                'mock-student-one',
                'mock-student-two',
                'mock-student-three'
            ],
            onChange: jest.fn()
        }
        const component = create(<HybridInputSelect {...mockProps} />)

        // Populating input so that the dropdown opens
        const input = component.root.findByProps({ type: 'text' })
        act(() => {
            input.props.onChange({ target: { value: 'mock' }})
        })

        // Selecting an element from the dropdown
        const element = component.root.findAllByProps({ className: 'element' })[0]
        act(() => {
            element.props.onClick('mock-student-one')
        })

        expect(input.props.value).toBe('mock-student-one')
    })
})
