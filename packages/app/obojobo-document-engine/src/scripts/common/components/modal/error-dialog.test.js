import React from 'react'
import ErrorDialog from './error-dialog'
import renderer from 'react-test-renderer'

describe('ErrorDialog', () => {
	test('ErrorDialog component', () => {
		const component = renderer.create(<ErrorDialog title="Title">Content</ErrorDialog>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
