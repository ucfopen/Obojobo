import React from 'react'
import PageLogin from './page-login'
import renderer from 'react-test-renderer'

describe('PageLogin', () => {
	test('renders when given props', () => {
		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName'
		}

		const component = renderer.create(<PageLogin currentUser={mockCurrentUser} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
