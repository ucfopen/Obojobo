import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import YouTube from 'ObojoboDraft/Chunks/YouTube/editor-component'

describe('YouTube Editor Node', () => {
	test('YouTube builds the expected component', () => {
		const component = renderer.create(
			<YouTube
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

	test('YouTube component changes input', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<YouTube
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.find('input').simulate('click', {
			stopPropagation: () => true
		})

		component.find('input').simulate('change', {
			target: { value: 'mockInput' }
		})

		expect(tree).toMatchSnapshot()
	})
})
