import React from 'react'
import renderer from 'react-test-renderer'

import TextChunk from '../../../../src/scripts/common/chunk/text-chunk/index'

describe('TextChunk', () => {
	test('TextChunk component', () => {
		let component = renderer.create(<TextChunk />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextChunk component with name', () => {
		let component = renderer.create(<TextChunk className={'mock-class-name'} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
