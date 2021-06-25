import React from 'react'
import renderer from 'react-test-renderer'

mockStaticDate()

// require used to make sure it's loaded after mock date
const PageHomepage = require('./page-homepage')

describe('PageHomepage', () => {
	test('renders when given props', () => {
		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: []
		}

		const component = renderer.create(<PageHomepage currentUser={mockCurrentUser} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
