import React from 'react'
import MenuControlButton from './menu-control-button'
import { create } from 'react-test-renderer'

describe('MenuControlButton', () => {
	test('renders with no classes', () => {
		const component = create(<MenuControlButton />)

		expect(component.root.findAllByType('div').length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with additional classes', () => {
		const component = create(<MenuControlButton className="other-class" />)

		const allDivs = component.root.findAllByType('div')

		expect(allDivs.length).toBe(1)
		const onlyDiv = allDivs[0]
		expect(onlyDiv.props.className).toEqual('other-class')

		expect(component.toJSON()).toMatchSnapshot()
	})
})
