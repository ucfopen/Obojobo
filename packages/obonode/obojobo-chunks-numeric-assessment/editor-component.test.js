import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import NumericAssessment from './editor-component'

describe('NumericAssessment Editor Node', () => {
	test('NumericAssessment builds the expected component', () => {
		const component = renderer.create(
			<NumericAssessment
				node={{
					data: {
						get: () => {
							return 'mock-question-type'
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment builds the expected component with defaults', () => {
		const component = renderer.create(
			<NumericAssessment
				node={{
					data: {
						get: () => {
							return null
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment component adds choice', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAssessment
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
