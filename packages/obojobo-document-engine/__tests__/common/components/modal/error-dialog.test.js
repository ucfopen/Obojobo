import React from 'react'
import ErrorDialog from '../../../../src/scripts/common/components/modal/error-dialog'
import renderer from 'react-test-renderer'

test('ErrorDialog', () => {
	const component = renderer.create(<ErrorDialog title="Title">Content</ErrorDialog>)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
