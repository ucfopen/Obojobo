import React from 'react'
import renderer from 'react-test-renderer'
import Logo from 'src/scripts/viewer/components/logo'

describe('Logo', () => {
	test('renders correctly when inverted prop is true', () => {
		const component = renderer.create(<Logo inverted />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly when not inverted prop is false', () => {
		const component = renderer.create(<Logo inverted={false} />)
		expect(component).toMatchSnapshot()
	})
})
