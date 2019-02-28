import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import Dialog from '../../../../src/scripts/common/components/modal/dialog'

describe('Dialog', () => {
	test('Dialog component', () => {
		const component = renderer.create(<Dialog buttons={[]}>Content</Dialog>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Dialog component with props', () => {
		const component = renderer.create(
			<Dialog title="Title" buttons={[]} centered={false} width={5}>
				Content
			</Dialog>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Dialog component focuses', () => {
		const button = {
			default: true
		}
		const component = mount(
			<Dialog title="Title" buttons={[button]} centered={true}>
				Content
			</Dialog>
		)

		const spy = jest.spyOn(component.instance().refs.button0, 'focus')

		component
			.find('input')
			.first()
			.simulate('focus')

		expect(spy).toHaveBeenCalled()
	})
})
