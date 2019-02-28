import React from 'react'
import renderer from 'react-test-renderer'

import MCAssessment from './editor-component'

describe('MCAssessment Editor Node', () => {
	test('MCAssessment builds the expected component', () => {
		const component = renderer.create(
			<MCAssessment
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
