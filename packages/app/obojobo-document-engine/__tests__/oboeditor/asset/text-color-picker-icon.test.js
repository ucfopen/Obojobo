import React from 'react'
import { mount } from 'enzyme'

import TextColorIcon from 'obojobo-document-engine/src/scripts/oboeditor/assets/text-color-picker-icon'

jest.mock('slate-react')
jest.mock('slate')

describe('TextColorIcon', () => {
	test('TextColorIcon component', () => {
		const component = mount(<TextColorIcon />)
		expect(component.html()).toMatchSnapshot()
	})

	test('TextColorIcon expanded', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			}
		}
		const component = mount(<TextColorIcon {...props} />)
		component
			.find('svg')
			.at(0)
			.simulate('click')
		expect(component.html()).toMatchSnapshot()
	})

	test('TextColorIcon when ColorPicker call close', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			}
		}
		const component = mount(<TextColorIcon {...props} />)
		component
			.find('svg')
			.at(0)
			.simulate('click')
		component
			.find('.color-picker--color-cell')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('TextColorIcon handels mousedown', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<TextColorIcon {...props} />)
		const nodeInstance = component.instance()

		// Click when the dom is null
		nodeInstance.domRef = { current: null }
		nodeInstance.onWindowMouseDown({ target: true })
		expect(component.html()).toMatchSnapshot()

		// Click inside
		nodeInstance.domRef = { current: { contains: () => true } }
		nodeInstance.onWindowMouseDown({ target: true })
		expect(component.html()).toMatchSnapshot()

		// Click outside
		nodeInstance.domRef = { current: { contains: () => false } }
		nodeInstance.onWindowMouseDown({ target: true })
		expect(component.html()).toMatchSnapshot()
	})
})
