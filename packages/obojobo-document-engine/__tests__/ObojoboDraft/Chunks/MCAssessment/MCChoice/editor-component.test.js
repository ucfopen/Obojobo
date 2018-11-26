import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MCChoice from 'ObojoboDraft/Chunks/MCAssessment/MCChoice/editor-component'

describe('MCChoice Editor Node', () => {
	test('MCChoice component', () => {
		const component = renderer.create(
			<MCChoice
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: []
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component correct choice', () => {
		const component = renderer.create(
			<MCChoice
				node={{
					data: {
						get: () => {
							return { score: 100 }
						}
					},
					nodes: { size: 2 }
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component deletes itself', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
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
			.at(0)
			.simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component changes score', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => ({
							score: 0
						})
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 100 } }
		})

		const component2 = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 100
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

		component2
			.find('button')
			.at(1)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 0 } }
		})
	})

	test('MCChoice component adds feedback', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<MCChoice
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
