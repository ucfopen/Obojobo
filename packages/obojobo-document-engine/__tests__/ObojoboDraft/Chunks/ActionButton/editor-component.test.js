/* eslint-disable no-undefined */
import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ActionButton from 'ObojoboDraft/Chunks/ActionButton/editor-component'

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

	test('ActionButton with changing label', () => {
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

		const component = shallow(
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
			.find('input')
			.at(0)
			.simulate('click', { stopPropagation: () => true })

		component
			.find('input')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'mockLabel'
				}
			})

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledWith(undefined, {
			data: {
				content: {
					actions: [
						{
							type: 'mockType',
							value: 'mockValue'
						}
					],
					label: 'mockLabel'
				}
			}
		})
	})

	test('ActionButton with changing new action type', () => {
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

		const component = shallow(
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
			.find('select')
			.at(0)
			.simulate('click', { stopPropagation: () => true })

		component
			.find('select')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'mockNewType'
				}
			})

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton with changing new action type', () => {
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

		const component = shallow(
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
			.find('textarea')
			.at(0)
			.simulate('click', { stopPropagation: () => true })

		component
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'mockNewType'
				}
			})

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds nav:goto', () => {
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

		const component = shallow(
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
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{ "id": "mockId" }'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds nav:openExternalLink', () => {
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

		const component = shallow(
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
			.find('select')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'nav:openExternalLink'
				}
			})

		component
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{ "url": "mockURL" }'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds assessment:startAttempt', () => {
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

		const component = shallow(
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
			.find('select')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'assessment:startAttempt'
				}
			})

		component
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{ "id": "mockId" }'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds assessment:endAttempt', () => {
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

		const component = shallow(
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
			.find('select')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'assessment:endAttempt'
				}
			})

		component
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{ "id": "mockId" }'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton adds viewer:alert', () => {
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

		const component = shallow(
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
			.find('select')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: 'viewer:alert'
				}
			})

		component
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{ "title": "mockTitle", "message": "mockMessage" }'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton deletes a trigger', () => {
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

	test('ActionButton fails to add new action', () => {
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

		const component = shallow(
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
			.find('textarea')
			.at(0)
			.simulate('change', {
				stopPropagation: () => true,
				target: {
					value: '{}'
				}
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})
})
