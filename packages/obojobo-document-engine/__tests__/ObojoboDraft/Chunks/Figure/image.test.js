import React from 'react'
import { shallow } from 'enzyme'
import Image from '../../../../ObojoboDraft/Chunks/Figure/image'

describe('Image', () => {
	let imageSm
	let imageSmUrl
	let imageCustom
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
	})
	it('renders without error', () => {
		expect(shallow(imageSm)).toMatchSnapshot()
	})

	it('creates an image with a custom url of a preset size', () => {
		expect(shallow(imageSmUrl)).toMatchSnapshot()
	})

	it('creates an image with a custom url of a custom size', () => {
		expect(shallow(imageCustom)).toMatchSnapshot()
	})
})
