import { shallow } from 'enzyme'
import React from 'react'

import ContentToolbar from '../../../../src/scripts/oboeditor/components/toolbars/content-toolbar'

describe('Content Toolbar', () => {
	test('Toolbar node', () => {
		const component = shallow(<ContentToolbar editorRef={{}}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Toolbar node calls the action for a button', () => {
		const editor = {
			focus: jest.fn()
		}
		editor.toggleMark = jest.fn().mockReturnValue(editor)

		const component = shallow(<ContentToolbar editorRef={{ current: editor }}/>)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})
})
