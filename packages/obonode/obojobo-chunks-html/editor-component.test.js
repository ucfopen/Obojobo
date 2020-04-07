import React from 'react'
import renderer from 'react-test-renderer'

import HTML from './editor-component'

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

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
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
