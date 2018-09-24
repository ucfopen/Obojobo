import React from 'react'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Page from '../../../../ObojoboDraft/Pages/Page/editor'
jest.mock('../../../../ObojoboDraft/Chunks/ActionButton/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Break/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Code/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Figure/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Heading/editor')
jest.mock('../../../../ObojoboDraft/Chunks/IFrame/editor')
jest.mock('../../../../ObojoboDraft/Chunks/List/editor')
jest.mock('../../../../ObojoboDraft/Chunks/MathEquation/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Table/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Text/editor')
jest.mock('../../../../ObojoboDraft/Chunks/YouTube/editor')
jest.mock('../../../../ObojoboDraft/Chunks/QuestionBank/editor')
jest.mock('../../../../ObojoboDraft/Chunks/Question/editor')
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/editor')
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/editor')
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/editor')
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/editor')

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Page', () => {
	test('Node builds the expected component', () => {
		const Node = Page.components.Node
		const component = renderer.create(
			<Node attributes={{ dummy: 'dummyData' }}  />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: { get: () => null },
			nodes: [
				{
					type: 'ObojoboDraft.Chunks.Break'
				},
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const oboNode = Page.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			nodes: [
				{
					type: 'ObojoboDraft.Chunks.Break'
				},
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const oboNode = Page.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: 'ObojoboDraft.Chunks.Break'
				},
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const slateNode = Page.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Page.plugins.schema.blocks[PAGE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Page.plugins.schema.blocks[PAGE_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
