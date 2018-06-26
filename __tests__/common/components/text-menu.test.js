import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import TextMenu from '../../../src/scripts/common/components/text-menu'

let createRect = () => {
	return {
		left: 0,
		top: 0,
		width: 0
	}
}
describe('TextMenu', () => {
	test('TextMenu', () => {
		const component = renderer.create(<TextMenu />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextMenu disabled', () => {
		const component = renderer.create(<TextMenu relativeToElement={true} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextMenu with no selection', () => {
		const component = renderer.create(
			<TextMenu
				relativeToElement={{
					getBoundingClientRect: () => createRect()
				}}
				enabled={true}
				selectionRect={createRect()}
			/>
		)
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
				commands={[{ label: 'Label' }, { label: 'imageCommand', image: 'mockImage' }]}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextMenu calls mouseDown', () => {
		let mockCommandHandler = jest.fn()

		const component = mount(
			<TextMenu
				relativeToElement={{
					getBoundingClientRect: () => createRect()
				}}
				enabled={true}
				selectionRect={createRect()}
				commands={[{ label: 'Label' }]}
				commandHandler={mockCommandHandler}
			/>
		)

		let link = component.find('a').simulate('mouseDown')

		expect(mockCommandHandler).toHaveBeenCalledWith('Label')
	})
})
