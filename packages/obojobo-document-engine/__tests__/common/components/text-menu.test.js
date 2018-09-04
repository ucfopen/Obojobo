import React from 'react'
import renderer from 'react-test-renderer'

import TextMenu from '../../../src/scripts/common/components/text-menu'

let createRect = () => {
	return {
		left: 0,
		top: 0,
		width: 0
	}
}

test('TextMenu', () => {
	const component = renderer.create(<TextMenu />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('TextMenu with required props', () => {
	const component = renderer.create(
		<TextMenu
			relativeToElement={{
				getBoundingClientRect: () => createRect()
			}}
			enabled={true}
			selectionRect={createRect()}
			commands={[{ label: 'Label' }]}
		/>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
