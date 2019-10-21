import React from 'react'
import { mount } from 'enzyme'

import ChooseImageModal from './choose-image-modal'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util', () => ({
	postMultiPart: jest.fn().mockResolvedValue({ mediaId: 'mockMediaId' }),
	get: jest.fn().mockResolvedValue({
		json: jest.fn().mockResolvedValue({ data: [{ id: '0' }], hasMore: true })
	})
}))

describe('Choose Image Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('ChooseImageModal component', () => {
		const component = mount(<ChooseImageModal />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('ChooseImageModal component focuses on first element', () => {
		const component = mount(<ChooseImageModal onConfirm={jest.fn} />)

		component.instance().focusOnFirstElement()
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes url', () => {
		const component = mount(<ChooseImageModal onConfirm={jest.fn} />)

		component
			.find('#choose-image--image-controls--url')
			.simulate('change', { target: { value: 'changed url' } })

		const instance = component.instance()
		expect(instance.state.url).toBe('changed url')
	})

	test('ImageProperties component changes file', () => {
		const component = mount(
			<ChooseImageModal onSetMediaUrl={jest.fn} onSetIsChoosingImage={jest.fn} />
		)

		component.find('#file').simulate('change', {
			target: {
				value: 'changed',
				files: [
					new window.Blob([JSON.stringify({ name: 'mockFileName' })], { type: 'application/json' })
				]
			}
		})

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties click on `View More...`', () => {
		const component = mount(<ChooseImageModal onCloseChooseImageModal={jest.fn} />)

		component.setState({ medias: [{ id: 'mock_id' }], isFetching: false, hasMore: true })

		expect(component.instance().state.hasMore).toBe(true)

		component.find('.choose-image--image-gallary--view-more-btn').simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties click on `Cancel`', () => {
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onCloseChooseImageModal).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties click on `OK`', () => {
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onCloseChooseImageModal).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties click on an image', () => {
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component.setState({ medias: [{ id: 'mock_id' }], isFetching: false, hasMore: false })
		component.find('.image-gallary--single-photo').simulate('click')

		expect(onCloseChooseImageModal).toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties onPress on an image', () => {
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component.setState({ medias: [{ id: 'mock_id' }], isFetching: false, hasMore: false })
		component
			.find('.image-gallary--single-photo')
			.at(0)
			.simulate('keypress', { key: 'mock_key' })

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties onKeyPress `enter` on an image', () => {
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component.setState({ medias: [{ id: 'mock_id' }], isFetching: false, hasMore: false })
		component
			.find('.image-gallary--single-photo')
			.at(0)
			.simulate('keypress', { key: 'Enter' })

		expect(onCloseChooseImageModal).toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties handle fetching error', () => {
		const APIUtil = require('obojobo-document-engine/src/scripts/viewer/util/api-util')
		APIUtil.get = jest.fn().mockResolvedValue({
			json: jest.fn().mockResolvedValue({ status: 'error' })
		})

		const component = mount(
			<ChooseImageModal onSetIsChoosingImage={jest.fn} onSetMediaUrl={jest.fn} />
		)

		expect(component.html()).toMatchSnapshot()
	})
})
