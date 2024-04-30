jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})
import React from 'react'
import renderer from 'react-test-renderer'
import ReactModal from 'react-modal'

mockStaticDate()

// require used to make sure it's loaded after mock date
const PageLogin = require('./page-login')

describe('PageLogin', () => {
	ReactModal.setAppElement = jest.fn()

	test('renders when given props', () => {
		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: []
		}

		const component = renderer.create(<PageLogin currentUser={mockCurrentUser} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
