import React from 'react'
import { mount } from 'enzyme'

import ImageProperties from './image-properties-modal'

const mockedDebounce = jest.fn().mockImplementation((time, fn) => fn())

jest.mock('./utils', () => {
	return {
		debounce: (time, fn) => mockedDebounce(time, fn),
		isUrlUUID: require.requireActual('./utils').isUrlUUID
	}
})

jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util', () => ({
	postMultiPart: jest.fn().mockResolvedValue({ mediaId: 'mockMediaId' }),
	get: jest
		.fn()
		.mockResolvedValue({ json: jest.fn().mockResolvedValue({ filename: 'mock-filename' }) })
}))

describe('Image Properties Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('ImageProperties component with custom size', () => {
		const component = mount(<ImageProperties content={{ size: 'custom', url: 'mock_url' }} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('ImageProperties component with allowedUploadTypes', () => {
		const component = mount(
			<ImageProperties
				allowedUploadTypes=".mockType1,.mockType2"
				content={{ size: 'custom', url: 'mock_url' }}
			/>
		)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('ImageProperties component', () => {
		const component = mount(<ImageProperties content={{ url: 'mock_url' }} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('ImageProperties component render when click `change image`', () => {
		const component = mount(<ImageProperties content={{ url: 'mock_url' }} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.instance().state.isChoosingImage).toBe(true)
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component render ChooseImageModal component and onClick `Cancel`', () => {
		const component = mount(<ImageProperties content={{ url: null }} />)
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.instance().state.isChoosingImage).toBe(false)
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component render ChooseImageModal component and onClick `Cancel`', () => {
		const component = mount(<ImageProperties content={{ url: null }} />)
		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(component.instance().state.isChoosingImage).toBe(false)
		expect(component.instance().state.url).toBe('')
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component calls onConfirm from props', () => {
		const onConfirm = jest.fn()
		const component = mount(<ImageProperties content={{ url: 'mock_url' }} onConfirm={onConfirm} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('ImageProperties Component handles content.url as expected', () => {
		let component = mount(
			<ImageProperties content={{ url: 'C56A4180-65AA-42EC-A945-5FD21DEC0538' }} />
		)
		// if url is uuid do not set state.urlInputText
		expect(component.instance().state.urlInputText).not.toBeDefined()

		component = mount(<ImageProperties content={{ url: 'someUrl' }} />)
		// if url is uuid set state.urlInputText
		expect(component.instance().state.urlInputText).toBe('someUrl')

		// if url does not exist
		component = mount(<ImageProperties content={{}} />)
		// if url is uuid do not set state.urlInputText
		expect(component.instance().state.isChoosingImage).toBe(true)
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component focuses on first element', () => {
		const component = mount(<ImageProperties content={{ url: 'mock_url' }} />)

		component.instance().focusOnFirstElement()
		expect(component.html()).toMatchSnapshot()
	})

	test('ImageProperties component changes alt text', () => {
		const component = mount(<ImageProperties content={{ url: 'mock_url' }} onConfirm={jest.fn} />)

		component
			.find('#obojobo-draft--chunks--figure--alt')
			.simulate('change', { target: { value: 'changed alt' } })

		expect(component.instance().state.alt).toBe('changed alt')
	})

	test('ImageProperties component changes size ', () => {
		const component = mount(
			<ImageProperties content={{ size: 'custom', url: 'mock_url' }} onConfirm={jest.fn} />
		)

		let input
		// small
		input = component
			.find('#obojobo-draft--chunks--figure--size-small')
			.simulate('change', { target: { value: 'small' } })
		expect(input.html().includes(`value="small"`)).toBe(true)

		// medium
		input = component.find('#obojobo-draft--chunks--figure--size-medium')
		input.simulate('change', { target: { value: 'medium' } })
		expect(input.html().includes(`value="medium"`)).toBe(true)

		// large
		input = component.find('#obojobo-draft--chunks--figure--size-large')
		input.simulate('change', { target: { value: 'large' } })
		expect(input.html().includes(`value="large`)).toBe(true)
	})

	test('ImageProperties component changes width', () => {
		const component = mount(
			<ImageProperties content={{ size: 'custom', url: 'mock_url' }} onConfirm={jest.fn} />
		)

		const input = component.find('#obojobo-draft--chunks--figure--custom-width')
		input.simulate('change', { target: { value: 'newWidth' } })

		expect(input.html().includes(`value="newWidth"`)).toBe(true)
	})

	test('ImageProperties component changes height', () => {
		const component = mount(
			<ImageProperties content={{ size: 'custom', url: 'mock_url' }} onConfirm={jest.fn} />
		)

		const input = component.find('#obojobo-draft--chunks--figure--custom-height')
		input.simulate('change', { target: { value: 'newHeight' } })

		expect(input.html().includes(`value="newHeight"`)).toBe(true)
	})

	test('ImageProperties custom height handles null values', () => {
		const component = mount(
			<ImageProperties
				content={{ size: 'custom', url: 'mock_url' }}
				height={null}
				width={null}
				onConfirm={jest.fn}
			/>
		)

		const input = component.find('#obojobo-draft--chunks--figure--custom-height')
		input.simulate('change', { target: { value: null } })
		expect(input.html().includes(`value=""`)).toBe(true)
	})

	test('ImageProperties custom width handles null values', () => {
		const component = mount(
			<ImageProperties
				content={{ size: 'custom', url: 'mock_url' }}
				height={null}
				width={null}
				onConfirm={jest.fn}
			/>
		)

		const input = component.find('#obojobo-draft--chunks--figure--custom-width')
		input.simulate('change', { target: { value: null } })
		expect(input.html().includes(`value=""`)).toBe(true)
	})
})
