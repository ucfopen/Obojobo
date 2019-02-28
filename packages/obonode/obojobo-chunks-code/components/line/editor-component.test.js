import React from 'react'
import renderer from 'react-test-renderer'

import Line from './editor-component'

describe('Line Editor Node', () => {
	test('Line builds the expected component', () => {
		const component = renderer.create(
			<Line
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
})
