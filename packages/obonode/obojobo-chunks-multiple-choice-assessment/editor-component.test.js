import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MCAssessment from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('MCAssessment Editor Node', () => {
	test('MCAssessment builds the expected component', () => {
		const component = renderer.create(<MCAssessment element={{ content: {} }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment adds a new choice', () => {
		const component = mount(
			<MCAssessment
				element={{
					questionType: 'mock-question-type',
					content: {},
					children: []
				}}
			/>
		)
		ReactEditor.findPath.mockReturnValueOnce([0])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('MCAssessment changes response type', () => {
		const component = mount(
			<MCAssessment
				element={{
					questionType: 'mock-question-type',
					content: {}
				}}
			/>
		)

		component
			.find('select')
			.at(0)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'pick-all' } })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('MCAssessment toggles shuffle', () => {
		const component = mount(
			<MCAssessment
				element={{
					questionType: 'mock-question-type',
					content: {}
				}}
			/>
		)

		component
			.find('input')
			.at(0)
			.simulate('change', { stopPropagation: jest.fn(), target: { checked: true } })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
