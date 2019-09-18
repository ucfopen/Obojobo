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
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('IFrame component edits properties', () => {
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('button')
			.at(0)
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
				editor={editor}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
