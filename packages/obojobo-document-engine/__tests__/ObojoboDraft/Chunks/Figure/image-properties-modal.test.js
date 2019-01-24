import React from 'react'
import { mount } from 'enzyme'

import ImageProperties from 'ObojoboDraft/Chunks/Figure/image-properties-modal'

describe('Image Properties Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('ImageProperties component with custom size', () => {
		const component = mount(<ImageProperties content={{ size: 'custom' }} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('ImageProperties component', () => {
		const component = mount(<ImageProperties content={{}} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('ImageProperties component calls onConfirm from props', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('ImageProperties component focuses on first element', () => {
		const component = mount(<ImageProperties content={{}} />)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes url', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes alt text', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes size', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{ size: 'custom' }} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { value: '1' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes width', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{ size: 'custom' }} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(7)
			.simulate('change', { target: { value: '1' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes height', () => {
		const onConfirm = jest.fn()

		const component = mount(<ImageProperties content={{ size: 'custom' }} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(8)
			.simulate('change', { target: { value: '1' } })

		expect(component.html()).toMatchSnapshot()
	})
})
