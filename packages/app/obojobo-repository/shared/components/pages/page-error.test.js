import React from 'react'
import PageError from './page-error'
import renderer from 'react-test-renderer'

describe('PageError', () => {
	test('renders when given props', () => {
		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName'
		}

		const component = renderer.create(<PageError currentUser={mockCurrentUser} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
