import { mount, shallow } from 'enzyme'
import { Transforms, Editor } from 'slate'
import React from 'react'
import Common from '../../../../src/scripts/common'

import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'

jest.mock('slate-react')
jest.mock('../../../../src/scripts/oboeditor/components/marks/basic-marks', () => ({
	marks: [{ name: 'Mock Mark', action: jest.fn() }]
}))
jest.mock('../../../../src/scripts/oboeditor/components/marks/link-mark')
jest.mock('../../../../src/scripts/oboeditor/components/marks/script-marks')
jest.mock('../../../../src/scripts/oboeditor/components/marks/align-marks', () => ({
	marks: [{ name: 'Mock Mark', action: jest.fn() }]
}))
jest.mock('../../../../src/scripts/oboeditor/components/marks/indent-marks')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/view-menu')
jest.mock('../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu', () =>
	// Make sure actions are properly registered
	props => {
		if (props.menu) {
			props.menu.forEach(item => {
				if (item.action) return item.action()
				if (item.menu) {
					item.menu.forEach(subitem => {
						if (subitem.action) return subitem.action()
					})
				}
			})
		}
		return null
	}
)

jest.mock('../../../../src/scripts/common', () => ({
	models: {
		OboModel: {}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		Button: require('../../../../src/scripts/common/components/button').default
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		},
		isOrNot: require('obojobo-document-engine/src/scripts/common/util/isornot').default
	},
	flux: {
		Dispatcher: {
			trigger: jest.fn()
		}
	}
}))

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('File Toolbar', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		Common.models.OboModel.create = jest.fn().mockReturnValue({ setId: () => true })
	})

	test('FileToolbar node', () => {
		jest.spyOn(Editor, 'isEditor').mockReturnValue(false)
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
		const value = {}

		const component = shallow(
			<FileToolbar saved editor={editor} insertableItems={[]} value={value} />
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node in visual editor', () => {
		jest.spyOn(Editor, 'isEditor').mockReturnValue(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(false)
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			changeToType: jest.fn(),
			children: [{ text: 'mockText' }],
			selection: null,
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const items = [
			{
				name: 'mock-item',
				cloneBlankNode: () => ({ type: 'mock-type' }),
				insertJSON: { type: TEXT_NODE }
			}
		]

		const component = mount(
			<FileToolbar mode="visual" editor={editor} insertableItems={items} value={editor.children} />
		)
		const tree = component.html()
		component
			.find('button')
			.at(0)
			.simulate('click')
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with no nodes', () => {
		jest.spyOn(Editor, 'isEditor').mockReturnValue(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(false)
		jest.spyOn(Editor, 'nodes').mockReturnValue([
			[
				{
					type: TABLE_NODE,
					children: [{ text: 'mockText' }]
				},
				[0]
			]
		])

		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			changeToType: jest.fn(),
			children: [{ text: 'mockText' }],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const items = [
			{
				name: 'mock-item',
				cloneBlankNode: () => ({ type: 'mock-type' }),
				insertJSON: { type: TEXT_NODE }
			}
		]

		const component = mount(
			<FileToolbar mode="visual" editor={editor} insertableItems={items} value={editor.children} />
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with question node', () => {
		jest.spyOn(Editor, 'isEditor').mockReturnValue(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(false)
		jest.spyOn(Editor, 'nodes').mockReturnValue([
			[
				{
					type: QUESTION_NODE,
					children: [{ text: 'mockText' }]
				},
				[0]
			]
		])

		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			changeToType: jest.fn(),
			children: [{ text: 'mockText' }],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const items = [
			{
				name: 'mock-item',
				cloneBlankNode: () => ({ type: 'mock-type' }),
				insertJSON: { type: TEXT_NODE }
			},
			{
				name: 'Question Bank',
				cloneBlankNode: () => ({ type: 'mock-type' }),
				insertJSON: { type: TEXT_NODE }
			}
		]

		const component = mount(
			<FileToolbar mode="visual" editor={editor} insertableItems={items} value={editor.children} />
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with other node', () => {
		jest.spyOn(Editor, 'isEditor').mockReturnValue(false)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(false)

		jest.spyOn(Editor, 'nodes').mockImplementation((editor, opts) => {
			opts.match({
				type: TEXT_NODE,
				children: [{ text: 'mockText' }]
			})
			return [
				[
					{
						type: TEXT_NODE,
						children: [{ text: 'mockText' }]
					},
					[0]
				]
			]
		})

		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			deleteFragment: jest.fn(),
			toggleMark: jest.fn(),
			changeToType: jest.fn(),
			children: [{ text: 'mockText' }],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn(),
			selectAll: jest.fn()
		}
		const items = [
			{
				name: 'mock-item',
				cloneBlankNode: () => ({ type: 'mock-type' }),
				insertJSON: { type: TEXT_NODE }
			}
		]

		const component = mount(
			<FileToolbar mode="visual" editor={editor} insertableItems={items} value={editor.children} />
		)
		const tree = component.html()
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
