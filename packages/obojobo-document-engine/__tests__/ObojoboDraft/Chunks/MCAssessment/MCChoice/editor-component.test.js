import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MCChoice from 'ObojoboDraft/Chunks/MCAssessment/MCChoice/editor-component'

describe('MCChoice Editor Node', () => {
	test('MCChoice component', () => {
		const component = renderer.create(
			<MCChoice
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

	test('MCChoice component correct choice', () => {
		const component = renderer.create(
			<MCChoice
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

	test('MCChoice component deletes itself', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
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

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component edits score', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => ({
							score: 0
						})
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(editor.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 100 } }
		})

		const component2 = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 100
							}
						}
					}
				}}
				editor={editor}
			/>
		)

		component2
			.find('button')
			.at(1)
			.simulate('click')

		expect(editor.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 0 } }
		})
	})

	test('MCChoice component adds feedback', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
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

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
