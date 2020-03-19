import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

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
	test('renders with no latex', () => {
		const component = renderer.create(<MathEquation element={{ content: { latex: null } }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with error', () => {
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
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		component.find({ id: 'math-equation-latex' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-label' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-alt' }).simulate('click', { stopPropagation: jest.fn() })
		component.find({ id: 'math-equation-size' }).simulate('click', { stopPropagation: jest.fn() })
		component
			.find({ id: 'math-equation-label' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mockValue' } })

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
		component.find({ id: 'math-equation-label' }).simulate('focus')

		expect(editor.toggleEditable).toHaveBeenCalledWith(false)

		component.find({ id: 'math-equation-label' }).simulate('blur')
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.toggleEditable).toHaveBeenCalledWith(true)
	})

	test('MathEquation component calls setNodeByKey once edit dialog disappears', () => {
		const component = mount(
			<MathEquation element={{ content: { latex: '2x/3', label: '1.1' } }} selected={true} />
		)

		expect(Transforms.setNodes).not.toHaveBeenCalled()

		component.setProps({ selected: false })

		expect(Transforms.setNodes).not.toHaveBeenCalled()
		jest.runAllTimers()
		expect(Transforms.setNodes).toHaveBeenCalledTimes(1)
		expect(Transforms.setNodes.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  undefined,
		  Object {
		    "content": Object {
		      "alt": "",
		      "label": "1.1",
		      "latex": "2x/3",
		      "size": 1,
		    },
		  },
		  Object {
		    "at": undefined,
		  },
		]
	`)
	})

	test.skip('MathEquation focuses on the first input when the edit dialog appears', () => {
		const mockFocus = jest.fn()
		const spy = jest.spyOn(document, 'getElementById').mockReturnValue({
			focus: mockFocus
		})

		const component = mount(
			<MathEquation element={{ content: { latex: '2x/3', label: '1.1' } }} selected={false} />
		)

		expect(mockFocus).not.toHaveBeenCalled()

		component.setProps({ selected: true })

		expect(mockFocus).not.toHaveBeenCalled()
		jest.runAllTimers()
		expect(mockFocus).toHaveBeenCalled()

		spy.mockRestore()
	})
})
