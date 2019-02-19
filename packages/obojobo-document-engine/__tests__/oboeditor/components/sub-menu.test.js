import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import Common from 'src/scripts/common'

import SubMenu from 'src/scripts/oboeditor/components/sub-menu'

import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
jest.mock('src/scripts/oboeditor/util/editor-util')
import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
jest.mock('src/scripts/oboeditor/util/clipboard-util')
import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

jest.useFakeTimers()

describe('SubMenu', () => {
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
			},
			'7': {
				isFirst: () => false,
				isLast: () => false,
				getIndex: () => 2
			}
		}
	})

	test('SubMenu component', () => {
		const itemList = [
			{
				id: 5,
				type: 'link',
				label: 'label5',
				contentType: 'Page',
				flags: {
					assessment: false
				}
			}
		]
		const component = renderer.create(<SubMenu index={0} isSelected={false} list={itemList} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('SubMenu component selected with no contentType', () => {
		const itemList = [
			{
				id: 6,
				type: 'link',
				label: 'label6',
				flags: {
					assessment: false
				}
			}
		]
		const component = renderer.create(<SubMenu index={0} isSelected={true} list={itemList} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('SubMenu component calls parent onClick function', () => {
		const itemList = [
			{
				id: 6,
				type: 'link',
				label: 'label6',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(0)
			.simulate('click')

		expect(parentOnClick).toHaveBeenCalled()
	})

	test('SubMenu component moves page up', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(1)
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalledWith(7, 1)
	})

	test('SubMenu component moves page down', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(2)
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalledWith(7, 3)
	})

	test('SubMenu component edits page name', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(3)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('renamePage edits page name with empty label', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component.instance().renamePage(7, '  ')

		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renamePage edits page name', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component.instance().renamePage(7, 'mock title')

		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('SubMenu component deletes page', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(4)
			.simulate('click')

		expect(EditorUtil.deletePage).toHaveBeenCalled()
	})

	test('SubMenu component copies id to clipboard', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		component
			.find('button') // [Link, Move Up, Move Down, Edit Name, Delete, ID]
			.at(5)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('SubMenu component opens menu', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowRight'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('SubMenu component closes menu', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowLeft'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('SubMenu component moves down through the menu', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowDown'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('SubMenu component moves up through the menu', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowUp'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('SubMenu component closes menu when unfocused', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('SubMenu component cancels menu closure when focused', () => {
		const itemList = [
			{
				id: 7,
				type: 'link',
				label: 'label7',
				flags: {
					assessment: false
				}
			}
		]
		const parentOnClick = jest.fn()
		const component = mount(
			<SubMenu index={0} isSelected={true} list={itemList} onClick={parentOnClick} />
		)

		const html = component
			.find('li')
			.at(0)
			.simulate('focus')
			.html()

		expect(html).toMatchSnapshot()
	})
})
