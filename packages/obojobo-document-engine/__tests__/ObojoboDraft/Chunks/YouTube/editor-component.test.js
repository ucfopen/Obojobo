import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import YouTube from 'ObojoboDraft/Chunks/YouTube/editor-component'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

describe('YouTube Editor Node', () => {
	test('YouTube builds the expected component', () => {
		const component = renderer.create(
			<YouTube
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('YouTube component changes input', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<YouTube
				node={{
					data: {
						get: () => {
							return { videoId: 'mockId'}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
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

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('handleSourceChange sets the nodes content', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<YouTube
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component.instance().handleSourceChange('mockId')

		expect(ModalUtil.hide).toHaveBeenCalled()
	})
})
