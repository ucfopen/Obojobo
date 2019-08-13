import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
import EditorNav from 'src/scripts/oboeditor/components/editor-nav'
import EditorStore from 'src/scripts/oboeditor/stores/editor-store'
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
import ModalUtil from 'src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('src/scripts/oboeditor/util/editor-util')
jest.mock('src/scripts/oboeditor/util/clipboard-util')
jest.mock('src/scripts/common/util/modal-util')
// SubMenu
jest.mock('src/scripts/oboeditor/components/sub-menu')

// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null, itemsById: { mockStartingId: { label: 'theLabel' } } }
}))

describe('EditorNav', () => {
	beforeAll(() => {
		document.getSelection = jest.fn()
		document.execCommand = jest.fn()
	})
	beforeEach(() => {
		EditorStore.state.startingId = null
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

		component.instance().onNavItemClick({
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
		EditorUtil.getOrderedList.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('EditorNav component clicks Delete button to remove starting page', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		EditorStore.state.startingId = 'mockStartingId'

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(EditorUtil.setStartPage).toHaveBeenCalled()
	})

	test('EditorNav component clicks Add Assessment button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
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

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('EditorNav component clicks Copy URL button', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('renameModule resets title with empty name', () => {
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

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().renameModule('MockID', '  ')

		expect(EditorUtil.renamePage).toHaveBeenCalledWith('MockID', '(Unnamed Module)')
	})

	test('renameModule resets title', () => {
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

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().renameModule('MockID', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalledWith('MockID', 'mock title')
	})

	test('addPage resets title with empty name', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 6,
					type: 'heading',
					label: 'label6',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().addPage('  ')

		expect(EditorUtil.addPage).toHaveBeenCalled()
	})

	test('addPage resets title', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 6,
					type: 'heading',
					label: 'label6',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().addPage()

		expect(EditorUtil.addPage).toHaveBeenCalled()
	})

	test('addAssessment resets title with empty name', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 6,
					type: 'heading',
					label: 'label6',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().addAssessment('  ')

		expect(EditorUtil.addAssessment).toHaveBeenCalled()
	})

	test('addAssessment resets title', () => {
		EditorUtil.getOrderedList
			.mockReturnValueOnce([
				{
					id: 6,
					type: 'heading',
					label: 'label6',
					flags: {
						assessment: true
					}
				}
			])
			.mockReturnValueOnce([])

		const props = { navState: {} }
		const component = mount(<EditorNav {...props} />)

		component.instance().addAssessment()

		expect(EditorUtil.addAssessment).toHaveBeenCalled()
	})
})
