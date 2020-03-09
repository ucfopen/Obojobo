import React from 'react'
import renderer from 'react-test-renderer'

import Caption from './editor-component'

describe('Caption Editor Node', () => {
	test('Caption component', () => {
		const component = renderer.create(<Caption />)
		expect(component.toJSON()).toMatchSnapshot()
	})
})
