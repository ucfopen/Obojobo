import React from 'react'
import renderer from 'react-test-renderer'

import Code from 'ObojoboDraft/Chunks/Code/editor-component'

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
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
