import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/editor-component'

describe('IFrame Editor Node', () => {
	test('IFrame component', () => {
		const component = renderer.create(
			<IFrame
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

	test('IFrame component edits input', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={editor}
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
