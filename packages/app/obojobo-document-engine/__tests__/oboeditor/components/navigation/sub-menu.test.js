import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ClipboardUtil from '../../../../src/scripts/oboeditor/util/clipboard-util'
import Common from '../../../../src/scripts/common'
import EditorUtil from '../../../../src/scripts/oboeditor/util/editor-util'
import SubMenu from '../../../../src/scripts/oboeditor/components/navigation/sub-menu'
import MoreInfoBox from '../../../../src/scripts/oboeditor/components/navigation/more-info-box'

jest.mock('../../../../src/scripts/oboeditor/util/editor-util', () => ({
	renamePage: jest.fn(),
	movePage: jest.fn(),
	addPage: jest.fn(),
	rebuildMenu: jest.fn(),
	deletePage: jest.fn(),
}))

jest.mock('../../../../src/scripts/common', () => ({
	models: {
		OboModel: {}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		}
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	Registry: {
		getItems: funct => {
			return funct({
				values: () => [
					{
						isInsertable: true,
						icon: null,
						name: 'mockItem',
						templateObject: 'mockNode',
						cloneBlankNode: () => ({ type: 'mockNode' })
					}
				]
			})
		}
	}
}))

jest.mock('../../../../src/scripts/oboeditor/util/editor-util')
jest.mock('../../../../src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null }
}))
// jest.mock('src/scripts/oboeditor/util/clipboard-util')
// jest.mock('src/scripts/common/util/modal-util')
jest.mock('../../../../src/scripts/oboeditor/components/navigation/more-info-box', () => {
	return props => <div mockname="MockMoreInfoBox" >{JSON.stringify(props, null, 2)}</div>
})

jest.useFakeTimers()

describe('SubMenu', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		let mockGet = key => {
			switch(key){
				case 'type':
					return 'mock-type'
				case 'content':
					return 'mock-content'
			}
		}

		Common.models.OboModel.models = {
			'5': {
				isFirst: () => true,
				isLast: () => false,
				getIndex: () => 0,
				get: mockGet
			},
			'6': {
				isFirst: () => false,
				isLast: () => true,
				getIndex: () => 1,
				get: mockGet
			},
			'7': {
				isFirst: () => false,
				isLast: () => false,
				getIndex: () => 2,
				get: mockGet
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
			.at(0)
			.simulate('click')

		expect(parentOnClick).toHaveBeenCalled()
	})

	test.skip('SubMenu component moves page up', () => {
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
			.at(1)
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalledWith(7, 1)
	})

	test.skip('SubMenu component moves page down', () => {
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
			.at(2)
			.simulate('click')

		expect(EditorUtil.movePage).toHaveBeenCalledWith(7, 3)
	})

	test.skip('SubMenu component edits page name', () => {
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
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

		const component = mount(
			<SubMenu index={0} list={itemList} />
		)

		component.instance().deletePage()

		expect(EditorUtil.deletePage).toHaveBeenCalled()
	})

	test.skip('SubMenu component copies id to clipboard', () => {
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
			.at(6)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test.skip('SubMenu component sets start page', () => {
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
			.find('button') // [Link, Move Up, Move Down, Edit Name, Set Start, Delete, ID]
			.at(4)
			.simulate('click')

		expect(EditorUtil.setStartPage).toHaveBeenCalled()
	})

	test.skip('SubMenu component opens menu', () => {
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

	test.skip('SubMenu component closes menu', () => {
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

	test.skip('SubMenu component moves down through the menu', () => {
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

	test.skip('SubMenu component moves up through the menu', () => {
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

	test.skip('SubMenu component closes menu when unfocused', () => {
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

	test.skip('SubMenu component cancels menu closure when focused', () => {
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
