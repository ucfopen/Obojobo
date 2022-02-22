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
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const elements = [{ id: 3, type: 'mockType' }, { id: 4, type: 'mockType' }]
		const component = shallow(
			<TriggerListModal content={content} navItems={navItems} elements={elements} />
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('renders actions with id select boxes', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'nav:goto', value: { id: '' } },
						{ type: 'assessment:startAttempt', value: { id: '' } },
						{ type: 'assessment:endAttempt', value: { id: '' } },
						{ type: 'focus:component', value: { id: '' } }
					]
				}
			]
		}
		const navItems = [
			{ id: 1, type: 'mockType', flags: {} },
			{ id: 2, type: 'mockType', flags: { assessment: true } }
		]
		const elements = [{ id: 3, type: 'mockType' }, { id: 4, type: 'mockType' }]
		const component = shallow(
			<TriggerListModal content={content} navItems={navItems} elements={elements} />
		)
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
					actions: [{ type: 'nav:goto', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = shallow(<TriggerListModal content={content} navItems={navItems} />)

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
					actions: [{ type: 'nav:goto', value: {} }, { type: 'nav:prev', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = shallow(<TriggerListModal content={content} navItems={navItems} />)

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
					actions: [{ type: 'nav:goto', value: { id: '' } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'link' }, { id: 2, type: 'link' }]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

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
					actions: [{ type: 'nav:goto', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

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
					actions: [{ type: 'nav:goto', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const close = jest.fn()
		const component = mount(
			<TriggerListModal content={content} onClose={close} navItems={navItems} />
		)

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

	test('unmounts when there is no close prop', () => {
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
					actions: [{ type: 'nav:goto', value: {} }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

		component
			.find('select')
			.at(0)
			.simulate('change', {
				target: { value: 'onNavEnter' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changes action type', () => {
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
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

		component
			.find('select')
			.at(1)
			.simulate('change', {
				target: { value: 'nav:prev' }
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changes action value', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'nav:goto', value: { id: 1 } }, { type: 'nav:goto', value: { id: 2 } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const navItems = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

		// make sure this is the expected label/input combo
		const inputLabel = component.find('label').at(2)
		expect(inputLabel.props().children).toBe('Page')

		// change the value
		component
			.find('select')
			.at(2)
			.simulate('change', { target: { type: 'select-one', value: 2 } })

		// check that the value changed
		expect(
			component
				.find('select')
				.at(2)
				.props()
		).toHaveProperty('value', 2)

		// check the change to state
		expect(component.state()).toHaveProperty('triggers')
		expect(component.state().triggers[0].actions).toContainEqual({
			type: 'nav:goto',
			value: { id: 2 }
		})

		// check the rendered component
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changes scroll type', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'focus:component', value: { id: 1 } },
						{ type: 'focus:component', value: { id: 1 } }
					]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const elements = [{ id: 1, type: 'mockType' }, { id: 2, type: 'mockType' }]
		const component = mount(<TriggerListModal content={content} elements={elements} />)

		component
			.find('select')
			.at(3)
			.simulate('change', {
				target: { value: 'animateScroll' }
			})
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('animateScroll', true)
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('preventScroll', false)

		component
			.find('select')
			.at(3)
			.simulate('change', {
				target: { value: 'preventScroll' }
			})
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('animateScroll', false)
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('preventScroll', true)

		component
			.find('select')
			.at(3)
			.simulate('change', {
				target: { value: 'jumpScroll' }
			})
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('animateScroll', false)
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('preventScroll', false)
	})

	test('updateActionValue using a switch/checkbox', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'focus:component', value: { fade: false } }]
				},
				{
					type: 'onUnmount',
					actions: []
				}
			]
		}
		const elements = [{ id: 1 }, { id: 2 }]
		const component = mount(<TriggerListModal content={content} elements={elements} />)
		const input = component.find(Switch).find('input')
		input.simulate('change', { target: { type: 'checkbox', checked: true } })
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('fade', true)

		input.simulate('change', { target: { type: 'checkbox', checked: false } })
		expect(component.state().triggers[0].actions[0].value).toHaveProperty('fade', false)
	})

	test('getScrollType returns correct value', () => {
		const action = {
			value: {
				animateScroll: false,
				preventScroll: false
			}
		}

		expect(TriggerListModal.prototype.getScrollType(action)).toBe('jumpScroll')

		action.value.preventScroll = true
		expect(TriggerListModal.prototype.getScrollType(action)).toBe('preventScroll')

		action.value.animateScroll = true
		expect(TriggerListModal.prototype.getScrollType(action)).toBe('animateScroll')
		action.value.preventScroll = false
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
		'createNewDefaultActionValueObject($type) creates a new default action value object',
		({ type }) => {
			expect(TriggerListModal.prototype.createNewDefaultActionValueObject(type)).toMatchSnapshot()
		}
	)

	test('createNewDefaultActionValueObject selects assessment by id for start/end attempt triggers', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [{ type: 'assessment:startAttempt', value: { id: 2 } }]
				}
			]
		}
		const navItems = [
			{ id: 1, type: 'mockType', flags: {} },
			{ id: 2, type: 'mockType', flags: { assessment: true } }
		]
		const component = mount(<TriggerListModal content={content} navItems={navItems} />)

		expect(
			component.instance().createNewDefaultActionValueObject('assessment:startAttempt')
		).toEqual({ id: 2 })
		expect(component.instance().createNewDefaultActionValueObject('assessment:endAttempt')).toEqual(
			{ id: 2 }
		)
	})

	test('getElementText returns expected values', () => {
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Text',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('TEXT: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Text',
				content: { textGroup: [{ text: { value: 'very long mock text that is very long' } }] }
			})
		).toBe('TEXT: very long mock text that is very l...')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Text',
				content: {}
			})
		).toBe('TEXT: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Heading',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('HEADING: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Heading',
				content: {}
			})
		).toBe('HEADING: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Figure',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('FIGURE: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Figure',
				content: {}
			})
		).toBe('FIGURE: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.ActionButton',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('BUTTON: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.ActionButton',
				content: {}
			})
		).toBe('BUTTON: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.List',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('LIST: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.List',
				content: {}
			})
		).toBe('LIST: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Table',
				content: { textGroup: { textGroup: [{ text: { value: 'mock text' } }] } }
			})
		).toBe('TABLE: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Table',
				content: { textGroup: {} }
			})
		).toBe('TABLE: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Break'
			})
		).toBe('BREAK')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.MathEquation',
				content: { latex: 'mock latex' }
			})
		).toBe('MATH: mock latex')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Code',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('CODE: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Code',
				content: {}
			})
		).toBe('CODE: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.YouTube'
			})
		).toBe('YouTube Video')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.IFrame',
				content: { title: 'mock title' }
			})
		).toBe('IFRAME: mock title')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.IFrame',
				content: { src: 'mock source' }
			})
		).toBe('IFRAME: mock source')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.IFrame',
				content: {}
			})
		).toBe('IFRAME: No source!')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Question',
				children: [
					{
						content: { textGroup: [{ text: { value: 'mock text' } }] }
					}
				]
			})
		).toBe('QUESTION: mock text')
		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.Question',
				children: [
					{
						content: {}
					}
				]
			})
		).toBe('QUESTION: new node')

		expect(
			TriggerListModal.prototype.getElementText({
				type: 'ObojoboDraft.Chunks.QuestionBank',
				content: { textGroup: [{ text: { value: 'mock text' } }] }
			})
		).toBe('QUESTION BANK')
	})
})
