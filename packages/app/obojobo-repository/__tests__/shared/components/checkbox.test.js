/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import React from 'react'
import Checkbox from '../../../shared/components/checkbox'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Checkbox', () => {
	test('Checkbox renders correctly with no options set', () => {
		const component = mount(<Checkbox />)

		expect(component.find('button').hasClass('is-not-checked')).toBe(true)
	})

	test('Checkbox renders correctly when props.checked is false', () => {
		const component = mount(<Checkbox checked={false} />)

		expect(component.find('button').hasClass('is-not-checked')).toBe(true)
	})

	test('Checkbox renders correctly when props.checked is true', () => {
		const component = mount(<Checkbox checked={true} />)

		expect(component.find('button').hasClass('is-checked')).toBe(true)
	})
})
