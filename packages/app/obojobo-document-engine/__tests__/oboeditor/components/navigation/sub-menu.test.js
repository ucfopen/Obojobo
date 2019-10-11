import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
import Common from 'src/scripts/common'
import EditorStore from 'src/scripts/oboeditor/stores/editor-store'
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
import ModalUtil from 'src/scripts/common/util/modal-util'
import React from 'react'
import SubMenu from 'src/scripts/oboeditor/components/navigation/sub-menu'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('src/scripts/oboeditor/util/editor-util')

jest.mock('src/scripts/oboeditor/stores/editor-store', () => {
	return {
		state: { startingId: null }
	}
})

jest.mock('src/scripts/oboeditor/util/clipboard-util')
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
				getIndex: () => 1,
				get: type => type === 'type' ? 'ObojoboDraft.Chunks.Page' : {
					id: 'mock-id',
					title: 'Mock title',
					triggers: []
				}
			},
			'7': {
				isFirst: () => false,
				isLast: () => false,
				getIndex: () => 2,
				get: type => type === 'type' ? 'ObojoboDraft.Chunks.Page' : {
					id: 'mock-id',
					title: 'Mock title',
					triggers: []
				}
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

	test('SubMenu component selected', () => {
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

	test('SubMenu component selected as assessment', () => {
		const itemList = [
			{
				id: 6,
				type: 'link',
				label: 'label6',
				flags: {
					assessment: true
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
})
