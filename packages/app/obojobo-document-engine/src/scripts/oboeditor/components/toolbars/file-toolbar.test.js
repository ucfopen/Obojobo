import { mount, shallow } from 'enzyme'
import React from 'react'
import FileToolbar from './file-toolbar'
import DropDownMenu from './drop-down-menu'
jest.mock('./file-menu')
jest.mock('./view-menu')
jest.mock('./drop-down-menu')
jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		Button: require('obojobo-document-engine/src/scripts/common/components/button').default
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
			saveState: 'saveSuccessful',
			editor
		}

		const component = shallow(<FileToolbar {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar in saving state', () => {
		const props = {
			saveState: 'saving',
			editor
		}

		const component = shallow(<FileToolbar {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar with disables deletion', () => {
		const props = {
			saveState: 'saveSuccessful',
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
			saveState: 'saveSuccessful',
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
			saveState: 'saveSuccessful',
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
			saveState: 'saveSuccessful',
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
			saveState: 'saveSuccessful',
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
})
