import { mount, shallow } from 'enzyme'
import React from 'react'
import Common from '../../../../src/scripts/common'

import FileToolbar from '../../../../src/scripts/oboeditor/components/toolbars/file-toolbar'

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

jest.mock('Common', () => ({
	models: {
		OboModel: {}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		}
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	flux: {
		Dispatcher: {
			trigger: jest.fn()
		}
	}
}))

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

describe('File Toolbar', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		Common.models.OboModel.create = jest.fn().mockReturnValue({ setId: () => true })
	})

	test('FileToolbar node', () => {
		const editor = { current: {
			undo: jest.fn(),
			redo: jest.fn(),
			delete: jest.fn(),
			focus: jest.fn(),
			toggleMark: jest.fn(),
		}}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)
		const value = {}

		const component = shallow(<FileToolbar saved editorRef={editor} insertableItems={[]} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node in visual editor', () => {
		const editor = { current: {
			undo: jest.fn(),
			redo: jest.fn(),
			delete: jest.fn(),
			focus: jest.fn(),
			toggleMark: jest.fn(),
			insertBlock: jest.fn(),
			changeToType: jest.fn(),
		}}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)
		const items = [{ 
			name: 'mock-item', 
			cloneBlankNode: () => ({ type: 'mock-type' }),
			insertJSON: { type: TEXT_NODE }
		}]
		const value = {
			blocks: { get: () => ({ type: 'ObojoboDraft.Chunks.Table.Cell'})},
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 1} }
		}

		const component = mount(<FileToolbar mode="visual" editorRef={editor} insertableItems={items} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with no nodes', () => {
		const editor = { current: {
			undo: jest.fn(),
			redo: jest.fn(),
			delete: jest.fn(),
			focus: jest.fn(),
			toggleMark: jest.fn(),
			insertBlock: jest.fn(),
			changeToType: jest.fn(),
		}}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)
		const items = [{ 
			name: 'mock-item', 
			cloneBlankNode: () => ({ type: 'mock-type' }),
			insertJSON: { type: TEXT_NODE } 
		}]
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 1} },
		}

		const component = mount(<FileToolbar mode="visual" editorRef={editor} insertableItems={items} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with question node', () => {
		const editor = { current: {
			undo: jest.fn(),
			redo: jest.fn(),
			delete: jest.fn(),
			focus: jest.fn(),
			toggleMark: jest.fn(),
			insertBlock: jest.fn(),
			changeToType: jest.fn(),
		}}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)
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
		const value = {
			blocks: { 
				get: () => ({ type: 'ObojoboDraft.Chunks.Question'}),
			},
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 1 } },
			fragment: { filterDescendants: fn => { 
				fn({ type: 'ObojoboDraft.Chunks.Question'}) 
				return { size: 1 }
			}}
		}

		const component = mount(<FileToolbar mode="visual" editorRef={editor} insertableItems={items} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node with other node', () => {
		const editor = { current: {
			undo: jest.fn(),
			redo: jest.fn(),
			delete: jest.fn(),
			focus: jest.fn(),
			toggleMark: jest.fn(),
			insertBlock: jest.fn(),
			changeToType: jest.fn(),
		}}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)
		const items = [{ 
			name: 'mock-item', 
			cloneBlankNode: () => ({ type: 'mock-type' }),
			insertJSON: { type: TEXT_NODE } 
		}]
		const value = {
			blocks: { 
				get: () => ({ type: 'ObojoboDraft.Chunks.Text'}),
			},
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 1} },
			fragment: { filterDescendants: fn => { 
				fn({ type: 'ObojoboDraft.Chunks.Question'}) 
				return false
			}}
		}

		const component = mount(<FileToolbar mode="visual" editorRef={editor} insertableItems={items} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
