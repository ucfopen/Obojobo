import React from 'react'
import { mount } from 'enzyme'

import RangeModal from 'ObojoboDraft/Sections/Assessment/post-assessment/range-modal'

describe('Range Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('RangeModal component with single number', () => {
		const component = mount(<RangeModal for="100" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component', () => {
		const component = mount(<RangeModal for="[0,100]" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component calls onConfirm from props', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('RangeModal component calls onConfirm from props with single value', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="100" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('RangeModal component does not call confirm when for is above 100', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="10000" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component does not call confirm when min or max are above 100', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,10000]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component does not call confirm when min is greater than max', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[80,30]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component focuses on first element', () => {
		const component = mount(<RangeModal for="[0,100]" />)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes range type', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'single' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes single score', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="100" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes first item of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { value: '100' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes inclusivity of first part of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(4)
			.simulate('change', { target: { chacked: false } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes second item of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(5)
			.simulate('change', { target: { value: '1' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes inclusivity of second part of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(6)
			.simulate('change', { target: { chacked: false } })

		expect(component.html()).toMatchSnapshot()
	})
})
