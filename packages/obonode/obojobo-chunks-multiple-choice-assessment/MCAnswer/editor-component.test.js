import React from 'react'
import renderer from 'react-test-renderer'

import MCAnswer from './editor-component'

describe('MCAnswer Editor Node', () => {
	test('MCAnswer builds the expected component', () => {
		const component = renderer.create(
			<MCAnswer
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
