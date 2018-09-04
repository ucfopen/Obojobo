import React from 'react'
import renderer from 'react-test-renderer'

import TextChunk from '../../../../src/scripts/common/chunk/text-chunk/index'

describe('TextChunk', () => {
	test('TextChunk component', () => {
		const component = renderer.create(<TextChunk />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextChunk component with name', () => {
		const component = renderer.create(<TextChunk className={'mock-class-name'} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
