import { shallow } from 'enzyme'
import { Transforms, Editor, Range, Element } from 'slate'
import React from 'react'
import { useEditor, ReactEditor } from 'slate-react'
import FileToolbarViewer from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar-viewer'
import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'
import FormatMenu from '../../../../src/scripts/oboeditor/components/toolbars/format-menu'
import DropDownMenu from '../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu'
import { Registry } from '../../../../src/scripts/common/registry'

jest.mock('slate-react')
jest.mock('slate')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/view-menu')
jest.mock('../../../../src/scripts/common/registry')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu', () =>
	global.mockReactComponent(this, 'DropDownMenu')
)
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-toolbar', () =>
	global.mockReactComponent(this, 'FileToolbar')
)
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/format-menu', () =>
	global.mockReactComponent(this, 'FormatMenu')
)

// Editor.nodes returns an iterator
// this is an iterator that always returns a single node
// `new MockNodesIeterator()[Symbol.iterator]()` will give you an iterator to call next() on
class MockNodesIeterator {
	constructor() {
		this._nextValue = this.defaultValue
	}
	get defaultValue() {
		return [{ type: 'mock-type' }]
	}
	set nextValue(val) {
		this._nextValue = val
	}
	get nextValue() {
		return this._nextValue
	}

	[Symbol.iterator]() {
		return {
			next: () => ({
				value: this._nextValue,
				done: true
			})
		}
	}
}

describe('FileToolbarViewer', () => {
	let editor
	let MockNodesIeteratorInstance
	beforeEach(() => {
		jest.resetAllMocks()
		jest.clearAllMocks()
		jest.mock
		MockNodesIeteratorInstance = new MockNodesIeterator()
		Editor.path.mockReturnValue('mock-path-return')
		Editor.nodes.mockImplementation(() => MockNodesIeteratorInstance[Symbol.iterator]())
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

		Registry.getItemForType.mockReturnValueOnce({ acceptsInserts: true })

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

		// with no selection this will return undefined
		Registry.getItemForType.mockReturnValueOnce(undefined)

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

		Registry.getItemForType.mockReturnValueOnce({ acceptsInserts: true })

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

	test('FileToolbarViewer insert menu item action calls chunk plugins.insertItemInto', () => {
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
		const node = {
			acceptsInserts: true,
			plugins: {
				insertItemInto: jest.fn()
			}
		}
		Registry.getItemForType.mockReturnValueOnce(node)

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
		expect(node.plugins.insertItemInto).toHaveBeenCalledWith(editor, props.insertableItems[0])
		expect(ReactEditor.focus).toHaveBeenCalledWith(editor)
	})

	test('FileToolbarViewer blocks inserting when there is no selection', () => {
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
		const node = {
			acceptsInserts: true,
			plugins: {
				insertItemInto: jest.fn()
			}
		}
		Registry.getItemForType.mockReturnValueOnce(node)

		Range.isCollapsed.mockReturnValueOnce(false)

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
		expect(node.plugins.insertItemInto).not.toHaveBeenCalled()
		expect(ReactEditor.focus).not.toHaveBeenCalled()
	})

	test('FileToolbarViewer blocks inserting when it could not resolve selected node', () => {
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

		const node = {
			acceptsInserts: true,
			plugins: {
				insertItemInto: jest.fn()
			}
		}

		Registry.getItemForType.mockReturnValueOnce(node)

		Range.isCollapsed.mockReturnValueOnce(true)
		MockNodesIeteratorInstance.nextValue = null

		const component = shallow(<FileToolbarViewer {...props} />)

		const insertMenuProps = component.find(FileToolbar).props().insertMenu.props.children.props
		expect(insertMenuProps).toHaveProperty('name', 'Insert')
		expect(insertMenuProps).toHaveProperty('menu', expect.any(Array))

		insertMenuProps.menu[0].action()
		expect(node.plugins.insertItemInto).not.toHaveBeenCalled()
		expect(ReactEditor.focus).not.toHaveBeenCalled()
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
