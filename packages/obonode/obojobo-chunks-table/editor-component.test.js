import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Table from './editor-component'

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Table Editor Node', () => {
	test('Table component', () => {
		const component = renderer.create(
			<Table
				node={{
					data: {
						get: () => {
							return { textGroup: { textGroup: [] } }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Table
				node={{
					data: {
						get: () => {
							return { textGroup: { numCols: 1 } }
						}
					},
					nodes: {
						get: () => {
							return {
								data: {
									get: () => ({
										header: true
									})
								},
								key: 'topRow',
								nodes: [
									{
										key: 'mockCell'
									}
								]
							}
						}
					}
				}}
				editor={editor}
				isSelected
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
