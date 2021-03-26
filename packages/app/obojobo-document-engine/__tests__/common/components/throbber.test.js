import React from 'react'
import Throbber from '../../../src/scripts/common/components/throbber'
import { create, act } from 'react-test-renderer'

describe('Throbber', () => {

	test('Throbber component', async () => {
        let component
		await act( async () => {
			component = create(<Throbber/>)
		})

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
