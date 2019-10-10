import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import NumericFeedback from './editor-component'

describe('NumericFeedback Editor Node', () => {
	test('NumericFeedback builds the expected component', () => {
		const component = renderer.create(
			<NumericFeedback
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

	test('NumericFeedback component deletes itself', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<NumericFeedback
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
