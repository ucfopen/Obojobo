import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Row from './editor-component'

describe('Row Editor Node', () => {
	test('Row component', () => {
		const component = renderer.create(
			<Row>children</Row>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

})
