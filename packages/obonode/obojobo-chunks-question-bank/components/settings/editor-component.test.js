import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Settings from './editor-component'

describe('Settings Editor Node', () => {
	test('Settings builds the expected component', () => {
		const component = renderer.create(
			<Settings
				node={{
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
					data: {
						get: () => {
							return { chooseAll: false }
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('input')
			.at(1)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'pick' } })

		component
			.find('input')
			.at(2)
			.simulate('click', { stopPropagation: jest.fn(), target: { value: 11 } })
		component
			.find('input')
			.at(2)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 11 } })

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('Settings changes the select type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Settings
				node={{
					data: {
						get: () => {
							return { chooseAll: false }
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('select')
			.at(0)
			.simulate('click', { stopPropagation: jest.fn(), target: { value: 'random' } })
		component
			.find('select')
			.at(0)
			.simulate('change', { stopPropagation: jest.fn(), target: { value: 'random' } })

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(1)
	})
})
