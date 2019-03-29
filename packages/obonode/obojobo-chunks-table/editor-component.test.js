import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Table from './editor-component'

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

	test('Table component removes col', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Table
				node={{
					data: {
						get: () => {
							return { textGroup: { textGroup: [], numCols: 1 } }
						}
					},
					nodes: [
						{
							nodes: {
								get: () => {
									return {
										key: 'deletedCell'
									}
								}
							}
						}
					]
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component adds row', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = shallow(
			<Table
				node={{
					data: {
						get: () => {
							return { textGroup: { numRows: 1, numCols: 2 } }
						}
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2) // Need to skip an extra button for the extra column
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
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
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component adds col', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = shallow(
			<Table
				node={{
					data: {
						get: () => {
							return { textGroup: { numCols: 1 } }
						}
					},
					nodes: [
						{
							data: {
								get: () => {
									return {
										header: true
									}
								}
							}
						}
					]
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
