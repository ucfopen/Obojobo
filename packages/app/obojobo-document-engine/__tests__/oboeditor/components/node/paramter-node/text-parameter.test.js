import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('src/scripts/oboeditor/util/keydown-util')

import TextParameter from 'src/scripts/oboeditor/components/parameter-node/text-parameter'
import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'

const TEXT_PARAMETER = 'oboeditor.text-parameter'

describe('Select Parameter', () => {
	test('Node component', () => {
		const Node = TextParameter.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: jest.fn().mockReturnValueOnce(false)
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn()
			},
			text: 'mockValue'
		}
		const oboNode = TextParameter.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const slateNode = TextParameter.helpers.oboToSlate(
			'oboName',
			'someValue',
			'someDisplay'
		)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no parameter', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						type: 'NotAParameter'
					}
				]
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		TextParameter.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random key press', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						type: TEXT_PARAMETER
					}
				]
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'K',
			preventDefault: jest.fn()
		}

		TextParameter.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const editor = {
			value: {
				blocks: [{ key: 'mockKey', type: TEXT_PARAMETER }]
			}
		}
		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		TextParameter.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace]', () => {
		const editor = {
			value: {
				blocks: [{ key: 'mockKey', type: TEXT_PARAMETER }]
			}
		}
		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		TextParameter.plugins.onKeyDown(event, editor, jest.fn())
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Delete]', () => {
		const editor = {
			value: {
				blocks: [{ key: 'mockKey', type: TEXT_PARAMETER }]
			}
		}
		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		TextParameter.plugins.onKeyDown(event, editor, jest.fn())
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a Parameter when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TEXT_PARAMETER,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(TextParameter.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(TextParameter.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
