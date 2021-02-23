import React from 'react'
import RepositoryBanner from './repository-banner'
import { create } from 'react-test-renderer'

describe('RepositoryBanner', () => {
	test('renders correctly with no props', () => {
		const component = create(<RepositoryBanner />)

		const expectedClasses =
			'repository--section-wrapper--full-width repository--section-wrapper--grey '
		expect(component.root.children[0].props.className).toBe(expectedClasses)

		expect(
			component.root.findByProps({ className: 'repository--title-banner--title' }).children[0]
		).toBeUndefined()

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with props and children', () => {
		const bannerProps = {
			className: 'extra-class',
			title: 'Banner Title'
		}
		const component = create(<RepositoryBanner {...bannerProps}>child</RepositoryBanner>)

		const expectedClasses =
			'repository--section-wrapper--full-width repository--section-wrapper--grey extra-class'
		expect(component.root.children[0].props.className).toBe(expectedClasses)

		expect(
			component.root.findByProps({ className: 'repository--title-banner--title' }).children[0]
		).toBe('Banner Title')

		expect(component.toJSON()).toMatchSnapshot()
	})
})
