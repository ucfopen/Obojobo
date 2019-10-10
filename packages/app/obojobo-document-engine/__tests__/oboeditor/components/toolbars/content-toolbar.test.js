import { shallow } from 'enzyme'
import React from 'react'

import ContentToolbar from 'obojobo-document-engine/src/scripts/oboeditor/components/toolbars/content-toolbar'

describe('Content Toolbar', () => {
	test('Toolbar node', () => {
		const component = shallow(<ContentToolbar getEditor={() => ({})}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Toolbar node calls the action for a button', () => {
		const editor = {
			toggleMark: jest.fn()
		}

		const component = shallow(<ContentToolbar getEditor={() => editor}/>)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})
})
