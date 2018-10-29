import React from 'react'
import renderer from 'react-test-renderer'

import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

describe('HTML editor', () => {
	test('Node builds the expected component', () => {
		const Node = HTML.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.moveToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		HTML.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.moveToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return {}
				}
			},
			text: 'mockText'
		}
		const oboNode = HTML.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = HTML.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const slateNode = HTML.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: HTML_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(HTML.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no html', () => {
		const change = {
			value: {
				blocks: [
					{
						type: 'mockType'
					}
				]
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keypress', () => {
		const change = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const change = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			},
			insertText: jest.fn()
		}

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, change)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(change.insertText).toHaveBeenCalled()
	})
})
