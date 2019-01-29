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
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component adds row', () => {
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2) // Need to skip an extra button for the extra column
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Table component adds col', () => {
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
