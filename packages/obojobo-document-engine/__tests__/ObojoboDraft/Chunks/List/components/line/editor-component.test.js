import React from 'react'
import renderer from 'react-test-renderer'

import Line from 'ObojoboDraft/Chunks/List/components/line/editor-component'

describe('Line Editor Node', () => {
	test('Line component', () => {
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
