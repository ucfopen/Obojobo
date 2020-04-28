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
jest.mock('slate-react', () => ({ ReactEditor: { findPath: jest.fn() } }))

describe('List Editor Node', () => {
	test('List component', () => {
		const component = renderer.create(
			<List editor={{}} element={{ content: { listStyles: {} } }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('List component when selected', () => {
		const spy = jest.spyOn(List.prototype, 'isOnlyThisNodeSelected').mockReturnValue(true)
		const component = renderer.create(
			<List editor={{}} selected={true} element={{ content: { listStyles: {} } }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		spy.mockRestore()
	})
})
