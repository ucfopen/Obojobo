import React from 'react'
import Spinner from '../../../src/scripts/common/components/spinner'
import { create, act } from 'react-test-renderer'

describe('Spinner', () => {
	test('Spinner component', async () => {
		let component
		await act(async () => {
			component = create(<Spinner />)
		})

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
