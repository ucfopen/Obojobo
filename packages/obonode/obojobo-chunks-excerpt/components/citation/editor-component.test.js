import Citation from './editor-component'
import renderer from 'react-test-renderer'
import React from 'react'

describe('Citation Node', () => {
	test('Node builds the expected component', () => {
		const Child = () => <div>Child component</div>

		const component = renderer.create(
			<Citation>
				<Child />
				<Child />
				<Child />
			</Citation>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
