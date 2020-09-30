import React from 'react'
import PageHomepage from './page-homepage'
import renderer from 'react-test-renderer'

describe('PageHomepage', () => {
	test('renders when given props', () => {
		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName'
		}

		const component = renderer.create(<PageHomepage currentUser={mockCurrentUser} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
