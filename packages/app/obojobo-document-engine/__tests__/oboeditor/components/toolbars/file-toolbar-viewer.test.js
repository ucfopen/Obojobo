import { shallow } from 'enzyme'
import { Transforms, Editor, Range, Element } from 'slate'
import React from 'react'
import { useEditor, ReactEditor } from 'slate-react'
import FileToolbarViewer from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar-viewer'
import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'
import FormatMenu from '../../../../src/scripts/oboeditor/components/toolbars/format-menu'
import DropDownMenu from '../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu'

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
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

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

	test('FileToolbarViewer passes expectd props to FileToolbar', () => {
		editor.selection = null
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
			insertableItems: []
		}

		const component = shallow(<FileToolbarViewer {...props} />)

		const toolBarProps = component.find(FileToolbar).props()

		expect(toolBarProps).toEqual({
			mode: props.mode,
			saved: props.saved,
			editor: editor,
			isDeletable: props.isDeletable,
			selectAll: expect.any(Function),
			selectionKey: 0,
			formatMenu: <FormatMenu hasSelection={null} />,
			insertMenu: (
				<div className="visual-editor--drop-down-menu">
					<DropDownMenu menu={[]} name="Insert" />
				</div>
			)
		})
	})

	test('FileToolbarViewer formatMenu hasSelection when Range.isCollapsed is true', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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
			isDeletable: true, // <- should be true becase there is a selection
			selectAll: expect.any(Function),
			selectionKey: '0,1-5,9',
			formatMenu: <FormatMenu hasSelection={true} />, // <- should be true becase there is a selection
			insertMenu: (
				<div className="visual-editor--drop-down-menu">
					<DropDownMenu menu={[]} name="Insert" />
				</div>
			)
		})
	})

	test('FileToolbarViewer insert menu item enabled', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: false, // <- important bit
							name: 'mock-1'
						}
					]}
				/>
			</div>
		)
	})

	test('FileToolbarViewer insert menu item disabled when theres no selection', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: true, // <- important bit
							name: 'mock-2'
						}
					]}
				/>
			</div>
		)
	})

	test('FileToolbarViewer disables insert when table is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: true, // <- important bit
							name: 'mock-table'
						}
					]}
				/>
			</div>
		)
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: false, // <- important bit
							name: 'whatever'
						}
					]}
				/>
			</div>
		)
	})

	test('FileToolbarViewer pdisables insert when question is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: true, // <- important bit
							name: 'Question'
						}
					]}
				/>
			</div>
		)
	})

	test('FileToolbarViewer disables insert when question bank is selected', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

		expect(toolBarProps.insertMenu).toEqual(
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu
					name="Insert"
					menu={[
						{
							action: expect.any(Function),
							disabled: true, // <- important bit
							name: 'Question Bank'
						}
					]}
				/>
			</div>
		)
	})

	test('FileToolbarViewer searches for slate nodes correctly', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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
			isDeletable: null,
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

		const insertMenuProps = component.find(FileToolbar).props().insertMenu.props.children.props
		expect(insertMenuProps).toHaveProperty('name', 'Insert')
		expect(insertMenuProps).toHaveProperty('menu', expect.any(Array))
		expect(insertMenuProps.menu[0]).toEqual({
			name: 'mock-1',
			action: expect.any(Function),
			disabled: false
		})

		insertMenuProps.menu[0].action()
		expect(Transforms.insertNodes).toHaveBeenCalledWith(editor, 'clone')
		expect(ReactEditor.focus).toHaveBeenCalledWith(editor)
	})

	test('FileToolbarViewer selectAll selects all via slate', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
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

	test('FileToolbarView converts duplicated figure to text', () => {
		const props = {
			mode: 'visual',
			saved: 'true',
			isDeletable: null,
			insertableItems: [
				{
					name: 'mock',
					cloneBlankNode: jest.fn().mockReturnValue('mock-clone')
				}
			]
		}
		const mockPath = [0, 0, 0]

		Editor.nodes.mockReturnValue([[{ type: FIGURE_NODE }]])
		Editor.path.mockReturnValue(mockPath)
		Range.isCollapsed.mockReturnValueOnce(true)

		const component = shallow(<FileToolbarViewer {...props} />)
		const insertMenuProps = component.find(FileToolbar).props().insertMenu.props.children.props

		expect(insertMenuProps).toHaveProperty('name', 'Insert')
		expect(insertMenuProps).toHaveProperty('menu', expect.any(Array))
		expect(insertMenuProps.menu[0]).toEqual({
			name: 'mock',
			action: expect.any(Function),
			disabled: false
		})

		insertMenuProps.menu[0].action()

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{
				type: TEXT_NODE,
				content: {}
			},
			{
				at: [0, 2]
			}
		)
	})
})
