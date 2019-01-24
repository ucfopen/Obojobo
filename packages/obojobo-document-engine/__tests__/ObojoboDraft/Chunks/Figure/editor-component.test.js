import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Figure from 'ObojoboDraft/Chunks/Figure/editor-component'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

describe('Figure Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})
	test('Figure component', () => {
		const component = renderer.create(
			<Figure
				node={{
					data: {
						get: () => ({
							size: 'mockSize',
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
		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Figure
				node={{
					key: 'mockKey',
					data: {
						get: () => ({})
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
			.at(2)
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
		const change = {
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component.instance().changeProperties({ mockProperties: 'mock value' })

		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('Figure component deletes self', () => {
		const change = {
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

		expect(change.removeNodeByKey).toHaveBeenCalled()
	})
})
