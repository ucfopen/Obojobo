import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import IFrame from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('IFrame Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})

	test('IFrame component', () => {
		const component = renderer.create(
			<IFrame
				element={{
					content: {
						width: 200,
						height: 200,
						controls: '',
						border: false,
						initialZoom: 1,
						src: 'mockSrc',
						title: 'mockTitle'
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('IFrame renders with no size correctly', () => {
		const component = renderer.create(
			<IFrame
				element={{
					content: {
						controls: '',
						border: false,
						initialZoom: 1,
						src: 'mockSrc'
					}
				}}
				selected
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('IFrame component deletes self', () => {
		const component = mount(
			<IFrame
				element={{
					content: {
						controls: '',
						border: false,
						initialZoom: 1,
						src: ''
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				editor={{}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('IFrame component edits properties', () => {
		const component = mount(
			<IFrame
				element={{
					content: {
						controls: '',
						border: false,
						initialZoom: 1,
						src: ''
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('IFrame component handles tab', () => {
		const component = mount(
			<IFrame
				element={{
					content: {
						controls: '',
						border: false,
						initialZoom: 1,
						src: ''
					}
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'Tab', shiftKey: 'true' })

		component
			.find('button')
			.at(1)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(1)
			.simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changeProperties sets the nodes content', () => {
		const component = mount(
			<IFrame
				element={{
					content: {
						controls: '',
						border: false,
						initialZoom: 1
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				editor={{}}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
