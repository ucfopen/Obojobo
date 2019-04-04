import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Row from './editor-component'

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
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
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
			}
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
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

	test('Row component deletes itself', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
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
			}
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
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

	test('Row component deletes itself and passes header status to sibling', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
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
			}
		}

		const component = shallow(
			<Row
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
