import { mount, shallow } from 'enzyme'
import React from 'react'
import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'
import DropDownMenu from '../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu'
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/view-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu')
jest.mock('../../../../src/scripts/common', () => ({
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		Button: require('../../../../src/scripts/common/components/button').default
	},
	util: {
		isOrNot: require('obojobo-document-engine/src/scripts/common/util/isornot').default
	}
}))

describe('File Toolbar', () => {
	let editor
	beforeEach(() => {
		jest.clearAllMocks()
		editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			selectAll: jest.fn()
		}
	})

	test('FileToolbar node', () => {
		const props = {
			saved: true,
			editor
		}

		const component = shallow(<FileToolbar {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar with disables deletion', () => {
		const props = {
			saved: true,
			editor,
			isDeletable: false
		}

		const component = shallow(<FileToolbar {...props} />)

		const expected = [
			{
				action: expect.any(Function),
				disabled: false,
				name: 'Delete',
				type: 'action'
			}
		]

		const editMenuProps = component.find(DropDownMenu).props()
		expect(editMenuProps.menu).toEqual(expect.arrayContaining(expected))
	})

	test('FileToolbar with enables deletion', () => {
		const props = {
			saved: true,
			editor,
			isDeletable: true
		}

		const component = shallow(<FileToolbar {...props} />)

		const expected = [
			{
				action: expect.any(Function),
				disabled: true,
				name: 'Delete',
				type: 'action'
			}
		]

		const editMenuProps = component.find(DropDownMenu).props()
		expect(editMenuProps.menu).toEqual(expect.arrayContaining(expected))
	})

	test('FileToolbar with enables deletion by default', () => {
		const props = {
			saved: true,
			editor,
			isDeletable: null
		}

		const component = shallow(<FileToolbar {...props} />)

		const expected = [
			{
				action: expect.any(Function),
				disabled: true,
				name: 'Delete',
				type: 'action'
			}
		]

		const editMenuProps = component.find(DropDownMenu).props()
		expect(editMenuProps.menu).toEqual(expect.arrayContaining(expected))
	})

	test('FileToolbar passes and executes props.selectAll on child editMenu', () => {
		const props = {
			saved: true,
			editor,
			isDeletable: null,
			selectAll: jest.fn()
		}

		const component = shallow(<FileToolbar {...props} />)

		const editMenuProps = component.find(DropDownMenu).props()
		const selectItem = editMenuProps.menu.find(i => i.name === 'Select all')

		expect(props.selectAll).toHaveBeenCalledTimes(0)
		selectItem.action()
		expect(props.selectAll).toHaveBeenCalledTimes(1)
	})

	test('FileToolbar passes and executes editor.selectAll on child editMenu', () => {
		const props = {
			saved: true,
			editor,
			isDeletable: null
		}

		const component = shallow(<FileToolbar {...props} />)

		const editMenuProps = component.find(DropDownMenu).props()
		const selectItem = editMenuProps.menu.find(i => i.name === 'Select all')

		expect(editor.selectAll).toHaveBeenCalledTimes(0)
		selectItem.action()
		expect(editor.selectAll).toHaveBeenCalledTimes(1)
	})

	test('FileToolbar node in visual editor', () => {
		const props = {
			mode: 'visual',
			editor
		}

		const component = mount(<FileToolbar {...props} />)

		const tree = component.html()
		component
			.find('button')
			.at(0)
			.simulate('click')
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar calls close', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			children: [{ text: '' }],
			selection: null,
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			selectAll: jest.fn()
		}

		// Use `FileToolbar.type` to eliminate memo() function
		const component = mount(
			<FileToolbar.type saved editor={editor} insertableItems={[]} value={{}} />
		)

		component.instance().close()
		expect(component.instance().state.isOpen).toBe(false)
	})

	test('FileToolbar calls onMouseEnter', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			children: [{ text: '' }],
			selection: null,
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			selectAll: jest.fn()
		}

		// Use `FileToolbar.type` to eliminate memo() function
		const component = mount(
			<FileToolbar.type saved editor={editor} insertableItems={[]} value={{}} />
		)

		const mockInnerText = 'File'
		component.instance().onMouseEnter({ target: { innerText: mockInnerText } })
		expect(component.instance().state.curItem).toBe(mockInnerText)
	})

	test('FileToolbar calls clickOutside', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			children: [{ text: '' }],
			selection: null,
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			selectAll: jest.fn()
		}

		// Use `FileToolbar.type` to eliminate memo() function
		const component = mount(
			<FileToolbar.type saved editor={editor} insertableItems={[]} value={{}} />
		)

		component.instance().state.isOpen = true
		component.instance().node.current.contains = () => false
		component.instance().clickOutside({ target: {} })
		expect(component.instance().state.isOpen).toBe(false)

		component.instance().node.current.contains = () => true
		component.instance().clickOutside({ target: {} })
		expect(component.instance().state.isOpen).toBe(false)
	})

	test('FileToolbar calls toggleOpen', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			children: [{ text: '' }],
			selection: null,
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			selectAll: jest.fn(),
			changeToType: jest.fn()
		}

		// Use `FileToolbar.type` to eliminate memo() function
		const component = mount(
			<FileToolbar.type saved mode="visual" editor={editor} insertableItems={[]} value={{}} />
		)

		component.instance().toggleOpen({ target: { innerText: 'File' } })
		expect(component.instance().state.isOpen).toBe(true)
		expect(component.instance().state.curItem).toBe('File')
		component.instance().toggleOpen({ target: { innerText: 'File' } })

		component.instance().toggleOpen({ target: { innerText: 'View' } })
		expect(component.instance().state.isOpen).toBe(true)
		expect(component.instance().state.curItem).toBe('View')
		component.instance().toggleOpen({ target: { innerText: 'View' } })

		component.instance().toggleOpen({ target: { innerText: 'Edit' } })
		expect(component.instance().state.isOpen).toBe(true)
		expect(component.instance().state.curItem).toBe('Edit')
		component.instance().toggleOpen({ target: { innerText: 'Edit' } })

		component.instance().toggleOpen({ target: { innerText: 'Insert' } })
		expect(component.instance().state.isOpen).toBe(true)
		expect(component.instance().state.curItem).toBe('Insert')
		component.instance().toggleOpen({ target: { innerText: 'Insert' } })

		component.instance().toggleOpen({ target: { innerText: 'Format' } })
		expect(component.instance().state.isOpen).toBe(true)
		expect(component.instance().state.curItem).toBe('Format')
		component.instance().toggleOpen({ target: { innerText: 'Format' } })
	})
})
