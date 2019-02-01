import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import IFrame from 'ObojoboDraft/Chunks/IFrame/editor-component'

describe('IFrame Editor Node', () => {
	test('IFrame component', () => {
		const component = renderer.create(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: ''})
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('IFrame component changes input', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: ''})
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

		component
			.find('input')
			.at(0)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})
})
