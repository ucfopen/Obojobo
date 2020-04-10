jest.mock('../../api-util')

import React from 'react'
import PageModule from './page-module'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

const Button = require('../button')
const APIUtil = require('../../api-util')

describe('PageModule', () => {
	let mockCurrentUser
	let mockModule

	beforeEach(() => {
		mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName'
		}

		mockModule = {
			draftId: 'mockDraftId',
			title: 'mockDraftTitle',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	})

	test('renders when given props', () => {
		const component = renderer.create(
			<PageModule currentUser={mockCurrentUser} owner={mockCurrentUser} module={mockModule} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('reacts properly when the copy button is clicked', () => {
		const component = shallow(
			<PageModule
				currentUser={mockCurrentUser}
				owner={mockCurrentUser}
				module={mockModule}
				canCopy={true}
			/>
		)

		component.find(Button).simulate('click')

		expect(APIUtil.copyModule).toHaveBeenCalledTimes(1)
		expect(APIUtil.copyModule).toHaveBeenCalledWith('mockDraftId')
	})
})
