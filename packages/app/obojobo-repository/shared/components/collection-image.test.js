import React from 'react'
import CollectionImage from './collection-image'
import { mount } from 'enzyme'

describe('CollectionImage', () => {
	test('CollectionImage renders correctly with provided id in props, no context', () => {
		const component = mount(<CollectionImage id="mockCollectionId" />)

		expect(component.find('pattern').is('#collection-img-id-mockCollectionId')).toBe(true)
	})

	test('CollectionImage renders correctly with provided id and context in props', () => {
		const component = mount(<CollectionImage id="mockCollectionId" context="extra-context" />)

		expect(component.find('pattern').is('#collection-img-id-mockCollectionId-extra-context')).toBe(
			true
		)
	})
})
