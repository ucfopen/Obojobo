import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Question from './editor-component'

import { Editor, Transforms } from 'slate'
jest.mock('slate', () => ({
	Editor: {
		levels: () => [[{ type: 'ObojoboDraft.Sections.Assessment' }]],
		withoutNormalizing: (editor, fn) => fn()
	},
	Transforms: {
		setNodes: jest.fn(),
		removeNodes: jest.fn(),
		insertNodes: jest.fn()
	}
}))
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
import Common from 'obojobo-document-engine/src/scripts/common'
jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		getItemForType: type => ({
			cloneBlankNode: () => ({
				clonedNode: true
			}),
			slateToObo: () => ({
				slateToOboReturnFor: type
			}),
			oboToSlate: type => ({
				oboToSlateReturnFor: type
			})
		}),
		contentTypes: [MCASSESSMENT_NODE, NUMERIC_ASSESSMENT_NODE]
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
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const MATERIA_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.MateriaAssessment'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

describe('Question Editor Node', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Question builds the expected component', () => {
		const props = {
			element: {
				content: { type: 'default' },
				children: [{}, { subtype: SOLUTION_NODE }]
			}
		}
		const component = renderer.create(<Question {...props} />)
		const mainComponent = component.root.findByProps({
			className: 'obojobo-draft--chunks--question--wrapper'
		}).children[0].children[0]
		expect(mainComponent.props.className).toBe(
			'component obojobo-draft--chunks--question is-viewed pad is-type-default is-not-collapsed'
		)

		const options = component.root.findByType('select').findAllByType('option')
		expect(options.length).toBe(2)
		expect(options[0].props.value).toBe(MCASSESSMENT_NODE)
		expect(options[1].props.value).toBe(NUMERIC_ASSESSMENT_NODE)

		const collapseButton = component.root.findByProps({ className: 'collapse-button' })
		expect(collapseButton.children[0].children[0]).toBe('-')

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question builds the expected component (collapsed)', () => {
		const props = {
			element: {
				content: { type: 'default', collapsed: true },
				children: [{}, { subtype: SOLUTION_NODE }]
			}
		}
		const component = renderer.create(<Question {...props} />)
		const mainComponent = component.root.findByProps({
			className: 'obojobo-draft--chunks--question--wrapper'
		}).children[0].children[0]
		expect(mainComponent.props.className).toBe(
			'component obojobo-draft--chunks--question is-viewed pad is-type-default is-collapsed'
		)

		const collapseButton = component.root.findByProps({ className: 'collapse-button' })
		expect(collapseButton.children[0].children[0]).toBe('+')
	})

	test('Question builds the expected component (not in assessment)', () => {
		const props = {
			element: {
				content: { type: 'default' },
				children: [{}, { subtype: SOLUTION_NODE }]
			}
		}

		const previousMock = Editor.levels
		Editor.levels = () => [[{ type: 'MockType' }]]

		const component = renderer.create(<Question {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		Editor.levels = previousMock
	})

	test('Survey Question builds the expected component', () => {
		const props = {
			element: {
				content: { type: 'survey' },
				children: [{}]
			}
		}
		const component = renderer.create(<Question {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component deletes self', () => {
		const props = {
			element: {
				content: { type: 'default' },
				children: [{}]
			}
		}
		const component = mount(<Question {...props} />)

		// click Delete button
		component
			.find('.delete-button')
			.at(0)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('Question component adds Solution', () => {
		const props = {
			element: {
				content: { type: 'default' },
				children: [{}]
			}
		}
		const component = mount(<Question {...props} />)
		const tree = component.html()
		ReactEditor.findPath.mockReturnValue([])

		// click first add solution button
		component
			.find('.add-solution')
			.at(0)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Question toggles survey type', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [{ type: BREAK_NODE }, { id: 'mock-mca-id', type: MCASSESSMENT_NODE }]
			}
		}
		const component = mount(<Question {...props} />)
		const path = [9, 2]
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(path)

		// turn ON survey
		component.find({ type: 'checkbox' }).simulate('change', { target: { checked: true } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'survey' } },
			{ at: path }
		)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ questionType: 'survey' },
			{ at: pathOfMCAssessment }
		)

		Transforms.setNodes.mockClear()

		// turn OFF survey
		component.find({ type: 'checkbox' }).simulate('change', { target: { checked: false } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'default' } },
			{ at: path }
		)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ questionType: 'default' },
			{ at: pathOfMCAssessment }
		)
	})

	test('Question toggles survey type with a solution', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE },
					{ subtype: SOLUTION_NODE }
				]
			}
		}
		const component = mount(<Question {...props} />)
		const path = [9, 2]
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(path)

		// turn ON survey
		component.find({ type: 'checkbox' }).simulate('change', { target: { checked: true } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'survey' } },
			{ at: path }
		)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ questionType: 'survey' },
			{ at: pathOfMCAssessment }
		)

		Transforms.setNodes.mockClear()

		// turn OFF survey
		component.find({ type: 'checkbox' }).simulate('change', { target: { checked: false } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'default' } },
			{ at: path }
		)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ questionType: 'default' },
			{ at: pathOfMCAssessment }
		)
	})

	test('Changing question type updates the assessment node', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE },
					{ subtype: SOLUTION_NODE }
				]
			}
		}
		ReactEditor.findPath.mockReturnValue([])

		const component = mount(<Question {...props} />)
		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'ObojoboDraft.Chunks.NumericAssessment' } })

		expect(Transforms.removeNodes).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('Changing question type updates the assessment node (without a solution)', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [{ type: BREAK_NODE }, { id: 'mock-mca-id', type: MCASSESSMENT_NODE }]
			}
		}
		ReactEditor.findPath.mockReturnValue([])

		const component = mount(<Question {...props} />)
		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'ObojoboDraft.Chunks.NumericAssessment' } })

		expect(Transforms.removeNodes).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('Question toggles collapsed status', () => {
		const mockElement = {
			content: { type: 'default' },
			children: [{ type: BREAK_NODE }, { id: 'mock-mca-id', type: MCASSESSMENT_NODE }]
		}
		// intentionally leaving 'collapsed' undefined in element.content to simulate backwards compatibility
		const props = {
			editor: {},
			element: mockElement
		}

		const component = mount(<Question {...props} />)
		const path = [9, 2]
		ReactEditor.findPath.mockReturnValue(path)

		component
			.find('.collapse-button')
			.at(0)
			.simulate('click')
		component.update()

		// when undefined, next state should be true
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'default', collapsed: true } },
			{ at: path }
		)
		Transforms.setNodes.mockClear()
		// ordinarily this would be updated by the Slate code - here we do it manually
		// doing this without re-mounting/re-rendering works because it's passed by reference, not by value I guess
		mockElement.content.collapsed = true

		component
			.find('.collapse-button')
			.at(0)
			.simulate('click')
		component.update()

		// when true, next state should be false
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'default', collapsed: false } },
			{ at: path }
		)
		Transforms.setNodes.mockClear()

		mockElement.content.collapsed = false

		component
			.find('.collapse-button')
			.at(0)
			.simulate('click')
		component.update()

		// when false, next state should be true
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { type: 'default', collapsed: true } },
			{ at: path }
		)
	})

	test('Question type options include Materia assessment if it is registered', () => {
		Common.Registry.contentTypes = [
			MCASSESSMENT_NODE,
			NUMERIC_ASSESSMENT_NODE,
			MATERIA_ASSESSMENT_NODE
		]

		const props = {
			element: {
				content: { type: 'default' },
				children: [{}, { subtype: SOLUTION_NODE }]
			}
		}
		const component = renderer.create(<Question {...props} />)
		const mainComponent = component.root.findByProps({
			className: 'obojobo-draft--chunks--question--wrapper'
		}).children[0].children[0]
		expect(mainComponent.props.className).toBe(
			'component obojobo-draft--chunks--question is-viewed pad is-type-default is-not-collapsed'
		)

		const options = component.root.findByType('select').findAllByType('option')
		expect(options.length).toBe(3)
		expect(options[0].props.value).toBe(MCASSESSMENT_NODE)
		expect(options[1].props.value).toBe(NUMERIC_ASSESSMENT_NODE)
		expect(options[2].props.value).toBe(MATERIA_ASSESSMENT_NODE)
	})
})
