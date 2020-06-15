import React from 'react'

import Question from './editor-registration'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: jest.fn(),
		contentTypes: ['ObojoboDraft.Chunks.Break']
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Question editor', () => {
	test('plugins.renderNode renders a question when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: QUESTION_NODE
			}
		}

		expect(Question.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a solution when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				subtype: SOLUTION_NODE
			}
		}

		expect(Question.plugins.renderNode(props)).toMatchSnapshot()
	})
})
