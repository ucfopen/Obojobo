import React from 'react'
import ModuleImage from './module-image'
import { create } from 'react-test-renderer'

describe('ModuleImage', () => {
	test('renders', () => {
		const component = create(<ModuleImage />)

		expect(component.toJSON()).toMatchSnapshot()
	})
})
