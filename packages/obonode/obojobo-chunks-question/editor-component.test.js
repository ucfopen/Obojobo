import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Question from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		getItemForType: type => ({
			slateToObo: () => ({
				slateToOboReturnFor: type
			}),
			oboToSlate: type => ({
				oboToSlateReturnFor: type
			})
		})
	},
	components: {
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	}
}))
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

describe('Question Editor Node', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Question builds the expected component', () => {
		const component = renderer.create(
			<Question element={{ 
				content: { type: 'default' }, 
				children: [
					{},
					{ subtype: SOLUTION_NODE }
				] }}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Survey Question builds the expected component', () => {
		const component = renderer.create(
			<Question element={{ content: { type: 'survey' }, children: [{}] }}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component deletes self', () => {
		const component = mount(
			<Question element={{ content: { type: 'default' }, children: [{}] }}/>
		)

		component.find('Button').at(1).simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('Question component adds Solution', () => {
		const component = mount(
			<Question element={{ content: { type: 'default' }, children: [{}] }}/>
		)
		const tree = component.html()
		ReactEditor.findPath.mockReturnValue([])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Question component allows you to change set type', () => {
		const component = mount(
			<Question element={{ 
				content: { type: 'default' }, 
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE }
				]}}/>
		)
		ReactEditor.findPath.mockReturnValue([])

		component
			.find('input')
			.at(0)
			.simulate('change', { target: { checked: true } })

		component
			.find('input')
			.at(0)
			.simulate('change', { target: { checked: false } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
