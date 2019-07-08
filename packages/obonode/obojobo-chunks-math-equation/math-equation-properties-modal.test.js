import React from 'react'
import { mount } from 'enzyme'

import MathEquationProperties from './math-equation-properties-modal'

describe('MathEquationProperties', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('MathEquationProperties component', () => {
		const component = mount(<MathEquationProperties content={{}} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquationProperties component checks the value before confirming', () => {
		const onConfirm = jest.fn()

		const component = mount(<MathEquationProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('MathEquationProperties component changes equation', () => {
		const onConfirm = jest.fn()

		const component = mount(<MathEquationProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'x_0' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('MathEquationProperties component changes alt', () => {
		const onConfirm = jest.fn()

		const component = mount(<MathEquationProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'y = 5' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('MathEquationProperties component changes label', () => {
		const onConfirm = jest.fn()

		const component = mount(<MathEquationProperties content={{}} onConfirm={onConfirm} />)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { value: '1.1' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('MathEquationProperties component focuses on first element', () => {
		const component = mount(<MathEquationProperties content={{}} />)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})
})
