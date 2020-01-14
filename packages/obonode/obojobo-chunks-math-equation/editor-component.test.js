import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MathEquation from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.useFakeTimers()

describe('MathEquation Editor Node', () => {
	test('renders with no latex', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: null }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with error', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: 'x_0_0' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with label', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '', size: 1 }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits properties', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '1.1' }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		component.find({ id: 'math-equation-latex' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-label' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-alt' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-size' }).simulate('click', { stopPropagation: jest.fn() })
		component
			.find({ id: 'math-equation-label' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mockValue' } })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component calls setNodeByKey once edit dialog disappears', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					key: 'mock-key',
					data: {
						get: () => {
							return { latex: '2x/3', label: '1.1' }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)

		expect(editor.setNodeByKey).not.toHaveBeenCalled()

		component.setProps({ isSelected: false })

		expect(editor.setNodeByKey).not.toHaveBeenCalled()
		jest.runAllTimers()
		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
		expect(editor.setNodeByKey.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mock-key",
		  Object {
		    "data": Object {
		      "content": Object {
		        "alt": "",
		        "label": "1.1",
		        "latex": "2x/3",
		        "size": 1,
		      },
		    },
		  },
		]
	`)
	})

	test('MathEquation focuses on the first input when the edit dialog appears', () => {
		const mockFocus = jest.fn()
		const spy = jest.spyOn(document, 'getElementById').mockReturnValue({
			focus: mockFocus
		})

		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					key: 'mock-key',
					data: {
						get: () => {
							return { latex: '2x/3', label: '1.1' }
						}
					}
				}}
				isFocused={true}
				isSelected={false}
				editor={editor}
			/>
		)

		expect(mockFocus).not.toHaveBeenCalled()

		component.setProps({ isSelected: true })

		expect(mockFocus).not.toHaveBeenCalled()
		jest.runAllTimers()
		expect(mockFocus).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('changeProperties edits properties', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '', size: 1 }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)

		component.instance().changeProperties({ latex: '2', label: '2', size: 2 })

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(component.instance().state).toMatchInlineSnapshot(`
		Object {
		  "alt": "",
		  "label": "2",
		  "latex": "2",
		  "size": 2,
		}
	`)
	})

	test('onChangeContent edits properties', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '', size: 1 }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
