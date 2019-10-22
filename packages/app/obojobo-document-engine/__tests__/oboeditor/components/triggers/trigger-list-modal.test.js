import { mount, shallow } from 'enzyme'
import React from 'react'

import TriggerListModal from '../../../../src/scripts/oboeditor/components/triggers/trigger-list-modal'

describe('TriggerListModal', () => {
	test('TriggerListModal node', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'nav:goto', value: {} },
						{ type: 'nav:openExternalLink', value: {} },
						{ type: 'assessment:startAttempt', value: {} },
						{ type: 'assessment:endAttempt', value: {} },
						{ type: 'viewer:alert', value: {} },
						{ type: 'viewer:scrollToTop', value: {} },
						{ type: 'focus:component', value: {} },
						{ type: 'nav:prev', value: {} }
					]
				}
			]
		}
		const component = shallow(<TriggerListModal content={content} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('TriggerListModal node deletes trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }]
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

	test('TriggerListModal node deletes an action', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }, { type: 'nav:prev', value: {} }]
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

	test('TriggerListModal node adds an action', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }]
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

	test('TriggerListModal node adds a trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }]
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

	test('TriggerListModal node closes', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }]
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

	test('TriggerListModal node changes trigger', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }]
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
				target: { value: 'onNavEnter' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('TriggerListModal node changes action', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }, { type: 'nav:next', value: {} }]
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
				target: { value: 'nav:prev' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('TriggerListModal node changes action value', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: {} }, { type: 'nav:goto', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const component = mount(<TriggerListModal content={content} />)

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: { value: 'mock-id' }
			})

		component
			.find('input')
			.at(2)
			.simulate('change', { target: null })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
