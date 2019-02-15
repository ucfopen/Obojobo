import React from 'react'
import renderer from 'react-test-renderer'

import Settings from 'ObojoboDraft/Chunks/MCAssessment/components/settings/editor-component'

describe('Settings Editor Node', () => {
	test('Settings builds the expected component', () => {
		const component = renderer.create(
			<Settings
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
