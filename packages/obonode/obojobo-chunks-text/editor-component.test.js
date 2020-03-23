import React from 'react'
import renderer from 'react-test-renderer'

import Text from './editor-component'

describe('Text Editor Node', () => {
	test('Text builds the expected component', () => {
		const component = renderer.create(
			<Text
				node={{
					data: {
						get: () => 0
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
