/* eslint-disable no-undefined */

import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Settings from './editor-component'

jest.useFakeTimers()

describe('Question Bank Settings Editor Node', () => {
	test('Settings builds the expected component', () => {
		const component = renderer.create(
			<Settings
				node={{
					key: 'mock-id',
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Settings changes the number of displayed questions', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Settings
				node={{
					key: 'mock-id',
					data: {
						get: () => {
							return { chooseAll: false, choose: '1' }
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find({ type: 'radio', value: 'pick' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'pick' } })

		component
			.find({ type: 'number' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 11 } })

		jest.runAllTimers()

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('Clicking on choose number input changes data to numeric values', () => {
		let nodeData = { chooseAll: true, choose: '99' }

		const editor = {
			setNodeByKey: (key, newNodeData) => {
				nodeData = newNodeData.data.content
			}
		}

		const component = mount(
			<Settings
				node={{
					key: 'mock-id',
					data: {
						get: () => {
							return nodeData
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find({ type: 'radio', value: 'pick' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'pick' } })

		jest.runAllTimers()
		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '99'
		})

		component
			.find({ type: 'number' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '99' } })

		jest.runAllTimers()
		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '99'
		})
	})

	test('Clicking on All input changes choose to default of "1"', () => {
		let nodeData = { chooseAll: false, choose: '99' }

		const editor = {
			setNodeByKey: (key, newNodeData) => {
				nodeData = newNodeData.data.content
			}
		}

		const component = mount(
			<Settings
				node={{
					key: 'mock-id',
					data: {
						get: () => {
							return nodeData
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find({ type: 'radio', value: 'all' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'all' } })

		jest.runAllTimers()
		expect(nodeData).toEqual({
			chooseAll: true,
			choose: '1'
		})
	})

	test('Blurring off the numeric input validates the input', () => {
		let nodeData = { chooseAll: false, choose: '-100.5' }

		const editor = {
			setNodeByKey: (key, newNodeData) => {
				nodeData = newNodeData.data.content
			}
		}

		const component = mount(
			<Settings
				node={{
					key: 'mock-id',
					data: {
						get: () => {
							return nodeData
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find({ type: 'number' })
			.simulate('focus', { stopPropagation: jest.fn(), target: { value: '-100.5' } })

		jest.runAllTimers()
		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '-100.5'
		})

		component
			.find('input')
			.at(2)
			.simulate('blur', { stopPropagation: jest.fn(), target: { value: '-100.5' } })

		jest.runAllTimers()
		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '1'
		})
	})

	test.each`
		choose       | correctedValue
		${1}         | ${'1'}
		${'1.1'}     | ${'1'}
		${'0'}       | ${'1'}
		${'-12.5'}   | ${'1'}
		${'2'}       | ${'2'}
		${NaN}       | ${'1'}
		${null}      | ${'1'}
		${false}     | ${'1'}
		${true}      | ${'1'}
		${undefined} | ${'1'}
		${''}        | ${'1'}
	`(
		'validateAndUpdateChooseAmount ensures choose value is valid ($choose => $correctedValue)',
		({ choose, correctedValue }) => {
			const mockSetState = jest.fn()

			Settings.prototype.validateAndUpdateChooseAmount.bind(
				{
					props: {
						node: {
							data: {
								get: () => ({
									choose
								})
							}
						}
					},
					setState: mockSetState
				},
				{ stopPropagation: jest.fn() }
			)()

			jest.runAllTimers()
			expect(mockSetState).toHaveBeenCalledTimes(1)
			expect(mockSetState).toHaveBeenCalledWith({ choose: correctedValue })
		}
	)

	test('Settings changes the select type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Settings
				node={{
					data: {
						key: 'mock-id',
						get: () => {
							return { chooseAll: false }
						}
					}
				}}
				editor={editor}
			/>
		)

		const select = component.find('select').at(0)

		select.simulate('click', { stopPropagation: jest.fn(), target: { value: 'random' } })
		select.simulate('change', { stopPropagation: jest.fn(), target: { value: 'random' } })

		jest.runAllTimers()
		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})
})
