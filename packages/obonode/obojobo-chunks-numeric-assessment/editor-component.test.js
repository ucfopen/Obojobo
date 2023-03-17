import React from 'react'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'

import NumericAssessment from './editor-component'

jest.mock('slate-react', () => ({
	ReactEditor: { findPath: jest.fn().mockReturnValue('mock-path') }
}))
jest.mock('slate', () => ({
	Editor: {
		withoutNormalizing: (editor, cb) => {
			cb()
		},
		nodes: jest.fn()
	},
	Transforms: {
		insertNodes: jest.fn()
	}
}))
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('NumericAssessment Editor Node', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('NumericAssessment renders as expected', () => {
		const props = {
			editor: {},
			element: {
				questionType: 'mock-question-type',
				children: []
			}
		}
		const component = renderer.create(<NumericAssessment {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		expect(component.root.children[0].props.className).toEqual(
			'component obojobo-draft--chunks--numeric-assessment is-type-mock-question-type'
		)
	})

	test('NumericAssessment renders as expected (no questionType)', () => {
		const props = {
			editor: {},
			element: {
				children: []
			}
		}
		const component = renderer.create(<NumericAssessment {...props} />)
		expect(component.root.children[0].props.className).toEqual(
			'component obojobo-draft--chunks--numeric-assessment is-type-default'
		)
	})

	test('Button adds an answer choice', () => {
		const props = {
			editor: {},
			element: {
				questionType: 'mock-question-type',
				children: []
			}
		}
		const component = renderer.create(<NumericAssessment {...props} />)
		expect(Transforms.insertNodes).not.toHaveBeenCalled()

		component.root.findByType('button').props.onClick()

		expect(Transforms.insertNodes).toHaveBeenCalledTimes(1)
	})
})
