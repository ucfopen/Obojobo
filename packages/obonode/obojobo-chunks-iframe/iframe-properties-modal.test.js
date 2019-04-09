import React from 'react'
import { mount } from 'enzyme'

import IFrameProperties from './iframe-properties-modal'

describe('IFrame Properties Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('IFrameProperties component', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('IFrameProperties component calls onConfirm from props', () => {
		const onConfirm = jest.fn()

		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
				onConfirm={onConfirm}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('IFrameProperties component focuses on first element', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes title', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes src', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes border', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { checked: false } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes fit', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes width', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(4)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes height', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(5)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes initial zoom', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(6)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes autoload', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(7)
			.simulate('change', { target: { checked: true } })

		expect(component.html()).toMatchSnapshot()
	})

	test('IFrameProperties component changes IFrame controls', () => {
		const component = mount(
			<IFrameProperties
				content={{
					controls: '',
					border: false,
					initialZoom: 1
				}}
			/>
		)

		component
			.find('input')
			.at(8)
			.simulate('change', { target: { checked: false } })

		component
			.find('input')
			.at(9)
			.simulate('change', { target: { checked: true } })

		component
			.find('input')
			.at(10)
			.simulate('change', { target: { checked: true } })

		expect(component.html()).toMatchSnapshot()
	})
})
