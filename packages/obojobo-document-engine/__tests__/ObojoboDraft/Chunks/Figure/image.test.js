import React from 'react'
import renderer from 'react-test-renderer'
import Image from '../../../../ObojoboDraft/Chunks/Figure/image'

describe('Image', () => {
	let imageSm
	let imageSmUrl
	let imageCustom
	let imageHeightOnly
	let imageWidthOnly
	beforeEach(() => {
		imageSm = <Image chunk={{ modelState: { size: 'small', alt: 'alt text' } }} />
		imageSmUrl = <Image chunk={{ modelState: { url: 'url', size: 'small', alt: 'alt text' } }} />
		imageCustom = (
			<Image
				chunk={{
					modelState: {
						url: 'url',
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
						url: 'url',
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
						url: 'url',
						size: 'custom',
						width: 100
					}
				}}
			/>
		)
	})
	test('Image component without error', () => {
		expect(renderer.create(imageSm)).toMatchSnapshot()
	})
	test('Image component with a custom url of a preset size', () => {
		expect(renderer.create(imageSmUrl)).toMatchSnapshot()
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
})
