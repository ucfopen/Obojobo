import React from 'react'
import renderer from 'react-test-renderer'
import ModList from './mod-list'

describe('ModList', () => {
	test('renders as expected', () => {
		const component = renderer.create(
			<ModList
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

	test('ModList component', () => {
		const component = renderer.create(
			<ModList
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
