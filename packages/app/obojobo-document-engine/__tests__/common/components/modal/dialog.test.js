import Dialog from '../../../../src/scripts/common/components/modal/dialog'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

describe('Dialog', () => {
	test('Dialog component', () => {
		const component = renderer.create(<Dialog>Content</Dialog>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Dialog component with no buttons', () => {
		const component = renderer.create(<Dialog buttons={false} >Content</Dialog>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Dialog component with props', () => {
		const component = renderer.create(
			<Dialog title="Title" buttons={['test']}>
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

		const spy = jest.spyOn(component.instance().buttonRefs[0], 'focus')

		component
			.find('input')
			.first()
			.simulate('focus')

		expect(spy).toHaveBeenCalled()
	})

	test('Dialog component focuses with prop', () => {
		const button = {
			default: true
		}
		const focusFirst = jest.fn()
		const component = mount(
			<Dialog title="Title" buttons={[button]} centered={true} focusOnFirstElement={focusFirst}>
				Content
			</Dialog>
		)

		component
			.find('input')
			.first()
			.simulate('focus')

		expect(focusFirst).toHaveBeenCalled()
	})
})
