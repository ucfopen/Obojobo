import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Table from './editor-component'

import { Transforms, Node } from 'slate'
import { ReactEditor } from 'slate-react'

jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('Table Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})

	test('Table component', () => {
		const component = renderer.create(<Table element={{ content: { display: 'fixed' } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, display: 'fixed' },
					children: [{ content: {} }]
				}}
			/>
		)

		Node.children.mockReturnValue([[{ content: {} }, [0]]])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Table component toggles fixed width cells', () => {
		const spy = jest.spyOn(ReactEditor, 'findPath').mockReturnValue([0])

		const editor = jest.fn()
		const component = mount(
			<Table
				selected={true}
				editor={editor}
				element={{
					content: { header: true, display: 'auto' },
					children: [{ content: {} }]
				}}
			/>
		)

		Node.children.mockReturnValue([[{ content: {} }, [0]]])

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ content: { header: true, display: 'fixed' } },
			{ at: [0] }
		)

		spy.mockRestore()
	})

	test('Table component toggles auto width cells', () => {
		const spy = jest.spyOn(ReactEditor, 'findPath').mockReturnValue([0])

		const editor = jest.fn()
		const component = mount(
			<Table
				selected={true}
				editor={editor}
				element={{
					content: { header: true, display: 'fixed' },
					children: [{ content: {} }]
				}}
			/>
		)

		Node.children.mockReturnValue([[{ content: {} }, [0]]])

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ content: { header: true, display: 'auto' } },
			{ at: [0] }
		)

		spy.mockRestore()
	})

	test('Table component has correct className with flexible-width cells', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, display: 'auto' },
					children: [{ content: {} }]
				}}
			/>
		)

		expect(component.find('table').hasClass('is-display-type-auto')).toBe(true)
	})

	test('Table component has correct className with fixed-width cells', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, display: 'fixed' },
					children: [{ content: {} }]
				}}
			/>
		)

		expect(component.find('table').hasClass('view')).toBe(true)
	})

	test('Table component handles tabbing', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, display: 'fixed' },
					children: [{ content: {} }]
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('returnFocusOnTab calls focus', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Table {...props} />)

		const event = { key: 'Tab', shiftKey: false, preventDefault: jest.fn() }
		component.instance().returnFocusOnTab(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(ReactEditor.focus).toHaveBeenCalledWith(props.editor)
	})

	test('returnFocusOnTab ignores other keys', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Table {...props} />)

		const event = { key: 'f', shiftKey: false, preventDefault: jest.fn() }
		component.instance().returnFocusOnTab(event)

		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(ReactEditor.focus).not.toHaveBeenCalled()
	})
})
