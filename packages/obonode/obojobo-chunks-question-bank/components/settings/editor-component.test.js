/* eslint-disable no-undefined */

import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Settings from './editor-component'

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

		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '99'
		})

		component
			.find({ type: 'number' })
			.simulate('change', { stopPropagation: jest.fn(), target: { value: '99' } })

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

		expect(nodeData).toEqual({
			chooseAll: true,
			choose: '1'
		})
	})

	test('Blurring off the numeric input validates the input', () => {
		let nodeData = { chooseAll: false, choose: '-100.5', select: 'sequential' }

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

		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '-100.5',
			select: 'sequential'
		})

		component
			.find('input')
			.at(2)
			.simulate('blur', { stopPropagation: jest.fn(), target: { value: '-100.5' } })

		expect(nodeData).toEqual({
			chooseAll: false,
			choose: '1',
			select: 'sequential'
		})
	})

	test.each`
		choose       | correctedValue
		${1}         | ${'1'}
		${'1.1'}     | ${'1'}
		${'0'}       | ${'1'}
		${'-12.5'}   | ${'1'}
		${NaN}       | ${'1'}
		${null}      | ${'1'}
		${false}     | ${'1'}
		${true}      | ${'1'}
		${undefined} | ${'1'}
		${''}        | ${'1'}
	`(
		'validateAndUpdateChooseAmount ensures choose value is valid ($choose => $correctedValue)',
		({ choose, correctedValue }) => {
			const mockSetStateAndUpdateNode = jest.fn()

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
					setStateAndUpdateNode: mockSetStateAndUpdateNode,
					state: {
						choose
					}
				},
				{ stopPropagation: jest.fn() }
			)()

			expect(mockSetStateAndUpdateNode).toHaveBeenCalledTimes(1)
			expect(mockSetStateAndUpdateNode).toHaveBeenCalledWith({ choose: correctedValue })
		}
	)

	test('validateAndUpdateChooseAmount skips updates when choose value does not change', () => {
		const mockSetStateAndUpdateNode = jest.fn()

		Settings.prototype.validateAndUpdateChooseAmount.bind(
			{
				props: {
					node: {
						data: {
							get: () => ({
								choose: '55'
							})
						}
					}
				},
				setStateAndUpdateNode: mockSetStateAndUpdateNode,
				state: {
					choose: '55'
				}
			},
			{ stopPropagation: jest.fn() }
		)()

		expect(mockSetStateAndUpdateNode).toHaveBeenCalledTimes(0)
	})

	test('changeSelect skips updates when select value does not change', () => {
		const mockSetStateAndUpdateNode = jest.fn()

		Settings.prototype.changeSelect.bind(
			{
				setStateAndUpdateNode: mockSetStateAndUpdateNode,
				state: {
					select: 'random'
				}
			},
			{
				target: {
					value: 'random' // event value matche current state value
				},
				stopPropagation: jest.fn()
			}
		)()

		expect(mockSetStateAndUpdateNode).toHaveBeenCalledTimes(0)
	})

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

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})

	test('setNodeContent skips updating editor node when theres no changes', () => {
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

		// changes to state will cause setNodeContent to call setNodeByKey
		component.instance().setState({ chooseAll: true }) // set state to NOT match node.data.get
		component.instance().setNodeContent()
		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)

		// when state hasn't changed, it shouldnt
		component.instance().setState({ chooseAll: false }) // set state to match node.data.get
		component.instance().setNodeContent()
		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})
})
