import React from 'react'
import renderer from 'react-test-renderer'
import Image from '../../../../ObojoboDraft/Chunks/Figure/image'

describe('Image', () => {
	let imageSm
	let imageSmNoUrl
	let imageMed
	let imageLarge
	let imageCustom
	let imageHeightOnly
	let imageWidthOnly
	let imageNoWidthNoHeight
	const uuidUrl = '52727a4f-0970-4b2c-941a-ce8027078b40'
	beforeEach(() => {
		imageSmNoUrl = <Image chunk={{ modelState: { size: 'small', alt: 'alt text' } }} />
		imageSm = <Image chunk={{ modelState: { url: uuidUrl, size: 'small', alt: 'alt text' } }} />
		imageMed = <Image chunk={{ modelState: { url: uuidUrl, size: 'medium', alt: 'alt text' } }} />
		imageLarge = <Image chunk={{ modelState: { url: uuidUrl, size: 'large', alt: 'alt text' } }} />
		imageCustom = (
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
		imageHeightOnly = (
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
		imageWidthOnly = (
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
		imageNoWidthNoHeight = (
			<Image
				chunk={{
					modelState: {
						url: uuidUrl,
						size: 'custom'
					}
				}}
			/>
		)
	})

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
})
