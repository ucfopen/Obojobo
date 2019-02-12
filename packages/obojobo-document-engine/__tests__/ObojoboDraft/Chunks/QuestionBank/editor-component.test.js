import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import QuestionBank from 'ObojoboDraft/Chunks/QuestionBank/editor-component'

describe('QuestionBank editor', () => {
	test('QuestionBank builds the expected component', () => {
		const component = renderer.create(
			<QuestionBank
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank builds the expected component', () => {
		const component = renderer.create(
			<QuestionBank
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<QuestionBank
				node={{
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
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

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component adds question', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<QuestionBank
				node={{
					data: {
						get: () => ({ content: {} })
					},
					nodes: []
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component adds question bank', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<QuestionBank
				node={{
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
						}
					},
					nodes: []
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
