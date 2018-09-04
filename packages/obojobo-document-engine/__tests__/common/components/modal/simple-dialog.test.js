import { mount } from 'enzyme'
import React from 'react'
import SimpleDialog from '../../../../src/scripts/common/components/modal/simple-dialog'
import ModalUtil from '../../../../src/scripts/common/util/modal-util'
import renderer from 'react-test-renderer'

test('SimpleDialog ok', () => {
	const component = renderer.create(
		<SimpleDialog ok onCancel={jest.fn()} onConfirm={jest.fn()}>
			Content
		</SimpleDialog>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('SimpleDialog noOrYes', () => {
	const component = renderer.create(
		<SimpleDialog noOrYes onCancel={jest.fn()} onConfirm={jest.fn()}>
			Content
		</SimpleDialog>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('SimpleDialog yesOrNo', () => {
	const component = renderer.create(
		<SimpleDialog yesOrNo onCancel={jest.fn()} onConfirm={jest.fn()}>
			Content
		</SimpleDialog>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('SimpleDialog cancelOk', () => {
	const component = renderer.create(
		<SimpleDialog cancelOk onCancel={jest.fn()} onConfirm={jest.fn()}>
			Content
		</SimpleDialog>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('SimpleDialog ok click', () => {
	let onCancel = jest.fn()
	let onConfirm = jest.fn()

	const component = mount(
		<SimpleDialog ok onCancel={onCancel} onConfirm={onConfirm}>
			Content
		</SimpleDialog>
	)

	let leftButton = component.find('button').at(0)
	let rightButton = component.find('button').at(1)

	leftButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(0)
	expect(onConfirm).toHaveBeenCalledTimes(1)
})

test('SimpleDialog noOrYes click', () => {
	let onCancel = jest.fn()
	let onConfirm = jest.fn()

	const component = mount(
		<SimpleDialog noOrYes onCancel={onCancel} onConfirm={onConfirm}>
			Content
		</SimpleDialog>
	)

	let leftButton = component.find('button').at(0)
	let rightButton = component.find('button').at(1)

	leftButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(1)
	expect(onConfirm).toHaveBeenCalledTimes(0)

	rightButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(1)
	expect(onConfirm).toHaveBeenCalledTimes(1)
})

test('SimpleDialog yesOrNo click', () => {
	let onCancel = jest.fn()
	let onConfirm = jest.fn()

	const component = mount(
		<SimpleDialog yesOrNo onCancel={onCancel} onConfirm={onConfirm}>
			Content
		</SimpleDialog>
	)

	let leftButton = component.find('button').at(0)
	let rightButton = component.find('button').at(1)

	leftButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(0)
	expect(onConfirm).toHaveBeenCalledTimes(1)

	rightButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(1)
	expect(onConfirm).toHaveBeenCalledTimes(1)
})

test('SimpleDialog cancelOk click', () => {
	let onCancel = jest.fn()
	let onConfirm = jest.fn()

	const component = mount(
		<SimpleDialog cancelOk onCancel={onCancel} onConfirm={onConfirm}>
			Content
		</SimpleDialog>
	)

	let leftButton = component.find('button').at(0)
	let rightButton = component.find('button').at(1)

	leftButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(1)
	expect(onConfirm).toHaveBeenCalledTimes(0)

	rightButton.simulate('click')

	expect(onCancel).toHaveBeenCalledTimes(1)
	expect(onConfirm).toHaveBeenCalledTimes(1)
})
