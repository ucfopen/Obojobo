import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import List from 'ObojoboDraft/Chunks/List/editor-component'

describe('List Editor Node', () => {
	test('List component', () => {
		const component = renderer.create(
			<List
				node={{
					data: {
						get: () => {
							return { listStyles: {} }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('List component toggles type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<List
				node={{
					data: {
						get: () => {
							return { listStyles: { type: 'ordered' } }
						}
					},
					filterDescendants: funct => {
						funct({ type: 'mockType' })
						return [
							{
								data: {
									get: () => {
										return {}
									}
								}
							}
						]
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('List component toggles type from unordered to ordered', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<List
				node={{
					data: {
						get: () => {
							return { listStyles: { type: 'unordered' } }
						}
					},
					filterDescendants: funct => {
						funct({ type: 'mockType' })
						return [
							{
								data: {
									get: () => {
										return {}
									}
								}
							}
						]
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
	})
})
