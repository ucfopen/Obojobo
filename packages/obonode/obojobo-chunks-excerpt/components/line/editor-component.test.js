import Line from './editor-component'
import renderer from 'react-test-renderer'
import React from 'react'

describe('Citation Node', () => {
	test('Node builds the expected component', () => {
		const Child = () => <div>Child component</div>

		const element = {
			content: {
				align: 'center',
				indent: 0,
				hangingIndent: 0
			}
		}

		const component = renderer.create(
			<Line element={element}>
				<Child />
				<Child />
				<Child />
			</Line>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
