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
							return { latex: '1' }
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

	test('MathEquation component with label', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits input', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('input')
			.at(0)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'mockInput' }
			})

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits label', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('input')
			.at(1)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: { value: 'mockInput' }
			})

		expect(tree).toMatchSnapshot()
	})
})
