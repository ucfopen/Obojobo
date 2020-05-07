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
jest.mock('slate', () => ({
	Editor: {
		withoutNormalizing: (editor, cb) => {
			cb()
		},
		nodes: jest.fn()
	},
	Transforms: {
		setNodes: jest.fn()
	}
}))

describe('List Editor Node', () => {
	test('List component when not selected', () => {
		const props = {
			selected: false,
			editor: {},
			element: {
				content: {
					listStyles: {}
				}
			}
		}
		const component = renderer.create(<List {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
