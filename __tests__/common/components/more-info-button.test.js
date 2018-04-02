import React from 'react'
import renderer from 'react-test-renderer'

import MoreInfoButton from '../../../src/scripts/common/components/more-info-button'

describe('ModalContainer', () => {
	test('Defaults', () => {
		const component = renderer.create(<MoreInfoButton />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Label', () => {
		const component = renderer.create(<MoreInfoButton label="Testing 123" />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
