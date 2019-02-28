import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MathEquation from './editor-component'

describe('MathEquation Editor Node', () => {
	test('MathEquation component', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: 'flower', align: 'right' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation latex equation input change calls handleLatexChange', () => {
		const setNodeByKeyMock = jest.fn()
		const stopPropagationMock = jest.fn()

		const component = (
			<MathEquation
				editor={{
					onChange: () => {},
					value: {
						change: () => ({
							setNodeByKey: (key, data) => setNodeByKeyMock(key, data)
						})
					}
				}}
				node={{
					key: 'nodeKey',
					data: {
						get: () => {
							return { latex: '1', label: 'flower', align: 'right' }
						}
					}
				}}
			/>
		)

		const mountedComponent = mount(component)

		const input = mountedComponent.find('input').at(0)
		input.simulate('change', { target: { value: 'latexHere' } })
		input.simulate('click', { stopPropagation: stopPropagationMock })
		expect(setNodeByKeyMock).toBeCalledWith('nodeKey', {
			data: {
				content: {
					align: 'right',
					label: 'flower',
					latex: 'latexHere'
				}
			}
		})
		expect(stopPropagationMock).toBeCalled()
	})

	test('MathEquation equation label input change calls handleLabelChange', () => {
		const setNodeByKeyMock = jest.fn()
		const stopPropagationMock = jest.fn()
		const component = (
			<MathEquation
				editor={{
					onChange: () => {},
					value: {
						change: () => ({
							setNodeByKey: (key, data) => setNodeByKeyMock(key, data)
						})
					}
				}}
				node={{
					key: 'nodeKey',
					data: {
						get: () => {
							return { latex: '1', label: 'flower', align: 'right' }
						}
					}
				}}
			/>
		)

		const mountedComponent = mount(component)

		const input = mountedComponent.find('input').at(1)
		input.simulate('change', { target: { value: 'labelHere' } })
		input.simulate('click', { stopPropagation: stopPropagationMock })
		expect(setNodeByKeyMock).toBeCalledWith('nodeKey', {
			data: {
				content: {
					align: 'right',
					label: 'labelHere',
					latex: '1'
				}
			}
		})
		expect(stopPropagationMock).toBeCalled()
	})

	test('MathEquation component with empty label', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', align: 'left', label: '' }
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
							return { latex: null }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
