import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import DropMenu from 'src/scripts/oboeditor/components/drop-menu'

jest.useFakeTimers()

const testOptions = [
	{
		name: 'dummyItem1',
		components: {}
	},
	{
		name: 'dummyItem2',
		onClick: jest.fn(),
		components: {}
	}
]

describe('DropMenu', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('DropMenu component', () => {
		const component = renderer.create(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('DropMenu component calls parent onClick function', () => {
		const parentOnClick = jest.fn()
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={parentOnClick} />
		)
		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(parentOnClick).toHaveBeenCalled()
	})

	test('DropMenu component calls individual onClick function', () => {
		const parentOnClick = jest.fn()
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={parentOnClick} />
		)
		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(testOptions[1].onClick).toHaveBeenCalled()
	})

	test('DropMenu component opens menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.find('button')
			.at(0)
			.simulate('click')
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component closes menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'Escape'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component moves down through the menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowDown'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component moves down through the menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowLeft'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component moves up through the menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowUp'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component moves down through the menu', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('keyDown', {
				key: 'ArrowRight'
			})
			.html()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component closes menu when unfocused', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('DropMenu component cancels menu closure when focused', () => {
		const component = mount(
			<DropMenu
				dropOptions={testOptions}
				icon="+"
				masterOnClick={jest.fn()} />
		)

		const html = component
			.simulate('focus')
			.html()

		expect(html).toMatchSnapshot()
	})
})
