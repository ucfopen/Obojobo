import { mount, shallow } from 'enzyme'
import React from 'react'

import DropDownMenu from './drop-down-menu'

jest.useFakeTimers()

describe('Drop Down Menu', () => {
	test('DropDownMenu node', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = shallow(<DropDownMenu name="MockMenu" menu={menu} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('DropDownMenu node with toggle-action', () => {
		const menu = [
			{ name: 'Show Placeholders', type: 'toggle-action', action: jest.fn(), value: true },
			{ name: 'Show Placeholders', type: 'toggle-action', action: jest.fn(), value: false }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('DropDownMenu node with sub-menu', () => {
		navigator.__defineGetter__('platform', () => 'Mock Mac')
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn(), shortcutMac: 'mock shortcut' },
			{
				name: 'subMenu',
				type: 'sub-menu',
				menu: [{ name: 'SubItem', type: 'action', action: jest.fn() }]
			}
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('DropDownMenu node opens and closes', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('DropDownMenu component opens and closes menu with keys', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowRight',
				stopPropagation: jest.fn()
			})

		expect(component.html()).toMatchSnapshot()

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowLeft',
				stopPropagation: jest.fn()
			})

		expect(component.html()).toMatchSnapshot()
	})

	test('DropDownMenu component moves up and down with keys', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowUp',
				stopPropagation: jest.fn()
			})

		expect(component.state()).toMatchSnapshot()

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowDown',
				stopPropagation: jest.fn()
			})

		expect(component.state()).toMatchSnapshot()
	})

	test('DropDownMenu component closes menu when unfocused', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('DropDownMenu component cancels menu closure when focused', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('focus')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})
})
