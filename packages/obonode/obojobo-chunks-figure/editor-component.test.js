import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'

import Figure from './editor-component'
import ImageCaptionWidthTypes from './image-caption-width-types'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/stores/editor-store')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor')
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

describe('Figure Editor Node', () => {
	const flushPromises = global.flushPromises // pevents eslint no-undef errors
	const API = require('obojobo-document-engine/src/scripts/viewer/util/api')

	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
		EditorStore.state = { settings: { allowedUploadTypes: '.mockTypes' } }
		;(API.postMultiPart = jest.fn().mockResolvedValue({ media_id: 'mockMediaId' })),
			(API.get = jest.fn().mockResolvedValue({
				json: jest
					.fn()
					.mockResolvedValueOnce({ media: [{ id: '1', fileName: 'file-name-1' }], hasMore: true })
					.mockResolvedValueOnce({ media: [{ id: '2', fileName: 'file-name-2' }], hasMore: false })
			}))
	})

	test('Figure component', () => {
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt'
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

	test('Figure renders with custom size correctly', () => {
		expect.assertions(3)

		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						width: 'customWidth',
						height: 'customHeight',
						captionWidth: ImageCaptionWidthTypes.TEXT_WIDTH
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

		const componentNoWidth = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						height: 'customHeight',
						captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH
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
		expect(componentNoWidth.toJSON()).toMatchSnapshot()

		const componentNoHeight = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						width: 'customWidth',
						captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH
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
		expect(componentNoHeight.toJSON()).toMatchSnapshot()
	})

	test('Figure component edits properties', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
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
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()

		component.unmount()
	})

	test('Figure component handles tabbing', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
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

	test('Figure component does not focus if already selected', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				selected={true}
			/>
		)

		component
			.find('.figure-box')
			.at(0)
			.simulate('click')

		expect(Transforms.setSelection).not.toHaveBeenCalled()

		component.unmount()
	})

	test('Figure component focuses when clicked', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				selected={false}
			/>
		)

		component
			.find('.figure-box')
			.at(0)
			.simulate('click')

		expect(Transforms.setSelection).toHaveBeenCalled()

		component.unmount()
	})

	test('changeProperties sets the nodes content', () => {
		const mockContent = { mockContent: true }
		const newMockContent = { newMockContent: 999 }
		const component = mount(
			<Figure
				element={{
					key: 'mockKey',
					content: mockContent
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
				selected={true}
			/>
		)

		component.instance().changeProperties(newMockContent)
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Figure component delete button calls Transforms', () => {
		const component = mount(
			<Figure
				node={{
					data: {
						get: () => ({})
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
				element={{ content: {} }}
				selected={true}
			/>
		)

		const deleteButton = component.find('button').at(0)
		expect(deleteButton.props().children).toBe('×')

		deleteButton.simulate('click')
		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('Figure component uses appropriate image url', () => {
		const component = mount(<Figure editor={{}} element={{ content: {} }} />)

		return flushPromises().then(() => {
			component.find('.figure-box').simulate('drop', {
				dataTransfer: {
					items: [
						{
							kind: 'file',
							getAsFile: () =>
								new window.Blob([JSON.stringify({ name: 'mockFileName' })], {
									type: 'application/json'
								})
						}
					]
				}
			})
			expect(component.instance().state.draggingOver).toBe(false)
		})
	})

	test('Figure component does nothing if no files are dropped', () => {
		const component = mount(<Figure editor={{}} element={{ content: {} }} />)

		component.find('.figure-box').simulate('drop', {})
		expect(component.instance().state.draggingOver).toBe(false)
	})

	test('Figure component does not upload files of incorrect file types', () => {
		const component = mount(<Figure editor={{}} element={{ content: {} }} />)

		component.find('.figure-box').simulate('drop', {
			dataTransfer: {
				items: [{ kind: 'mock-incorrect-file-type' }]
			}
		})
		expect(component.instance().state.draggingOver).toBe(false)
	})

	test('Figure component triggers onDragImageOver function', () => {
		const component = mount(
			<Figure
				node={{
					data: {
						get: () => ({})
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {}
				}}
				editor={{}}
				element={{ content: {} }}
			/>
		)

		component.find('.figure-box').simulate('dragOver', { target: {} })
		expect(component.instance().state.draggingOver).toBe(true)
	})

	test('Figure component triggers onDragImageLeave function', () => {
		const component = mount(<Figure editor={{}} element={{ content: {} }} />)

		component.find('.figure-box').simulate('dragLeave', { target: {} })
		expect(component.instance().state.draggingOver).toBe(false)
	})

	test('Figure component displays error if dropped file is not allowed', () => {
		API.postMultiPart = jest.fn().mockResolvedValue({
			media_id: 'mockMediaId',
			status: 'error',
			value: { message: 'mockMessage' }
		})

		const component = mount(<Figure editor={{}} element={{ content: {} }} />)

		return flushPromises().then(() => {
			component.find('.figure-box').simulate('drop', {
				dataTransfer: {
					items: [
						{
							kind: 'file',
							getAsFile: () =>
								new window.Blob([JSON.stringify({ name: 'mockFileName' })], {
									type: 'application/json'
								})
						}
					]
				}
			})
			expect(component.instance().state.draggingOver).toBe(false)
		})
	})
})
