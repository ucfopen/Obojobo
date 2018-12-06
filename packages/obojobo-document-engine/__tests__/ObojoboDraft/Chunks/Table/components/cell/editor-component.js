import React from 'react'
import renderer from 'react-test-renderer'

import Cell from 'ObojoboDraft/Chunks/Table/components/cell/editor-component'

describe('Cell Editor Node', () => {
	test('Cell component', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as header', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: true }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
