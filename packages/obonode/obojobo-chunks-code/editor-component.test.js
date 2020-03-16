import React from 'react'
import renderer from 'react-test-renderer'

import Code from './editor-component'

describe('Code Editor Node', () => {
	test('Code builds the expected component', () => {
		const component = renderer.create(
			<Code
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
