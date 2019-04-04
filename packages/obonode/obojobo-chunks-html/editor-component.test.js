import React from 'react'
import renderer from 'react-test-renderer'

import HTML from './editor-component'

describe('HTML Editor Node', () => {
	test('HTML builds the expected component', () => {
		const component = renderer.create(
			<HTML
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
