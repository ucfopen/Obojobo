import React from 'react'
import renderer from 'react-test-renderer'

import List from './editor-component'

describe('List Editor Node', () => {
	test('List component', () => {
		const component = renderer.create(
			<List
				node={{
					data: {
						get: () => {
							return { listStyles: {} }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
