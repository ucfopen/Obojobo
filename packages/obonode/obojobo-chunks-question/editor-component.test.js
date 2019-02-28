import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Question from './editor-component'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Question Editor Node', () => {
	test('Question builds the expected component', () => {
		const component = renderer.create(
			<Question
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: {
						last: () => ({ type: BREAK_NODE })
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Question
				node={{
					data: {
						get: () => null
					},
					nodes: {
						last: () => ({ type: SOLUTION_NODE })
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Question component adds Solution', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Question
				node={{
					data: {
						get: () => null
					},
					nodes: {
						last: () => ({ type: BREAK_NODE })
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
