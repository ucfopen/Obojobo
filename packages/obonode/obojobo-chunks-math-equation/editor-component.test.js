import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MathEquation from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component', () => (
	props => <div>{props.children}</div>
))

describe('MathEquation Editor Node', () => {
	test('renders with no latex', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: null }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with error', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: 'x_0_0' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with label', () => {
		const component = renderer.create(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '', size: 1 }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component edits properties', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '1.1' }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		component
			.find('input')
			.at(0)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(1)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(2)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(3)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(1)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'mockValue'} })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changeProperties edits properties', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MathEquation
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '', size: 1 }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
