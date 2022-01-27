import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import InsertMenu from 'src/scripts/oboeditor/components/node/components/insert-menu'
import BoldIcon from 'src/scripts/oboeditor/assets/bold-icon'

jest.useFakeTimers()

const testOptions = [
	{
		isInsertable: true,
		name: 'dummyItem1',
		icon: BoldIcon,
		components: {}
	},
	{
		separator: true
	},
	{
		isInsertable: false,
		name: 'dummyItem2',
		components: {}
	}
]

describe('InsertMenu', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('InsertMenu component', () => {
		const component = renderer.create(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('InsertMenu component calls parent onClick function', () => {
		const parentOnClick = jest.fn()
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={parentOnClick} />
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(parentOnClick).toHaveBeenCalled()
	})

	test('InsertMenu component opens menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component
			.find('button')
			.at(0)
			.simulate('click')
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component closes menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} onBlur={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'Escape'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component moves down through the menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowDown'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component moves down through the menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowLeft'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component moves up through the menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowUp'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component moves down through the menu', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowRight'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component closes menu when unfocused', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} onBlur={jest.fn()} />
		)

		const html = component.simulate('blur').html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('InsertMenu component cancels menu closure when focused', () => {
		const component = mount(
			<InsertMenu dropOptions={testOptions} icon="+" masterOnClick={jest.fn()} />
		)

		const html = component.simulate('focus').html()

		expect(html).toMatchSnapshot()
	})
})
