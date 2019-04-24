import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Assessment from './editor-component'

describe('Assessment editor', () => {
	test('Node component', () => {
		const component = renderer.create(
			<Assessment
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: {
						size: 5
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component adds child', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Assessment
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})
})
