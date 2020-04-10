import Header from 'src/scripts/oboeditor/components/navigation/header'
import React from 'react'
import Common from 'src/scripts/common'
import { mount } from 'enzyme'

import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
jest.mock('src/scripts/oboeditor/util/editor-util')

describe('Header', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		Common.models.OboModel.models = {
			'5': {
				isFirst: () => true,
				isLast: () => false,
				getIndex: () => 0,
				get: jest.fn(),
				set: jest.fn(),
				setId: jest.fn(),
				getRoot: jest.fn()
			}
		}
	})

	test('Header component', () => {
		const props = {
			index: 0,
			list: [
				{
					id: '5',
					type: 'header',
					label: 'label5',
					contentType: 'Page',
					flags: {
						assessment: false
					}
				}
			]
		}
		const component = mount(<Header {...props} />)
		expect(component.html()).toMatchSnapshot()
	})

	test('saveContent updates the model', () => {
		const props = {
			index: 0,
			list: [
				{
					id: '5',
					type: 'header',
					label: 'label5',
					contentType: 'Page',
					flags: {
						assessment: false
					}
				}
			]
		}
		const component = mount(<Header {...props} />)
		component.instance().saveContent({}, {})
		component.instance().saveContent(
			{},
			{
				triggers: [],
				title: '     '
			}
		)
		component.instance().saveContent(
			{},
			{
				triggers: [],
				title: 'Mock Title'
			}
		)

		expect(Common.models.OboModel.models['5'].set).toHaveBeenCalledTimes(3)
	})

	test('saveId updates the model', () => {
		const props = {
			index: 0,
			list: [
				{
					id: '5',
					type: 'header',
					label: 'label5',
					contentType: 'Page',
					flags: {
						assessment: false
					}
				}
			]
		}
		const component = mount(<Header {...props} />)
		Common.models.OboModel.models['5'].setId.mockReturnValueOnce(true)
		component.instance().saveId('5', 'mock-id')

		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
	})

	test('saveId does not allow an empty id', () => {
		const props = {
			index: 0,
			list: [
				{
					id: '5',
					type: 'header',
					label: 'label5',
					contentType: 'page',
					flags: {
						assessment: false
					}
				}
			]
		}
		const component = mount(<Header {...props} />)
		component.instance().saveId('5', '')

		expect(Common.models.OboModel.models['5'].setId).not.toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).not.toHaveBeenCalled()
	})

	test('saveId does not update the model', () => {
		const props = {
			index: 0,
			list: [
				{
					id: '5',
					type: 'header',
					label: 'label5',
					contentType: 'Page',
					flags: {
						assessment: false
					}
				}
			]
		}
		const component = mount(<Header {...props} />)
		Common.models.OboModel.models['5'].setId.mockReturnValueOnce(false)
		component.instance().saveId('5', 'mock-id')

		expect(EditorUtil.rebuildMenu).not.toHaveBeenCalled()
	})
})
