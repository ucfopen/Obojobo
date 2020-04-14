jest.mock('../../api-util')
jest.mock('dayjs')

import React from 'react'
import PageModule from './page-module'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

const Button = require('../button')
const APIUtil = require('../../api-util')

const dayjs = require('dayjs')

describe('PageModule', () => {
	let mockCurrentUser
	let mockModule

	beforeAll(() => {
		// dayjs will normally adjust output based on the current date
		// either we update the snapshot once a year or we do this
		dayjs.mockImplementation(() => ({
			format: () => 'Jan 1, 1970',
			fromNow: () => 'A long time ago'
		}))
		dayjs.extend = jest.fn()
	})

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
			createdAt: new Date(0).toISOString(),
			updatedAt: new Date(0).toISOString()
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
