import React from 'react'
import renderer from 'react-test-renderer'

import Level from 'ObojoboDraft/Chunks/List/components/level/editor-component'

describe('List editor', () => {
	test('Level component', () => {
		const component = renderer.create(
			<Level
				node={{
					data: {
						get: () => {
							return { bulletStyle: 'square', type: 'unordered' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Level component ordered', () => {
		const component = renderer.create(
			<Level
				node={{
					data: {
						get: () => {
							return { bulletStyle: 'alpha', type: 'ordered' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
