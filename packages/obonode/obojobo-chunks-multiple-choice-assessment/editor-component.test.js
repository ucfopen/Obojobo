import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MCAssessment from './editor-component'

describe('MCAssessment Editor Node', () => {
	test('MCAssessment builds the expected component', () => {
		const component = renderer.create(
			<MCAssessment
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

	test('MCAssessment builds the expected component with defaults', () => {
		const component = renderer.create(
			<MCAssessment
				node={{
					data: {
						get: key => {
							if (key === 'questionType') return null
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment adds a new choice', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}
		const component = mount(
			<MCAssessment
				node={{
					data: {
						get: key => {
							if (key === 'questionType') return null
							return {}
						}
					},
					nodes: { size: 1 }
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

	test('MCAssessment changes response type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MCAssessment
				node={{
					data: {
						get: key => {
							if (key === 'questionType') return null
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)
		
		component
			.find('select')
			.at(0)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'pick-all' }})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('MCAssessment toggles shuffle', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MCAssessment
				node={{
					data: {
						get: key => {
							if (key === 'questionType') return null
							return {}
						},
						toJSON: () => ({})
					}
				}}
				editor={editor}
			/>
		)
		
		component
			.find('input')
			.at(0)
			.simulate('change', { stopPropagation: jest.fn(), target: { checked: true }})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
