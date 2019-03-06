import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import MCFeedback from 'ObojoboDraft/Chunks/MCAssessment/MCFeedback/editor-component'

describe('MCFeedback Editor Node', () => {
	test('MCFeedback builds the expected component', () => {
		const component = renderer.create(
			<MCFeedback
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

	test('MCFeedback component deletes itself', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<MCFeedback
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
