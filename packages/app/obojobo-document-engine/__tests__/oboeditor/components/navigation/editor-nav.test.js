import EditorNav from 'src/scripts/oboeditor/components/navigation/editor-nav'
import React from 'react'
import Common from 'src/scripts/common'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
jest.mock('src/scripts/oboeditor/util/editor-util')
// SubMenu
jest.mock('src/scripts/oboeditor/components/navigation/sub-menu')
// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null, itemsById: { mockStartingId: { label: 'theLabel' } } }
}))

describe('EditorNav', () => {
	beforeAll(() => {
		document.getSelection = jest.fn()
		document.execCommand = jest.fn()

		Common.models.OboModel.models = {
			'4': {
				isFirst: () => true,
				isLast: () => false,
				getIndex: () => 0,
				get: type =>
					type === 'type'
						? 'ObojoboDraft.Chunks.Page'
						: { id: 'mock-id', title: 'Mock title', triggers: [] }
			}
		}
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

	test('EditorNav component adds page', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {}
		}
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('EditorNav component adds assessment', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {}
		}
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('EditorNav component with all list item types', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 4,
				type: 'heading',
				label: 'label4',
				flags: {}
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

		component.instance().onNavItemClick({
			id: 6,
			type: 'link',
			label: 'label6',
			flags: {
				assessment: true
			}
		})

		expect(EditorUtil.goto).toHaveBeenCalled()
	})

	test('addAssessment hides the modal and calls EditorUtil', () => {
		EditorUtil.getOrderedList.mockReturnValue([])
		const props = {
			navState: {}
		}
		const component = mount(<EditorNav {...props} />)

		component.instance().addAssessment()
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addAssessment.mock.calls[0][0].title).toMatchSnapshot()

		component.instance().addAssessment('    ')
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addAssessment.mock.calls[1][0].title).toMatchSnapshot()

		component.instance().addAssessment('Assessment title')
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addAssessment.mock.calls[2][0].title).toMatchSnapshot()
	})

	test('addPage hides the modal and calls EditorUtil', () => {
		EditorUtil.getOrderedList.mockReturnValue([])
		const props = {
			navState: {}
		}
		const component = mount(<EditorNav {...props} />)

		component.instance().addPage()
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addPage.mock.calls[0][0].title).toMatchSnapshot()

		component.instance().addPage('    ')
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addPage.mock.calls[1][0].title).toMatchSnapshot()

		component.instance().addPage('Page title')
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.addPage.mock.calls[2][0].title).toMatchSnapshot()
	})
})
