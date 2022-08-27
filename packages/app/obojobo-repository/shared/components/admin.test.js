import React from 'react'
import { create, act } from 'react-test-renderer'
// import Button from './button'

import Admin from './admin'

describe('Admin', () => {
    beforeEach(() => {
		jest.resetAllMocks()
	})

    const getTestProps = () => ({
        currentUser: {
            id: 99,
			avatarUrl: '/path/to/avatar',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: [
				'canViewEditor',
				'canEditDrafts',
				'canDeleteDrafts',
				'canCreateDrafts',
				'canPreviewDrafts'
			]
        },
        loadUserList: jest.fn()
    })

    test('Renders "tools loaded" state correctly', () => {
        const component = create(<Admin {...getTestProps()} />)
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})