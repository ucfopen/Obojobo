import React from 'react'
import renderer from 'react-test-renderer'

import Heading from './editor-component'

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Heading Editor Node', () => {
	test('Heading component', () => {
		const component = renderer.create(
			<Heading
				node={{
					data: {
						get: () => ({})
					},
					text: ''
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
