import { mount, shallow } from 'enzyme'
import React from 'react'

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

describe('File Toolbar', () => {
	test('FileToolbar node', () => {
		const editor = {
			current: {
				undo: jest.fn(),
				redo: jest.fn(),
				delete: jest.fn(),
				focus: jest.fn(),
				toggleMark: jest.fn()
			}
		}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)

		const component = shallow(<FileToolbar saved editorRef={editor} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileToolbar node in visual editor', () => {
		const editor = {
			current: {
				undo: jest.fn(),
				redo: jest.fn(),
				delete: jest.fn(),
				focus: jest.fn(),
				toggleMark: jest.fn()
			}
		}
		editor.current.moveToRangeOfDocument = jest.fn().mockReturnValue(editor.current)

		const component = mount(<FileToolbar mode="visual" editorRef={editor} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
