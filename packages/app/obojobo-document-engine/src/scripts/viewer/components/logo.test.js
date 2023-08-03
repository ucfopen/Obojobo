import React from 'react'
import renderer from 'react-test-renderer'
import Logo from './logo'
import rd from './rd'

jest.mock('./rd')

describe('Logo', () => {
	test('renders correctly when inverted prop is true', () => {
		const component = renderer.create(<Logo inverted />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly when not inverted prop is false', () => {
		const component = renderer.create(<Logo inverted={false} />)
		expect(component).toMatchSnapshot()
	})

	test('onClick updates state and calls rd', () => {
		const component = renderer.create(<Logo inverted />)
		expect(component.getInstance().state.clicks).toBe(0)
		expect(rd).not.toBeCalled()
		for (let i = 0; i < 10; i++) {
			component.getInstance().onClick()
		}
		expect(component.getInstance().state.clicks).toBe(10)
		expect(rd).not.toBeCalled()
		component.getInstance().onClick()
		expect(component.getInstance().state.clicks).toBe(11)
		expect(rd).toBeCalled()
	})
})
