import { shallow } from 'enzyme'
import React from 'react'

import ContentToolbar from '../../../../src/scripts/oboeditor/components/toolbars/content-toolbar'

describe('Content Toolbar', () => {
	test('Toolbar node', () => {
<<<<<<< HEAD
		const component = shallow(<ContentToolbar editorRef={{}} />)
=======
		const value = {
			blocks: {
				reduce: fn => fn("type-1", { type: "type-2" }) || fn("type-1", { type: "type-2" }),
				get: () => ({ type: "type-1" })
			}
		}
		const component = shallow(<ContentToolbar editorRef={{}} value={value}/>)
>>>>>>> issue/795-editor-toolbar
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Toolbar node calls the action for a button', () => {
		const value = {
			blocks: {
				reduce: fn => fn("type-1", { type: "type-2" }) || fn("type-1", { type: "type-2" }),
				get: () => ({ type: "type-1" })
			}
		}
		const editor = {
			focus: jest.fn()
		}
		editor.toggleMark = jest.fn().mockReturnValue(editor)

<<<<<<< HEAD
		const component = shallow(<ContentToolbar editorRef={{ current: editor }} />)
=======
		const component = shallow(<ContentToolbar editorRef={{ current: editor }} value={value}/>)
>>>>>>> issue/795-editor-toolbar
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})
})
