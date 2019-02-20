import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Solution from 'ObojoboDraft/Chunks/Question/components/solution/editor-component'

describe('Solution Editor Node', () => {
	test('Solution component', () => {
		const component = renderer.create(<Solution />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Solution component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Solution
				node={{
					data: {
						get: () => null
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
