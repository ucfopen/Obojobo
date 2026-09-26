import { mount, shallow } from 'enzyme'
import React from 'react'

import Switch from '../../../../src/scripts/common/components/switch'
import TriggerListModal from '../../../../src/scripts/oboeditor/components/triggers/trigger-list-modal'

describe('TriggerListModal', () => {
	test('renders all options', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'nav:goto', updated: {} },
						{ type: 'nav:openExternalLink', updated: {} },
						{ type: 'assessment:startAttempt', updated: {} },
						{ type: 'assessment:endAttempt', updated: {} },
						{ type: 'viewer:alert', updated: {} },
						{ type: 'viewer:scrollToTop', updated: {} },
						{ type: 'focus:component', updated: {} },
						{ type: 'nav:prev', updated: {} }
					]
				}
			]
		}
		const component = shallow(<TriggerListModal content={content} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('renders if given no triggers', () => {
		const component = shallow(<TriggerListModal content={{}} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('deletes trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = shallow(<TriggerListModal content={content} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('deletes an action', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }, { type: 'nav:prev', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = shallow(<TriggerListModal content={content} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('adds an action', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('button')
			.at(3)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('adds a trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('button')
			.at(6)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('node closes', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const close = jest.fn()
		const component = mount(<TriggerListModal content={content} onClose={close} />)

		component
			.find('button')
			.at(7)
			.simulate('click')

		expect(close).toHaveBeenCalled()
	})

	test('calls close on unmount', () => {
		const content = { triggers: [] }
		const close = jest.fn()
		const component = mount(<TriggerListModal content={content} onClose={close} />)

		expect(close).not.toHaveBeenCalled()
		component.unmount()
		expect(close).toHaveBeenCalledWith()
	})

	test('unounts when there is no close prop', () => {
		const content = { triggers: [] }
		const component = mount(<TriggerListModal content={content} />)

		expect(function() {
			component.unmount()
		}).not.toThrow()
	})

	test('changes trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('select')
			.at(0)
			.simulate('change', {
				target: { updated: 'onNavEnter' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changes action type', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: {} }, { type: 'nav:next', updated: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('select')
			.at(1)
			.simulate('change', {
				target: { updated: 'nav:prev' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changes action updated', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: { id: 1 } }, { type: 'nav:goto', updated: { id: 2 } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		// make sure this is the expected label/input combo
		const inputLabel = component.find('label').at(2)
		expect(inputLabel.props().children).toBe('Item Id')

		// change the updated
		component
			.find('input')
			.at(3)
			.simulate('change', { target: { type: 'text', updated: '10' } })

		// check that the updated changed
		expect(
			component
				.find('input')
				.at(3)
				.props()
		).toHaveProperty('updated', '10')

		// check the change to state
		expect(component.state()).toHaveProperty('triggers')
		expect(component.state().triggers[0].actions).toContainEqual({
			type: 'nav:goto',
			updated: { id: '10' }
		})

		// check the rendered component
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('sets updated that was previously undefined', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', updated: { id: 1 } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		// make sure this is the expected label/input combo
		const inputLabel = component.find('label').at(2)
		expect(inputLabel.props().children).toBe('Item Id')

		expect(
			component
				.find('input')
				.at(2)
				.props()
		).toHaveProperty('checked', true)

		// change the updated
		component
			.find('input')
			.at(2)
			.simulate('change', { target: { type: 'boolean', updated: false } })

		// check that the updated changed
		expect(
			component
				.find('input')
				.at(2)
				.props()
		).toHaveProperty('checked', false)

		// check the change to state
		expect(component.state()).toHaveProperty('triggers')
		expect(component.state().triggers[0].actions).toContainEqual({
			type: 'nav:goto',
			updated: { id: 1, ignoreLock: false }
		})
	})

	test('changes scroll type', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'focus:component', updated: { id: 1 } },
						{ type: 'focus:component', updated: { id: 1 } }
					]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('select')
			.at(2)
			.simulate('change', {
				target: { updated: 'animateScroll' }
			})
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('animateScroll', true)
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('preventScroll', false)

		component
			.find('select')
			.at(2)
			.simulate('change', {
				target: { updated: 'preventScroll' }
			})
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('animateScroll', false)
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('preventScroll', true)

		component
			.find('select')
			.at(2)
			.simulate('change', {
				target: { updated: 'jumpScroll' }
			})
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('animateScroll', false)
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('preventScroll', false)
	})

	test('updateActionValue using a switch/checkbox', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'focus:component', updated: { fade: false } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)
		const input = component.find(Switch).find('input')
		input.simulate('change', { target: { type: 'checkbox', checked: true } })
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('fade', true)

		input.simulate('change', { target: { type: 'checkbox', checked: false } })
		expect(component.state().triggers[0].actions[0].updated).toHaveProperty('fade', false)
	})

	test('getScrollType returns correct updated', () => {
		const action = {
			updated: {
				animateScroll: false,
				preventScroll: false
			}
		}

		expect(TriggerListModal.prototype.getScrollType(action)).toBe('jumpScroll')

		action.updated.preventScroll = true
		expect(TriggerListModal.prototype.getScrollType(action)).toBe('preventScroll')

		action.updated.animateScroll = true
		expect(TriggerListModal.prototype.getScrollType(action)).toBe('animateScroll')
		action.updated.preventScroll = false
		expect(TriggerListModal.prototype.getScrollType(action)).toBe('animateScroll')
	})

	test.each`
		type
		${'nav:goto'}
		${'nav:prev'}
		${'nav:next'}
		${'nav:openExternalLink'}
		${'nav:lock'}
		${'nav:unlock'}
		${'nav:open'}
		${'nav:close'}
		${'nav:toggle'}
		${'assessment:startAttempt'}
		${'assessment:endAttempt'}
		${'viewer:alert'}
		${'viewer:scrollToTop'}
		${'focus:component'}
	`(
		'createNewDefaultActionValueObject($type) creates a new default action updated object',
		({ type }) => {
			expect(TriggerListModal.prototype.createNewDefaultActionValueObject(type)).toMatchSnapshot()
		}
	)
})
