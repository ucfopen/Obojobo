import Figure from './editor-component'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/stores/editor-store')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('Figure Editor Node', () => {
	let mockEditor
	beforeEach(() => {
		jest.restoreAllMocks()
		mockEditor = {
			setNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}
		EditorStore.state = { settings: { allowedUploadTypes: '.mockTypes'} }
	})

	test('Figure component', () => {
		const component = renderer.create(
			<Figure
				node={{
					data: {
						get: () => ({
							size: 'small',
							url: 'mockUrl',
							alt: 'mockAlt'
						})
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
				node={{
					data: {
						get: () => ({
							size: 'custom',
							url: 'mockUrl',
							alt: 'mockAlt',
							width: 'customWidth',
							height: 'customHeight'
						})
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		const componentNoWidth = renderer.create(
			<Figure
				node={{
					data: {
						get: () => ({
							size: 'custom',
							url: 'mockUrl',
							alt: 'mockAlt',
							height: 'customHeight'
						})
					}
				}}
			/>
		)
		expect(componentNoWidth.toJSON()).toMatchSnapshot()

		const componentNoHeight = renderer.create(
			<Figure
				node={{
					data: {
						get: () => ({
							size: 'custom',
							url: 'mockUrl',
							alt: 'mockAlt',
							width: 'mockWidth'
						})
					}
				}}
			/>
		)
		expect(componentNoHeight.toJSON()).toMatchSnapshot()
	})

	test('Figure component edits properties', () => {
		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => ({})
					}
				}}
				editor={mockEditor}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()

		component.unmount()
	})

	test('Figure component handles clicks', () => {
		const component = mount(
			<Figure
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => ({})
					},
					text: 'Your Title Here'
				}}
			/>
		)

		const nodeInstance = component.instance()
		nodeInstance.node = {
			contains: value => value
		}

		nodeInstance.handleClick({ target: true }) // click inside

		let tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.handleClick({ target: false }) // click outside

		tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node = null
		nodeInstance.handleClick() // click without node

		tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('changeProperties sets the nodes content', () => {
		const mockContent = {mockContent: true}
		const newMockContent = { newMockContent: 999 }
		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => mockContent
					}
				}}
				editor={mockEditor}
			/>
		)

		component.instance().changeProperties(newMockContent)
		expect(mockEditor.setNodeByKey).toHaveBeenCalledWith('mockKey', {data: {content: newMockContent}})
	})

	test('Figure component delete button calls editor.removeNodeByKey', () => {
		const component = mount(
			<Figure
				node={{
					data: {
						get: () => ({})
					}
				}}
				editor={mockEditor}
			/>
		)

		const deleteButton = component.find('button').at(0)
		expect(deleteButton.props().children).toBe('×')

		expect(mockEditor.removeNodeByKey).not.toHaveBeenCalled()
		deleteButton.simulate('click')
		expect(mockEditor.removeNodeByKey).toHaveBeenCalled()
	})
})
