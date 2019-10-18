import { mount, shallow } from 'enzyme'
import React from 'react'

import ViewMenu from '../../../../src/scripts/oboeditor/components/toolbars/view-menu'

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

describe('ViewMenu', () => {
	test('ViewMenu node', () => {
		const component = shallow(<ViewMenu draftId="mock-id"/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('ViewMenu performs actions', () => {
		const save = jest.fn()
		const switchMode = jest.fn()

		const component = mount(
			<ViewMenu 
				draftId="mock-id" 
				onSave={save} 
				switchMode={switchMode}/>
		)
		
		component
			.find('button')
			.at(2)
			.simulate('click')
		expect(switchMode).toHaveBeenCalledWith(JSON_MODE)

		component
			.find('button')
			.at(3)
			.simulate('click')
		expect(switchMode).toHaveBeenCalledWith(XML_MODE)

		component
			.find('button')
			.at(4)
			.simulate('click')
		expect(switchMode).toHaveBeenCalledWith(VISUAL_MODE)

		component
			.find('button')
			.at(5)
			.simulate('click')
	})
})