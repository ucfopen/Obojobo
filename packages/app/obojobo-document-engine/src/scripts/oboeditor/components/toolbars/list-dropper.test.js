import { mount, shallow } from 'enzyme'
import React from 'react'

import ListDropper from './list-dropper'

const LIST_NODE = 'ObojoboDraft.Chunks.List'

jest.useFakeTimers()

describe('List Dropper', () => {
	test('List Dropper node', () => {
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = shallow(<ListDropper type="unordered" bullets={bullets} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('List Dropper toggles bullet', () => {
		const editor = {
			changeToType: jest.fn(),
			children: [
				{
					type: 'mock-type',
					children: [{ text: '' }]
				}
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="ordered" bullets={bullets} editor={editor} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.changeToType).toHaveBeenCalled()
	})

	test('List Dropper toggles bullet on list', () => {
		const editor = {
			changeToType: jest.fn(),
			children: [
				{
					type: LIST_NODE,
					content: { listStyles: { type: 'unordered' } },
					children: [{ text: '' }]
				}
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="ordered" bullets={bullets} editor={editor} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.changeToType).toHaveBeenCalled()
	})

	test('List Dropper toggles bullet to text', () => {
		const editor = {
			changeToType: jest.fn(),
			children: [
				{
					type: LIST_NODE,
					content: { listStyles: { type: 'ordered' } },
					children: [{ text: '' }]
				}
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="ordered" bullets={bullets} editor={editor} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.changeToType).toHaveBeenCalled()
	})

	test('List Dropper node opens and closes', () => {
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="unordered" bullets={bullets} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('List Dropper changes bullet', () => {
		const editor = {
			changeToType: jest.fn()
		}
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="unordered" bullets={bullets} editor={editor} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.changeToType).toHaveBeenCalled()
	})

	test('List Dropper component opens and closes menu with keys', () => {
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = mount(<ListDropper type="unordered" bullets={bullets} />)

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

	test('List Dropper component moves up and down with keys', () => {
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = shallow(<ListDropper type="unordered" bullets={bullets} />)

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

	test('List Dropper component closes menu when unfocused', () => {
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = shallow(<ListDropper type="unordered" bullets={bullets} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('List Dropper component cancels menu closure when focused', () => {
		navigator.__defineGetter__('platform', () => 'Mock Mac')
		const bullets = [{ bulletStyle: 'disc', display: '●' }, { bulletStyle: 'circle', display: '○' }]
		const component = shallow(<ListDropper type="unordered" bullets={bullets} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('focus')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})
})
