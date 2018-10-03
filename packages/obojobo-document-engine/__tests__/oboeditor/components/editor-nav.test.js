import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import EditorNav from '../../../src/scripts/oboeditor/components/editor-nav'

import EditorUtil from '../../../src/scripts/oboeditor/util/editor-util'
import Common from '../../../src/scripts/common'

jest.mock('../../../src/scripts/oboeditor/util/editor-util')

describe('EditorNav', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		Common.models.OboModel.models = {
			'5': {
				isFirst: () => true,
				isLast: () => false,
				getIndex: () => 0
			},
			'6': {
				isFirst: () => false,
				isLast: () => true,
				getIndex: () => 1
			}
		}
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
				id: 5,
				type: 'link',
				label: 'label5',
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

	test('EditorNav component clicks Move Up button in item', () => {
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

		component
			.find('li')
			.find('button')
			.at(0) // [Move Up, Edit Name, Delete]
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Move Down button in item', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 5,
					type: 'link',
					label: 'label5',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('li')
			.find('button')
			.at(0) // [Move Down, Edit Name, Delete]
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Edit Name button in item', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 5,
					type: 'link',
					label: 'label5',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('li')
			.find('button')
			.at(1) // [Move Down, Edit Name, Delete]
			.simulate('click')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Delete button in item', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 5,
					type: 'link',
					label: 'label5',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('li')
			.find('button')
			.at(2) // [Move Down, Edit Name, Delete]
			.simulate('click')

		expect(EditorUtil.deletePage).toHaveBeenCalled()
	})
})
