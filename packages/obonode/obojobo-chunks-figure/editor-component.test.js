import Figure from './editor-component'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util', () => ({
	postMultiPart: jest.fn().mockResolvedValue({ mediaId: 'mockMediaId' }),
	get: jest
		.fn()
		.mockResolvedValue({ json: jest.fn().mockResolvedValue({ filename: 'mock-filename' }) })
}))

describe('Figure Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
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
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => ({})
					}
				}}
				editor={editor}
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
		document.getElementById = jest.fn().mockReturnValue({
			files: [
				new window.Blob([JSON.stringify({ name: 'some name' })], { type: 'application/json' })
			]
		})

		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => ({})
					}
				}}
				editor={editor}
			/>
		)

		return component
			.instance()
			.changeProperties({ mockProperties: 'mock value' })
			.then(() => {
				expect(editor.setNodeByKey.mock.calls[0][0]).toBe('mockKey')
				expect(editor.setNodeByKey.mock.calls[0][1]).toEqual({
					data: {
						content: {
							filename: 'mock-filename',
							mockProperties: 'mock value',
							url: 'mockMediaId'
						}
					}
				})
			})
			.then(() => {
				// case for no file
				document.getElementById = jest.fn().mockReturnValue({ files: [null] })
				component.instance().changeProperties({ mockProperties: 'another mock value' })
				expect(editor.setNodeByKey.mock.calls[1][0]).toBe('mockKey')
				expect(editor.setNodeByKey.mock.calls[1][1]).toEqual({
					data: {
						content: {
							mockProperties: 'another mock value'
						}
					}
				})
			})
	})

	test('Figure component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => {
							return {}
						}
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
	})
})
