import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Registry } from 'obojobo-document-engine/src/scripts/common/registry'
import QuestionBank from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')
import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('obojobo-document-engine/src/scripts/common/registry', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
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

jest.useFakeTimers()

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'

describe('QuestionBank editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		ReactEditor.findPath.mockReturnValue('mock-path')
	})

	test('QuestionBank builds the expected component', () => {
		const props = {
			node: {
				data: {
					get: () => {
						return {}
					}
				}
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			element: { content: {} }
		}

		const component = renderer.create(<QuestionBank {...props} />)
		const tree = component.toJSON()

		const collapseButton = component.root.findByProps({ className: 'collapse-button' })
		expect(collapseButton.props.children).toBe('-')

		const collapsedSummary = component.root.findAllByProps({ className: 'collapsed-summary' })
		expect(collapsedSummary.length).toBe(0)

		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank builds the expected component (collapsed)', () => {
		const props = {
			node: {
				data: {
					get: () => {
						return {}
					}
				}
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			element: { content: { collapsed: true } }
		}

		const component = renderer.create(<QuestionBank {...props} />)
		const tree = component.toJSON()

		const collapseButton = component.root.findByProps({ className: 'collapse-button' })
		expect(collapseButton.props.children).toBe('+')

		const collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary.length).toBe(1)

		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component changes to choose all', () => {
		const props = {
			element: {
				content: { choose: 8, select: 'sequential', chooseAll: false }
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)
		const pickSomeRadioInput = component.find({ type: 'radio', value: 'pick' })
		pickSomeRadioInput.simulate('click')
		pickSomeRadioInput.simulate('change', { target: { value: 'all' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('QuestionBank component changes choose amount', () => {
		const props = {
			element: {
				content: { choose: 8, select: 'sequential', chooseAll: false }
			},
			editor: {
				toggleEditable: jest.fn()
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)

		// make sure the pick input is set to 8 based on props
		const pickCountInput = component.find({ type: 'number' })
		expect(pickCountInput.props()).toHaveProperty('value', 8)

		const pickSomeRadioInput = component.find({ type: 'radio', value: 'pick' })
		pickSomeRadioInput.simulate('click')
		pickSomeRadioInput.simulate('change', { target: { value: 'pick' } })

		pickCountInput.simulate('focus')
		pickCountInput.simulate('click')
		pickCountInput.simulate('change', { target: { value: '7' } })
		pickCountInput.simulate('blur')
		jest.runAllTimers()

		expect(component.html()).toMatchSnapshot()
	})

	test('QuestionBank component changes select type', () => {
		const props = {
			element: {
				content: { choose: '8', select: 'sequential' }
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)

		const questionChooseMethodSelectInput = component.find('select')
		questionChooseMethodSelectInput.simulate('click')
		questionChooseMethodSelectInput.simulate('change', { target: { value: 'pick' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('QuestionBank component deletes self', () => {
		Registry.getItemForType.mockReturnValueOnce({
			insertJSON: {
				type: 'Mock'
			}
		})

		const props = {
			node: {
				data: {
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
						}
					}
				}
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {
				removeNodeByKey: jest.fn()
			},
			element: {
				content: { choose: 8, select: 'sequential' }
			}
		}

		const component = mount(<QuestionBank {...props} />)

		const deleteButton = component.find({ children: '×' }).at(1)
		deleteButton.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('QuestionBank component adds question', () => {
		const props = {
			element: {
				content: {},
				children: ['child1', 'child2'] // add children to test insertNode location
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValue(['mock-path'])
		const component = mount(<QuestionBank {...props} />)

		const addQuestionButton = component.find({ children: 'Add Question' }).at(1)
		addQuestionButton.simulate('click')

		// note at is testing that we're using findPath and concatnating with length of children
		// to place the new question at th end
		expect(Transforms.insertNodes).toHaveBeenCalledWith(
			{},
			{ type: 'Mock' },
			{ at: ['mock-path', 2] }
		)
	})

	test('QuestionBank component adds question bank', () => {
		const props = {
			element: {
				content: {},
				children: ['child1'] // add children to test insertNode location
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValue(['mock-path'])

		const component = mount(<QuestionBank {...props} />)
		const addQBButton = component.find({ children: 'Add Question Bank' }).at(1)
		addQBButton.simulate('click')

		// note at is testing that we're using findPath and concatnating with length of children
		// to place the new question at th end
		expect(Transforms.insertNodes).toHaveBeenCalledWith(
			{},
			expect.objectContaining({ type: 'ObojoboDraft.Chunks.QuestionBank' }),
			{ at: ['mock-path', 1] }
		)
	})

	test('QuestionBank component sets properties', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			editor: {},
			selected: true
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		const component = mount(<QuestionBank {...props} />)

		component.setProps({ selected: false })
		jest.runAllTimers()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('QuestionBank component adds questions', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		component.instance().importQuestionList([{}])
		expect(Transforms.insertNodes).toHaveBeenCalledWith({}, {}, { at: [0] })
	})

	test('QuestionBank component call getQuestionList', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		let root = {
			get: () => 'mock_type',
			children: []
		}
		expect(component.instance().getQuestionList(root)).toHaveLength(0)

		root = {
			get: () => 'mock_type',
			children: [
				{
					get: () => 'ObojoboDraft.Chunks.Question',
					children: []
				}
			]
		}
		expect(component.instance().getQuestionList(root)).toHaveLength(1)
	})

	test('QuestionBank component displays ImportQuestionModal', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])
		OboModel.getRoot.mockReturnValueOnce({
			get: () => 'ObojoboDraft.Chunks.Question',
			attributes: {}
		})
		Registry.getItemForType.mockReturnValueOnce({
			oboToSlate: () => {}
		})
		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		component.instance().displayImportQuestionModal()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('QuestionBank toggles collapsed status', () => {
		// intentionally leaving 'collapsed' undefined in element.content to simulate backwards compatibility
		const mockElement = {
			content: {},
			children: []
		}

		const props = {
			element: mockElement,
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}
		ReactEditor.findPath.mockReset()

		ReactEditor.findPath.mockReturnValue(['mock-path'])
		const component = renderer.create(<QuestionBank {...props} />)

		renderer.act(() => {
			component.root.findByProps({ className: 'collapse-button' }).props.onClick()
		})
		// when undefined, next state should be true
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { collapsed: true } },
			{ at: ['mock-path'] }
		)
		Transforms.setNodes.mockClear()
		// ordinarily this would be updated by the Slate code - here we do it manually
		// doing this without re-mounting/re-rendering works because it's passed by reference, not by value I guess
		mockElement.content.collapsed = true

		renderer.act(() => {
			component.root.findByProps({ className: 'collapse-button' }).props.onClick()
		})
		// when true, next state should be false
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { collapsed: false } },
			{ at: ['mock-path'] }
		)
		Transforms.setNodes.mockClear()
		mockElement.content.collapsed = false

		renderer.act(() => {
			component.root.findByProps({ className: 'collapse-button' }).props.onClick()
		})
		// when false, next state should be true
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: { collapsed: true } },
			{ at: ['mock-path'] }
		)
		Transforms.setNodes.mockClear()
	})

	test('QuestionBank indicates minimized children correctly when collapsed', () => {
		const mockElement = {
			content: { collapsed: true },
			children: []
		}

		const props = {
			element: mockElement,
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}
		let component = renderer.create(<QuestionBank {...props} />)

		// first case - no children
		// shouldn't be possible but also shouldn't crash and burn if it happens
		let collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary.length).toBe(1)
		// could clean up the render but leaving the falses in there is fine
		expect(collapsedSummary[0].props.children).toEqual([false, '', false, '\xa0(Click to Expand)']) // \xa0 is the non-breaking space character used here as &nbsp;

		// second case - single question
		renderer.act(() => {
			mockElement.children.push({ type: QUESTION_NODE })
			component = renderer.create(<QuestionBank {...props} />)
		})

		collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		// could also clean up the line break but leaving it there is fine
		expect(collapsedSummary[0].props.children).toEqual([
			'1 Question ',
			'',
			false,
			'\xa0(Click to Expand)'
		])

		// third case - multiple questions
		renderer.act(() => {
			mockElement.children.push({ type: QUESTION_NODE })
			component = renderer.create(<QuestionBank {...props} />)
		})
		collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary[0].props.children).toEqual([
			'2 Questions ',
			'',
			false,
			'\xa0(Click to Expand)'
		])

		// fourth case - multiple questions, single question bank
		renderer.act(() => {
			mockElement.children.push({ type: QUESTION_BANK_NODE })
			component = renderer.create(<QuestionBank {...props} />)
		})
		collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary[0].props.children).toEqual([
			'2 Questions ',
			'and ',
			'1 Question Bank ',
			'\xa0(Click to Expand)'
		])

		// fifth case - multiple questions, multiple question banks
		renderer.act(() => {
			mockElement.children.push({ type: QUESTION_BANK_NODE })
			component = renderer.create(<QuestionBank {...props} />)
		})
		collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary[0].props.children).toEqual([
			'2 Questions ',
			'and ',
			'2 Question Banks ',
			'\xa0(Click to Expand)'
		])

		// sixth case - no questions, single question bank
		renderer.act(() => {
			mockElement.children = [{ type: QUESTION_BANK_NODE }]
			component = renderer.create(<QuestionBank {...props} />)
		})
		collapsedSummary = component.root.findAllByProps({
			className: 'clickable-label collapsed-summary'
		})
		expect(collapsedSummary[0].props.children).toEqual([
			false,
			'',
			'1 Question Bank ',
			'\xa0(Click to Expand)'
		])
	})

	test('QuestionBank sets collapsed to true for all children', () => {
		const mockEditor = {}
		const props = {
			element: {
				content: { collapsed: false },
				children: [
					{ content: { mockProp: 'mockVal1' } },
					{ content: { mockProp: 'mockVal2' } },
					{ content: { mockProp: 'mockVal3' } }
				]
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: mockEditor
		}
		const component = renderer.create(<QuestionBank {...props} />)
		const targetButtonParent = component.root.findByProps({
			className: 'button-parent child-buttons'
		})
		const collapseAllButton = targetButtonParent.children[0]
		const expandAllButton = targetButtonParent.children[1]

		// checking each call is a bit overkill, but may as well be thorough
		expandAllButton.props.onClick()
		expect(Transforms.setNodes).toHaveBeenCalledTimes(3)
		expect(Transforms.setNodes.mock.calls[0]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal1', collapsed: false } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
		expect(Transforms.setNodes.mock.calls[1]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal2', collapsed: false } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
		expect(Transforms.setNodes.mock.calls[2]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal3', collapsed: false } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
		Transforms.setNodes.mockClear()

		collapseAllButton.props.onClick()
		expect(Transforms.setNodes).toHaveBeenCalledTimes(3)
		expect(Transforms.setNodes.mock.calls[0]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal1', collapsed: true } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
		expect(Transforms.setNodes.mock.calls[1]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal2', collapsed: true } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
		expect(Transforms.setNodes.mock.calls[2]).toEqual([
			mockEditor,
			{ content: { mockProp: 'mockVal3', collapsed: true } },
			{ at: 'mock-path' } // this is a bit magical: it's set up in the beforeEach
		])
	})
})
