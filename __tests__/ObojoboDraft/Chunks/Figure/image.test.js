import React from 'react'
import { shallow } from 'enzyme'
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
						width: 100
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
	test('renders without error', () => {
		expect(shallow(imageSm)).toMatchSnapshot()
	})
	test('creates an image with a custom url of a preset size', () => {
		expect(shallow(imageSmUrl)).toMatchSnapshot()
	})

	test('creates an image with a custom url of a custom size', () => {
		expect(shallow(imageCustom)).toMatchSnapshot()
	})
	test('creates an image with height only', () => {
		expect(shallow(imageHeightOnly)).toMatchSnapshot()
	})
	test('creates an image with width only', () => {
		expect(shallow(imageWidthOnly)).toMatchSnapshot()
	})
})
