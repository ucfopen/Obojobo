import React from 'react'
import renderer from 'react-test-renderer'

import Code from './editor-component'

jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Code Editor Node', () => {
	test('Code builds the expected component', () => {
		const component = renderer.create(
			<Code node={{ content:{} }}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
