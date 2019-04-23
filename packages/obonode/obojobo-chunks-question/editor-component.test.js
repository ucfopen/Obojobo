import React from 'react'
import { mount } from 'enzyme'
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
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Question
				node={{
					data: {
						get: () => null
					},
					nodes: {
						last: () => ({ type: SOLUTION_NODE })
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Question component adds Solution', () => {
		const editor = {
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
