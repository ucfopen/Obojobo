import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import NumericFeedback from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	components: {
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))

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

		component.find('Button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
