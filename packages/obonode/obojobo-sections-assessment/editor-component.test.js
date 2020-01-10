import React from 'react'
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
})
