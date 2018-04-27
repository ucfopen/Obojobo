import React from 'react'
import renderer from 'react-test-renderer'
import Common from 'Common'
import Logo from 'src/scripts/viewer/components/logo'

jest.mock('src/scripts/common/', () => ({
	util: {
		getBackgroundImage: jest.fn()
	}
}))

describe('Logo', () => {
	test('getBackgroundImage is called', () => {
		const component = renderer.create(<Logo inverted />)
		expect(Common.util.getBackgroundImage).toHaveBeenCalled()
	})

	test('renders correctly when inverted prop is true', () => {
		const component = renderer.create(<Logo inverted />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly when not inverted prop is false', () => {
		const component = renderer.create(<Logo inverted={false} />)
		expect(component).toMatchSnapshot()
	})
})
