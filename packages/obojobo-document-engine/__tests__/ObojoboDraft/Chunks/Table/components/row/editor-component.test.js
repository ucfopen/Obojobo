import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Row from 'ObojoboDraft/Chunks/Table/components/row/editor-component'

describe('Row Editor Node', () => {
	test('Row component', () => {
		const component = renderer.create(
			<Row
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Row component deletes itself and its table', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									data: {
										get: () => {
											return {
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: num => {
											if (num === 1) return null
											return {
												key: 'thisRow'
											}
										}
									}
								}
							}
						}
					},
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

	test('Row component deletes itself', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									data: {
										get: () => {
											return {
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: () => {
											return {
												key: 'notThisRow'
											}
										}
									}
								}
							}
						}
					},
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

	test('Row component deletes itself and passes header status to sibling', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									// parent
									data: {
										get: () => {
											return {
												header: true,
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: () => {
											return {
												key: 'thisRow',
												nodes: [
													{
														key: 'siblingCell'
													}
												]
											}
										}
									}
								}
							}
						}
					},
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
