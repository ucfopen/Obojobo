import React from 'react'
import renderer from 'react-test-renderer'

import Line from './editor-component'

describe('Line Editor Node', () => {
	test('Line builds the expected component', () => {
		var counter = 0;

		const mockDataGetter = jest.fn().mockImplementation(
			() => {
				switch(mockDataGetter.mock.calls[counter++][0]) {
					case "align":
						return "center"
					case "indent":
						return "0"
					case "hangingIndent":
						return "false"
					default:
						return "test"
				}
			}
		)

		const component = renderer.create(
			<Line
				node={{
					data: {
						get: mockDataGetter
					}
				}}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
