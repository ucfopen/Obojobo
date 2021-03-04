import { shallow } from 'enzyme'
import { Transforms, Editor, Range, Element } from 'slate'
import React from 'react'
import { useEditor, ReactEditor } from 'slate-react'
import FileToolbarViewer from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar-viewer'
import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'

jest.mock('slate-react')
jest.mock('slate')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/view-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu', () =>
	global.mockReactComponent(this, 'DropDownMenu')
)
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-toolbar', () =>
	global.mockReactComponent(this, 'FileToolbar')
)
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/format-menu', () =>
	global.mockReactComponent(this, 'FormatMenu')
)

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('FileToolbarViewer', () => {
	let editor
	beforeEach(() => {
		jest.clearAllMocks()
		Editor.path.mockReturnValue('mock-path-return')
		Editor.nodes.mockReturnValue([[{ type: 'mock-type' }, { type: 'mock-type-2' }]])
		Transforms.insertNodes.mockReturnValue(false)
		Range.isCollapsed.mockReturnValue(false)
		editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			children: [{ text: '' }],
			selection: { anchor: { path: [0, 1] }, focus: { path: [5, 9] } },
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			changeToType: jest.fn()
		}
		useEditor.mockReturnValue(editor)
	})

	test('FileToolbarViewer passes expected props to FileToolbar', () => {
		editor.selection = null
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: []
		}

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps).toEqual({
			mode: props.mode,
			saved: props.saved,
			editor: editor,
			hasSelection: null,
			selectAll: expect.any(Function),
			insertMenu: []
		})
	})

	test('FileToolbarViewer formatMenu hasSelection when Range.isCollapsed is true', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: []
		}

		// mock selection inside a mock node
		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps).toEqual({
			mode: props.mode,
			saved: props.saved,
			editor: editor,
			hasSelection: true, // <- should be true because there is a selection
			selectAll: expect.any(Function),
			insertMenu: []
		})
	})

	test('FileToolbarViewer insert menu item enabled', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'mock-1',
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: 'type-that-allows-inserting' }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: false, // <- important bit
				name: 'mock-1'
			}
		])
	})

	test('FileToolbarViewer insert menu item disabled when theres no selection', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'mock-2',
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: 'type-that-allows-inserting-2' }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		editor.selection = null // should disable insert menu items

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: true, // <- important bit
				name: 'mock-2'
			}
		])
	})

	test('FileToolbarViewer disables insert when table is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'mock-table',
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: TABLE_NODE }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: true, // <- important bit
				name: 'mock-table'
			}
		])
	})

	test('FileToolbarViewer enables insert when whatever inside a question is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
			insertableItems: [
				{
					name: 'whatever', // isn't black listed to prevent inserting
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: QUESTION_NODE }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: false, // <- important bit
				name: 'whatever'
			}
		])
	})

	test('FileToolbarViewer disables insert when question is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'Question', // is black listed to prevent inserting
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: QUESTION_NODE }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: true, // <- important bit
				name: 'Question'
			}
		])
	})

	test('FileToolbarViewer disables insert when question bank is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'Question Bank', // is black listed to prevent inserting
					cloneBlankNode: jest.fn()
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: QUESTION_NODE }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps.insertMenu).toEqual([
			{
				action: expect.any(Function),
				disabled: true, // <- important bit
				name: 'Question Bank'
			}
		])
	})

	test('FileToolbarViewer searches for slate nodes correctly', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: []
		}

		Range.isCollapsed.mockReturnValueOnce(true)

		shallow(<FileToolbarViewer {...props} />)

		const [searchEditor, searchSettings] = Editor.nodes.mock.calls[0]
		expect(searchEditor).toBe(editor)
		expect(searchSettings).toHaveProperty('at', 'mock-path-return')
		expect(searchSettings).toHaveProperty('match', expect.any(Function))

		// implementation is:
		// node => Element.isElement(node) && !editor.isInline(node) && !node.subtype

		// fail isElement right away
		Element.isElement.mockReturnValueOnce(false)
		expect(searchSettings.match({ subtype: 'test' })).toBe(false)

		// pass isElement, fail editor.isInline
		Element.isElement.mockReturnValueOnce(true)
		editor.isInline = () => true
		expect(searchSettings.match({ subtype: 'test' })).toBe(false)

		// pass isElement, pass isInline, fail subtype
		Element.isElement.mockReturnValueOnce(true)
		editor.isInline = () => false
		expect(searchSettings.match({ subtype: 'test' })).toBe(false)

		// pass isElement, pass isInline, pass subtype
		Element.isElement.mockReturnValueOnce(true)
		editor.isInline = () => false
		expect(searchSettings.match({})).toBe(true)
	})

	test('FileToolbarViewer insert menu item actions insert slate nodes and focus', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'mock-1',
					cloneBlankNode: jest.fn().mockReturnValue('clone')
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: 'type-that-allows-inserting' }]])

		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)

		const insertMenuProps = component.find(FileToolbar).props().insertMenu
		expect(insertMenuProps[0]).toEqual({
			name: 'mock-1',
			action: expect.any(Function),
			disabled: false
		})

		insertMenuProps[0].action()
		expect(Transforms.insertNodes).toHaveBeenCalledWith(editor, 'clone')
		expect(ReactEditor.focus).toHaveBeenCalledWith(editor)
	})

	test('FileToolbarViewer selectAll selects all via slate', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			insertableItems: [
				{
					name: 'mock-1',
					cloneBlankNode: jest.fn().mockReturnValue('clone')
				}
			]
		}

		// mock selection inside a mock node
		Editor.nodes.mockReturnValue([[{ type: 'type-that-allows-inserting' }]])

		Range.isCollapsed.mockReturnValueOnce(true)
		const mockEdges = ['mock-edge', 'mock-edge2']
		Editor.edges.mockReturnValue(mockEdges)

		const component = shallow(<FileToolbarViewer {...props} />)

		const selectAll = component.find(FileToolbar).props().selectAll
		selectAll(editor)

		expect(Editor.edges).toHaveBeenCalledWith(editor, [])
		expect(Transforms.select).toHaveBeenCalledWith(editor, {
			focus: 'mock-edge',
			anchor: 'mock-edge2'
		})
		expect(ReactEditor.focus).toHaveBeenCalledWith(editor)
	})
})
