import Common from 'src/scripts/common/index'

import FormatPlugin from './format-plugin'

// const LIST_NODE = 'ObojoboDraft.Chunks.List'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'

describe('FormatPlugin', () => {
	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			changeToType: jest.fn()
		}

		FormatPlugin.onKeyDown({ key: 'q' }, editor, jest.fn())

		expect(editor.changeToType).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const editor = {
			changeToType: jest.fn()
		}

		FormatPlugin.onKeyDown({ ctrlKey: true, key: 'f' }, editor, jest.fn())

		expect(editor.changeToType).not.toHaveBeenCalled()
	})

	test('onKeyDown toggles marks if CTRL/CMD + key is pressed', () => {
		const editor = {
			changeToType: jest.fn()
		}
		const mockEvent = {
			metaKey: true,
			shiftKey: true,
			key: 'k',
			preventDefault: jest.fn()
		}

		mockEvent.key = 'c'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(CODE_NODE)

		mockEvent.key = ' '
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(TEXT_NODE)

		mockEvent.key = '1'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 1 })
		mockEvent.key = '!'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 1 })

		mockEvent.key = '2'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 2 })
		mockEvent.key = '@'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 2 })

		mockEvent.key = '3'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 3 })
		mockEvent.key = '#'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 3 })

		mockEvent.key = '4'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 4 })
		mockEvent.key = '$'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 4 })

		mockEvent.key = '5'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 5 })
		mockEvent.key = '%'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 5 })

		mockEvent.key = '6'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 6 })
		mockEvent.key = '^'
		FormatPlugin.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.changeToType).toHaveBeenCalledWith(HEADING_NODE, { headingLevel: 6 })
	})

	test('changeToType calls item.switchToType', () => {
		const editor = {
			children: [
				{
					type: 'mock-node',
					children: [{ text: 'mockText' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [1, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		const item = {
			switchType: {
				'mock-type': jest.fn()
			}
		}
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce(item)

		FormatPlugin.commands.changeToType(editor, 'mock-type')

		expect(item.switchType['mock-type']).toHaveBeenCalled()
	})

	test('changeToType does not call item.switchToType when the value doent exist', () => {
		const editor = {
			children: [
				{
					type: 'mock-node',
					children: [{ text: 'mockText' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [1, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		const item = {
			switchType: {
				'mock-type': jest.fn()
			}
		}
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce(item)

		FormatPlugin.commands.changeToType(editor, 'mock-other-type')

		expect(item.switchType['mock-type']).not.toHaveBeenCalled()
	})
})
