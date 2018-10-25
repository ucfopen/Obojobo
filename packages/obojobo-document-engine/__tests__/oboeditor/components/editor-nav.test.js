import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import EditorNav from 'src/scripts/oboeditor/components/editor-nav'

import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
jest.mock('src/scripts/oboeditor/util/editor-util')
import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
jest.mock('src/scripts/oboeditor/util/clipboard-util')
// SubMenu
jest.mock('src/scripts/oboeditor/components/sub-menu')

describe('EditorNav', () => {
	beforeAll(() => {
		document.getSelection = jest.fn()
		document.execCommand = jest.fn()
	})
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('EditorNav component', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {}
		}
		const component = renderer.create(<EditorNav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with all list item types', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 4,
				type: 'heading',
				label: 'label4'
			},
			{
				id: 56,
				type: 'link',
				label: 'label5',
				contentType: 'Page',
				flags: {
					assessment: false
				}
			},
			{
				id: 6,
				type: 'link',
				label: 'label6',
				flags: {
					assessment: true
				}
			},
			{
				id: 7,
				type: 'sublink',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		])

		const props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 56 // select this item
			}
		}
		const component = renderer.create(<EditorNav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component clicks on page item', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 6,
					type: 'link',
					label: 'label6',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().onClick({
			id: 6,
			type: 'link',
			label: 'label6',
			flags: {
				assessment: true
			}
		})

		expect(EditorUtil.gotoPath).toHaveBeenCalled()
	})

	test('EditorNav component clicks Add Page button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([]).mockReturnValueOnce([])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(EditorUtil.addPage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Add Assessment button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([]).mockReturnValueOnce([])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(EditorUtil.addAssessment).toHaveBeenCalled()
	})

	test('EditorNav component clicks Rename Module button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 6,
				type: 'heading',
				label: 'label6',
				flags: {
					assessment: true
				}
			}
		])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Copy URL button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})
})
