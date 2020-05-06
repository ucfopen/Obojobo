import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import NumericChoice from './editor-component'

describe('NumericChoice Editor Node', () => {
	test('NumericChoice component', () => {
		const component = renderer.create(
			<NumericChoice
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: []
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericChoice component correct choice', () => {
		const component = renderer.create(
			<NumericChoice
				node={{
					data: {
						get: () => {
							return { score: 100 }
						}
					},
					nodes: { size: 2 }
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericChoice component deletes itself', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericChoice
				node={{
					key: 'mockKey',
					nodes: [{ key: 'child1' }, { key: 'child2' }],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		const tree = component.html()

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericChoice component adds feedback', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericChoice
				node={{
					key: 'mockKey',
					nodes: [{ key: 'child1' }, { key: 'child2' }],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
