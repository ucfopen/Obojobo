import React from 'react'
import ButtonBar from '../../../src/scripts/common/components/button-bar'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('ButtonBar', () => {
	test('ButtonBar component', () => {
		let children = []
		const component = renderer.create(<ButtonBar children={children} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ButtonBar component with attributes', () => {
		let children = [
			{
				props: { id: 'mockChild' }
			}
		]
		const component = renderer.create(
			<ButtonBar children={children} altAction={jest.fn()} isDangerous={true} disabled={true} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ButtonBar component clicks button', () => {
		let children = [
			{
				props: { id: 'mockChild' }
			}
		]
		let mockClick = jest.fn()
		const component = mount(<ButtonBar children={children} onClick={mockClick} />)

		let click = component
			.childAt(0)
			.find('button')
			.simulate('click')

		expect(mockClick).toHaveBeenCalled
	})

	test('ButtonBar component clicks button but does not fire', () => {
		let children = [
			{
				props: { id: 'mockChild', onClick: true }
			}
		]
		let mockClick = jest.fn()
		const component = mount(<ButtonBar children={children} onClick={mockClick} />)

		let click = component
			.childAt(0)
			.find('button')
			.simulate('click')

		expect(mockClick).toHaveBeenCalled
	})
})
