import React from 'react'
import Spinner from './spinner'
import { create } from 'react-test-renderer'

describe('Spinner', () => {
	test('Spinner component', async () => {
		const component = create(<Spinner />)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
