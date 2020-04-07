import React from 'react'
import renderer from 'react-test-renderer'

import List from './editor-component'

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('List Editor Node', () => {
	test('List component', () => {
		const component = renderer.create(
			<List
				node={{
					data: {
						get: () => {
							return { listStyles: {} }
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
				element={{ content: { listStyles: {} } }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
