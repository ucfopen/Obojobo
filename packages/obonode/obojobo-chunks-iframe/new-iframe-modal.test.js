import React from 'react'
import { mount } from 'enzyme'
import TestRenderer from 'react-test-renderer'
import NewIFrameModal from './new-iframe-modal'
import IFrameContentTypes from './iframe-content-types'

const testRendererOptions = {
	createNodeMock: element => {
		if (element.type === 'input') {
			return {
				focus: () => {},
				select: () => {}
			}
		}
	}
}

describe('NewIFrameModal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('NewIFrameModal component mounts as expected', () => {
		const component = mount(
			<NewIFrameModal
				content={{
					src: '',
					contentType: IFrameContentTypes.MEDIA
				}}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('NewIFrameModal component calls onConfirm from props', () => {
		const onConfirm = jest.fn()

		const component = mount(
			<NewIFrameModal
				content={{
					src: '',
					contentType: IFrameContentTypes.MEDIA
				}}
				onConfirm={onConfirm}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('NewIFrameModal component focuses on first element', () => {
		const component = mount(
			<NewIFrameModal
				content={{
					src: '',
					contentType: IFrameContentTypes.MEDIA
				}}
			/>
		)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})

	test('NewIFrameModal component changes src', () => {
		const component = TestRenderer.create(
			<NewIFrameModal
				content={{
					src: '',
					contentType: IFrameContentTypes.MEDIA
				}}
			/>,
			testRendererOptions
		)

		const startState = component.toJSON()
		const input = component.root.findAllByType('input')[1]
		input.props.onChange({ target: { value: 'https://' } })

		const endState = component.toJSON()
		expect(endState).toMatchSnapshot()
		expect(startState).not.toEqual(endState)
	})

	test('NewIFrameModal component correctly detects content type', () => {
		const component = TestRenderer.create(
			<NewIFrameModal
				content={{
					src: '',
					contentType: IFrameContentTypes.WEBPAGE
				}}
			/>,
			testRendererOptions
		)
		const startState = component.toJSON()
		const input = component.root.findAllByType('input')[1]

		// Changing the src input to trigger a content type detection (Detection: Media)
		input.props.onChange({ target: { value: "<iframe src='https://'></iframe" } })

		let endState = component.toJSON()
		expect(endState).toMatchSnapshot()
		expect(startState).not.toEqual(endState)

		// Changing the src input to trigger a content type detection (Detection: Webpage)
		input.props.onChange({ target: { value: 'https://' } })

		endState = component.toJSON()
		expect(endState).toMatchSnapshot()
		expect(startState).not.toEqual(endState)
	})

	test('NewIFrameModal component opens section explaining why the iframe preview is not working', () => {
		const component = TestRenderer.create(
			<NewIFrameModal
				content={{
					src: 'https://',
					contentType: IFrameContentTypes.WEBPAGE
				}}
			/>,
			testRendererOptions
		)

		// Closes the preview-not-working section
		const button = component.root.findAllByType('button')[0]
		button.props.onClick()

		expect(component.toJSON()).toMatchSnapshot()
	})
})
