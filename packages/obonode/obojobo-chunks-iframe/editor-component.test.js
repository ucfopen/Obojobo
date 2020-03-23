import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import IFrame from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('IFrame Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})
	test('IFrame component', () => {
		const component = renderer.create(
			<IFrame
				node={{
					data: {
						get: () => ({
							width: 200,
							height: 200,
							controls: '',
							border: false,
							initialZoom: 1,
							src: 'mockSrc',
							title: 'mockTitle'
						})
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
				node={{
					data: {
						get: () => ({
							controls: '',
							border: false,
							initialZoom: 1,
							src: 'mockSrc'
						})
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
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('IFrame component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({
							controls: '',
							border: false,
							initialZoom: 1,
							src: ''
						})
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
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()

		component.unmount()
	})

	test('IFrame component edits properties', () => {
		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({
							controls: '',
							border: false,
							initialZoom: 1,
							src: ''
						})
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

		component.unmount()
	})

	test('changeProperties sets the nodes content', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({
							controls: '',
							border: false,
							initialZoom: 1
						})
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
				editor={editor}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
