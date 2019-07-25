import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MathEquation from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('MathEquation Editor Node', () => {
	test('MathEquation component', () => {
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
							return { latex: '1', label: '1.1', size: 1 }
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
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
