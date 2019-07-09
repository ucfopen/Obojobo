import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import YouTube from './editor-component'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

let mockNode
let editor

describe('YouTube Editor Node', () => {

	beforeEach(() => {
		const mockNodeDataGet = jest.fn().mockReturnValue({})
		mockNode = {data:{get:mockNodeDataGet}}
		editor = {setNodeByKey: jest.fn()}
	})

	test('YouTube builds the expected componen without a videoId', () => {
		const component = renderer.create(
			<YouTube
				node={mockNode}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('YouTube builds the expected component given a videoId', () => {
		mockNode.data.get.mockReturnValue({ videoId: 'mockId' })
		const component = renderer.create(
			<YouTube
				node={mockNode}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('YouTube component edits input', () => {
		mockNode.data.get.mockReturnValue({ videoId: 'mockId' })
		const component = mount(
			<YouTube
				node={mockNode}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)

		// locate the edit button
		const button = component.find('button')
		expect(button.props().children).toBe('Edit')

		// click it
		button.simulate('click')

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('handleSourceChange sets the nodes content', () => {
		mockNode.key = 'mockNodeKey'
		const testRenderer = renderer.create(
			<YouTube
				node={mockNode}
				isFocused={true}
				isSelected={true}
				editor={editor}
			/>
		)
		const component = testRenderer.root

		// execute the instance callback
		component.instance.handleSourceChange('mockId')
		expect(editor.setNodeByKey).toHaveBeenCalledWith('mockNodeKey', {data:{content:{videoId: 'mockId'}}})

		const tree = testRenderer.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
