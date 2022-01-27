import Dialog from '../../../../src/scripts/common/components/modal/dialog'
import Modal from '../../../../src/scripts/common/components/modal/modal'
import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../../../src/scripts/common/components/modal/modal', () => props => (
	<div {...props} />
))

describe('Dialog', () => {
	test('basic render', () => {
		const component = renderer.create(<Dialog>Content</Dialog>)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('render with no buttons', () => {
		const component = renderer.create(<Dialog buttons={false}>Content</Dialog>)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('render with props', () => {
		const component = renderer.create(
			<Dialog title="Title" buttons={['test']} width={'200 px'} centered={false}>
				Content
			</Dialog>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('child modal focusOnFirstElement focuses on the first button', () => {
		const button = {
			default: true
		}
		const component = renderer.create(
			<Dialog title="Title" buttons={[button]}>
				Content
			</Dialog>
		)

		const spy = jest.spyOn(component.getInstance().buttonRefs[0], 'focus')
		const modalChild = component.root.findByType(Modal)
		modalChild.props.focusOnFirstElement()
		expect(spy).toHaveBeenCalled()
	})

	test('Dialog componentfocuses with prop', () => {
		const button = {
			default: true
		}
		const focusFirst = jest.fn()
		const component = renderer.create(
			<Dialog title="Title" buttons={[button]} focusOnFirstElement={focusFirst}>
				Content
			</Dialog>
		)

		const modalChild = component.root.findByType(Modal)
		modalChild.props.focusOnFirstElement()
		expect(focusFirst).toHaveBeenCalled()
	})
})
