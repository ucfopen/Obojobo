import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { ReactEditor } from 'slate-react'
import MathEquation from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.useFakeTimers()

describe('MathEquation Editor Node', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.clearAllTimers()
	})

	test('renders with no latex', () => {
		const component = renderer.create(<MathEquation element={{ content: { latex: null } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with error', () => {
		global.window.katex.renderToString.mockImplementationOnce(() => {
			throw Error('Mock katex render error')
		})
		const component = renderer.create(<MathEquation element={{ content: { latex: 'x_0_0' } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with label', () => {
		const component = renderer.create(
			<MathEquation element={{ content: { latex: '1', label: '', size: 1 } }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits properties', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)

		// click to open
		component
			.find('button')
			.at(0)
			.simulate('click')

		component
			.find('#math-equation-latex')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mock math value' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		// click on size input, change, and blur
		component
			.find('#math-equation-size')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '10' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		// click on label and change
		component
			.find('#math-equation-label')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mockLabelValue' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		component
			.find('#math-equation-alt')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mockAltValue' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "alt": "mockAltValue",
		  "label": "mockLabelValue",
		  "latex": "mock math value",
		  "open": true,
		  "size": 10,
		}
	`)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component handles tabbing', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)
		component.find('button').simulate('keyDown', { key: 'k' })

		component.find('button').simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits properties', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		jest.runOnlyPendingTimers()
		component.find('button').simulate('keyDown', { key: 'k' })
		component.find('button').simulate('keyDown', { key: 'Tab' })
		jest.runOnlyPendingTimers()

		component
			.find('button')
			.at(0)
			.simulate('click')
		jest.runOnlyPendingTimers()
		component
			.find('input')
			.at(0)
			.simulate('keyDown', { key: 'k' })
		component
			.find('input')
			.at(0)
			.simulate('keyDown', { key: 'Tab', shiftKey: true })
		jest.runOnlyPendingTimers()

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component restricts minimum size to 0.1', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		component
			.find('#math-equation-size')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '-1' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		expect(component.state().size).toBe(0.1)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component restricts maximum size to 20', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		component
			.find('#math-equation-size')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '22' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		expect(component.state().size).toBe(20)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component sets blank values to 1', () => {
		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={{ toggleEditable: jest.fn() }}
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		component
			.find('#math-equation-size')
			.simulate('click', { stopPropagation: jest.fn() })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '' } })
			.simulate('blur', { stopPropagation: jest.fn() })

		expect(component.state().size).toBe(1)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component freezes and unfreezes editor', () => {
		const editor = {
			toggleEditable: jest.fn()
		}

		const component = mount(
			<MathEquation
				element={{
					content: { latex: '1', label: '1.1', size: 1 }
				}}
				selected={true}
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')
		component.find('#math-equation-label').simulate('focus')

		expect(editor.toggleEditable).toHaveBeenCalledWith(false)

		component.find('#math-equation-label').simulate('blur')
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.toggleEditable).toHaveBeenCalledWith(true)
	})

	test('MathEquation component calls setNode once edit dialog disappears', () => {
		const props = {
			editor: { toggleEditable: jest.fn() },
			element: { content: { latex: '2x/3', label: '1.1' } },
			selected: true
		}
		const component = mount(<MathEquation {...props} />)
		ReactEditor.findPath.mockReturnValueOnce('mock-path')

		expect(Transforms.setNodes).not.toHaveBeenCalled()

		component.setProps({ selected: false })

		expect(Transforms.setNodes).not.toHaveBeenCalled()
		jest.runAllTimers()

		expect(Transforms.setNodes).toHaveBeenCalledTimes(1)
		const [calledEditor, calledContent, calledAt] = Transforms.setNodes.mock.calls[0]
		expect(calledEditor).toBe(props.editor)
		expect(calledAt).toEqual({ at: 'mock-path' })
		expect(calledContent).toEqual({
			content: {
				alt: '',
				label: '1.1',
				latex: '2x/3',
				size: 1
			}
		})
	})

	test('More Info Box handles clicks', () => {
		const editor = {
			toggleEditable: jest.fn()
		}
		React.createRef = jest.fn()
		const component = mount(
			<MathEquation
				element={{ content: { latex: '2x/3', label: '1.1' } }}
				selected={true}
				editor={editor}
			/>
		)

		const nodeInstance = component.instance()
		nodeInstance.node = {
			current: {
				contains: value => value
			}
		}

		nodeInstance.handleClick({ target: true }) // click inside
		let tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node.current = { contains: value => value }
		nodeInstance.handleClick({ target: false }) // click outside
		tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node.current = null
		nodeInstance.handleClick() // click without node
		tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
