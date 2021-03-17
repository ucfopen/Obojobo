import { mount, shallow } from 'enzyme'
import React from 'react'

import DropDownMenu from '../../../../src/scripts/oboeditor/components/toolbars/drop-down-menu'

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
		let component = mount(<DropDownMenu name="MockMenu" menu={menu} isOpen={true} />)
		expect(component.html()).toMatchSnapshot()

		component = mount(<DropDownMenu name="MockMenu" menu={menu} isOpen={false} />)
		expect(component.html()).toMatchSnapshot()
	})

	test('DropDownMenu component opens and closes menu with keys', () => {
		const close = jest.fn()
		const toggleOpen = jest.fn()
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(
			<DropDownMenu
				name="MockMenu"
				menu={menu}
				isOpen={true}
				close={close}
				toggleOpen={toggleOpen}
			/>
		)

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowRight',
				stopPropagation: jest.fn()
			})

		expect(toggleOpen).not.toHaveBeenCalled()

		component.setProps({ isOpen: false })

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowRight',
				stopPropagation: jest.fn()
			})

		expect(toggleOpen).toHaveBeenCalled()

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowLeft',
				stopPropagation: jest.fn()
			})

		expect(close).toHaveBeenCalled()
	})

	test('DropDownMenu component moves up and down with keys', () => {
		const menu = [
			{ name: 'Undo', type: 'action', action: jest.fn() },
			{ name: 'Redo', type: 'action', action: jest.fn() }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} isOpen={true} />)

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

	test('DropDownMenu component handles mouse enter', () => {
		const menu = [
			{ name: 'mock-action', type: 'action', action: jest.fn() },
			{ name: 'mock-toggle', type: 'toggle-action', action: jest.fn() },
			{ name: 'mock-menu', type: 'sub-menu', action: jest.fn(), menu: [{}] }
		]
		const component = mount(<DropDownMenu name="MockMenu" menu={menu} isOpen={true} />)

		expect(component.instance().state.currentFocus).toBe(0)

		component
			.find('button')
			.at(2)
			.simulate('mouseenter')

		expect(component.instance().state.currentFocus).toBe(1)

		component
			.find('button')
			.at(3)
			.simulate('mouseenter')

		expect(component.instance().state.currentFocus).toBe(2)

		component
			.find('button')
			.at(1)
			.simulate('mouseenter')

		expect(component.instance().state.currentFocus).toBe(0)
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
