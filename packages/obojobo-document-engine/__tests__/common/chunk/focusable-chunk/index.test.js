import React from 'react'
import FocusableChunk from '../../../../src/scripts/common/chunk/focusable-chunk'
import renderer from 'react-test-renderer'

describe('FocusableChunk', () => {
	test('Renders as expected', () => {
		const component = renderer.create(<FocusableChunk />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('with indent and spellcheck', () => {
		const component = renderer.create(
			<FocusableChunk indent={2} spellcheck={false} className="test-123" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
