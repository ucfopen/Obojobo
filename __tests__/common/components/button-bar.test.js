import React from 'react'
import ButtonBar from '../../../src/scripts/common/components/button-bar'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('ButtonBar', () => {
	test('ButtonBar component', () => {
		const children = []
		const component = renderer.create(<ButtonBar>{children}</ButtonBar>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ButtonBar component with attributes', () => {
		const children = [
			{
				props: { id: 'mockChild' }
			}
		]
		const component = renderer.create(
			<ButtonBar altAction={jest.fn()} isDangerous={true} disabled={true}>
				{children}
			</ButtonBar>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ButtonBar component clicks button', () => {
		const children = [
			{
				props: { id: 'mockChild' }
			}
		]
		const mockClick = jest.fn()
		const component = mount(<ButtonBar onClick={mockClick}>{children}</ButtonBar>)

		component
			.childAt(0)
			.find('button')
			.simulate('click')

		expect(mockClick).toHaveBeenCalled
	})

	test('ButtonBar component clicks button but does not fire', () => {
		const children = [
			{
				props: { id: 'mockChild', onClick: true }
			}
		]
		const mockClick = jest.fn()
		const component = mount(<ButtonBar onClick={mockClick}>{children}</ButtonBar>)

		component
			.childAt(0)
			.find('button')
			.simulate('click')

		expect(mockClick).toHaveBeenCalled
	})
})
