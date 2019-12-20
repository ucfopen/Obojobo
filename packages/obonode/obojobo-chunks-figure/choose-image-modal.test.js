import React from 'react'
import { mount } from 'enzyme'
import ChooseImageModal from './choose-image-modal'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util', () => ({
	postMultiPart: jest.fn().mockResolvedValue({ media_id: 'mockMediaId' }),
	get: jest.fn()
}))

const APIUtil = require('obojobo-document-engine/src/scripts/viewer/util/api-util')

describe.skip('Choose Image Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		APIUtil.get.mockResolvedValue({
			json: jest.fn()
				.mockResolvedValueOnce({ data: [{ id: '1' }], hasMore: true })
				.mockResolvedValueOnce({ data: [{ id: '2' }], hasMore: false })
		})
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
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component.find('#file').simulate('change', {
			target: {
				value: 'changed',
				files: [
					new window.Blob([JSON.stringify({ name: 'mockFileName' })], { type: 'application/json' })
				]
			}
		})

		return flushPromises().then(() => {
			expect(APIUtil.postMultiPart).toHaveBeenCalledTimes(1)
			expect(APIUtil.postMultiPart).toHaveBeenCalledWith('/api/media/upload', expect.any(FormData))
			expect(onCloseChooseImageModal).toHaveBeenCalledWith('mockMediaId')
			expect(component.html()).toMatchSnapshot()
		})
	})

	test('ImageProperties click on `View More...`', () => {
		const APIUtil = require('obojobo-document-engine/src/scripts/viewer/util/api-util')
		const onCloseChooseImageModal = jest.fn()
		const component = mount(<ChooseImageModal onCloseChooseImageModal={onCloseChooseImageModal} />)

		component.setState({ medias: [{ id: 'mock_id' }], isFetching: false, hasMore: true })

		expect(component.instance().state.hasMore).toBe(true)

		jest.clearAllMocks()
		component.find('.choose-image--image-gallary--view-more-btn').simulate('click')
		expect(component.instance().state.isFetching).toBe(true)

		return flushPromises().then(() => {
			expect(component.instance().state.isFetching).toBe(false)
			expect(APIUtil.get).toHaveBeenCalledTimes(1)
			expect(APIUtil.get).toHaveBeenCalledWith('/api/media/many/?start=0&count=11')
			expect(component.instance().state.medias).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "id": "mock_id",
			  },
			  Object {
			    "id": "1",
			  },
			  Object {
			    "id": "2",
			  },
			]
		`)

			expect(component.html()).toMatchSnapshot()
		})
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
