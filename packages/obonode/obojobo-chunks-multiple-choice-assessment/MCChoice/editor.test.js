import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import MCChoice from './editor'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

describe('MCChoice editor', () => {
	test('plugins.renderNode renders a choice', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCCHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCChoice.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: MCFEEDBACK_NODE },
			index: 1
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes too many children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 3
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes extra children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: 'wrongType' },
			index: 1
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
