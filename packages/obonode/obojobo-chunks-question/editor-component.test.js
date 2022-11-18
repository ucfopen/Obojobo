import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Question from './editor-component'

import { Transforms } from 'slate'
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
		})
	},
	components: {
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>,
		// eslint-disable-next-line react/display-name
		MoreInfoButton: props => <button {...props}>{props.children}</button>
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
		const props = {
			element: {
				content: { type: 'default' },
				children: [{ content: {} }, { subtype: SOLUTION_NODE }]
			}
		}
		const component = renderer.create(<Question {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question builds the expected component (not in assessment)', () => {
		const props = {
			element: {
				content: { type: 'default' },
				children: [{ content: {} }, { subtype: SOLUTION_NODE }]
			}
		}
		const spy = jest.spyOn(Question.prototype, 'getIsInAssessment').mockReturnValue(false)
		const component = renderer.create(<Question {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		spy.mockRestore()
	})

	test('Survey Question builds the expected component', () => {
		const props = {
			element: {
				content: { type: 'survey' },
				children: [{ content: {} }]
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
				children: [{ content: {} }]
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
				children: [{ content: {} }]
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
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE, content: {} }
				]
			}
		}
		const component = mount(<Question {...props} />)
		const path = [9, 2]
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(path)

		// by default the 'partial scoring' checkbox should not be rendered
		// make sure there's only one - survey mode
		expect(component.find({ type: 'checkbox' }).length).toBe(1)

		// turn ON survey
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: true } })

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
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: false } })

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
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE, content: {} },
					{ subtype: SOLUTION_NODE }
				]
			}
		}
		const component = mount(<Question {...props} />)
		const path = [9, 2]
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(path)

		// turn ON survey
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: true } })

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
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: false } })

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

	test('Question shows and hides partial scoring toggle correctly', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE, content: {} }
				]
			}
		}
		const component = mount(<Question {...props} />)

		// by default the 'partial scoring' checkbox should not be rendered
		// make sure there's only one - survey mode
		expect(component.find({ type: 'checkbox' }).length).toBe(1)
		expect(
			component
				.find({ type: 'checkbox' })
				.at(0)
				.parent()
				.props().children[1]
		).toBe('Survey Only')

		// the 'partial scoring' checkbox appears when the question's response type is 'pick-all'
		const moddedProps = { ...props }
		moddedProps.element.children[1].content = { responseType: 'pick-all' }
		component.setProps(moddedProps)

		expect(component.find({ type: 'checkbox' }).length).toBe(2)
		expect(
			component
				.find({ type: 'checkbox' })
				.at(0)
				.parent()
				.props().children[1]
		).toBe('Partial Scoring')

		moddedProps.element.children[1].content = { responseType: 'pick-one' }
		component.setProps(moddedProps)

		expect(component.find({ type: 'checkbox' }).length).toBe(1)
		expect(
			component
				.find({ type: 'checkbox' })
				.at(0)
				.parent()
				.props().children[1]
		).toBe('Survey Only')
	})

	test('Question toggles partial scoring', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [
					{ type: BREAK_NODE },
					{
						id: 'mock-mca-id',
						type: MCASSESSMENT_NODE,
						content: { responseType: 'pick-all' }
					}
				]
			}
		}
		const component = mount(<Question {...props} />)
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(pathOfMCAssessment)

		expect(component.find({ type: 'checkbox' }).length).toBe(2)
		expect(
			component
				.find({ type: 'checkbox' })
				.at(0)
				.parent()
				.props().children[1]
		).toBe('Partial Scoring')

		// turn ON partial scoring
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: true } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { responseType: 'pick-all', partialScoring: true } },
			{ at: pathOfMCAssessment }
		)

		Transforms.setNodes.mockClear()

		// turn OFF partial scoring
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: false } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { responseType: 'pick-all', partialScoring: false } },
			{ at: pathOfMCAssessment }
		)
	})

	test('Question toggles partial scoring with a solution', () => {
		const props = {
			editor: {},
			element: {
				content: { type: 'default' },
				children: [
					{ type: BREAK_NODE },
					{
						id: 'mock-mca-id',
						type: MCASSESSMENT_NODE,
						content: { responseType: 'pick-all' }
					},
					{ subtype: SOLUTION_NODE }
				]
			}
		}
		const component = mount(<Question {...props} />)
		const pathOfMCAssessment = [9, 2, 1]
		ReactEditor.findPath.mockReturnValue(pathOfMCAssessment)

		// turn ON partial scoring
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: true } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { responseType: 'pick-all', partialScoring: true } },
			{ at: pathOfMCAssessment }
		)

		Transforms.setNodes.mockClear()

		// turn OFF survey
		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('change', { target: { checked: false } })

		component.update()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { responseType: 'pick-all', partialScoring: false } },
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
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE, content: {} },
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
				children: [
					{ type: BREAK_NODE },
					{ id: 'mock-mca-id', type: MCASSESSMENT_NODE, content: {} }
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
})
