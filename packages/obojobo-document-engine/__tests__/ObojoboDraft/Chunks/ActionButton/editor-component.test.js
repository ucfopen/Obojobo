/* eslint-disable no-undefined */
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ActionButton from 'ObojoboDraft/Chunks/ActionButton/editor-component'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton Editor Node', () => {
	test('ActionButton builds the expected component', () => {
		const nodeData = {
			type: BUTTON_NODE,
			data: {
				get: () => {
					return {}
				}
			}
		}
		const component = renderer.create(<ActionButton node={nodeData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton builds the expected component when selected', () => {
		const nodeData = {
			data: {
				get: () => {
					return {
						actions: [
							{
								type: 'mockType',
								value: 'mockValue'
							}
						]
					}
				}
			}
		}
		const component = renderer.create(
			<ActionButton node={nodeData} isSelected={true} isFocused={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds action', () => {
		const nodeData = {
			data: {
				get: () => {
					return {
						actions: [
							{
								type: 'mockType',
								value: 'mockValue'
							}
						]
					}
				}
			}
		}
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<ActionButton
				node={nodeData}
				isSelected={true}
				isFocused={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		//expect(tree).toEqual(false)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('ActionButton deletes an action', () => {
		const nodeData = {
			data: {
				get: () => {
					return {
						actions: [
							{
								type: 'mockType',
								value: 'mockValue'
							}
						]
					}
				}
			}
		}
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<ActionButton
				node={nodeData}
				isSelected={true}
				isFocused={true}
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

		expect(tree).toMatchSnapshot()
	})

	test('changeProperties sets the nodes content', () => {
		const nodeData = {
			data: {
				get: () => {
					return {
						actions: [
							{
								type: 'mockType',
								value: 'mockValue'
							}
						]
					}
				}
			}
		}

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<ActionButton
				node={nodeData}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component.instance().addAction({ mockProperties: 'mock value' })

		expect(ModalUtil.hide).toHaveBeenCalled()
	})
})
