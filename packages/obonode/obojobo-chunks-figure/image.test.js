import Image from './image'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Image', () => {
	const uuidUrl = '52727a4f-0970-4b2c-941a-ce8027078b40'

	const imageSmNoUrl = <Image chunk={{ modelState: { size: 'small', alt: 'alt text' } }} />
	const imageSm = <Image chunk={{ modelState: { url: uuidUrl, size: 'small', alt: 'alt text' } }} />
	const imageMed = (
		<Image chunk={{ modelState: { url: uuidUrl, size: 'medium', alt: 'alt text' } }} />
	)
	const imageLarge = (
		<Image chunk={{ modelState: { url: uuidUrl, size: 'large', alt: 'alt text' } }} />
	)
	const imageCustom = (
		<Image
			chunk={{
				modelState: {
					url: uuidUrl,
					size: 'custom',
					height: 100,
					width: 200
				}
			}}
		/>
	)
	const imageHeightOnly = (
		<Image
			chunk={{
				modelState: {
					url: uuidUrl,
					size: 'custom',
					height: 100
				}
			}}
		/>
	)
	const imageWidthOnly = (
		<Image
			chunk={{
				modelState: {
					url: uuidUrl,
					size: 'custom',
					width: 100
				}
			}}
		/>
	)
	const imageNoWidthNoHeight = (
		<Image
			chunk={{
				modelState: {
					url: uuidUrl,
					size: 'custom'
				}
			}}
		/>
	)

	test('Image component with no url', () => {
		expect(renderer.create(imageSmNoUrl)).toMatchSnapshot()
	})

	test('Small image component', () => {
		expect(renderer.create(imageSm)).toMatchSnapshot()
	})

	test('Medium image component', () => {
		expect(renderer.create(imageMed)).toMatchSnapshot()
	})

	test('Large image component', () => {
		expect(renderer.create(imageLarge)).toMatchSnapshot()
	})

	test('Image component with a custom url of a custom size', () => {
		expect(renderer.create(imageCustom)).toMatchSnapshot()
	})

	test('Image component with height only', () => {
		expect(renderer.create(imageHeightOnly)).toMatchSnapshot()
	})

	test('Image component with width only', () => {
		expect(renderer.create(imageWidthOnly)).toMatchSnapshot()
	})

	test('Image component with no width and no height', () => {
		expect(renderer.create(imageNoWidthNoHeight)).toMatchSnapshot()
	})

	test('Image component updates to error state if image does not load', () => {
		const component = mount(<Image chunk={{ modelState: { url: 'someUrl' } }} />)
		const img = component.find('img')
		const event = { target: {} }

		img.prop('onError')(event)
		component.update()

		expect(component.find('div').hasClass('is-not-valid')).toBe(true)
		expect(component.exists('img')).toBe(false)
	})

	test('Image component updates to loaded state after image loads', () => {
		const component = mount(<Image chunk={{ modelState: { url: 'someUrl' } }} />)
		const event = { target: {} }

		expect(component.find('img').hasClass('is-not-loaded')).toBe(true)
		component.find('img').prop('onLoad')(event)
		component.update()

		expect(component.find('img').hasClass('is-loaded')).toBe(true)
	})
})
