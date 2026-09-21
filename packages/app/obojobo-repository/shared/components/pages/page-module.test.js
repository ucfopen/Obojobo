jest.mock('../../api-util')
jest.mock('dayjs')
jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})

import React from 'react'
import PageModule from './page-module'
import { create, act } from 'react-test-renderer'
import ReactModal from 'react-modal'

const Button = require('../button')
const ButtonLink = require('../button-link')
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
		ReactModal.setAppElement = jest.fn()
	})

	beforeEach(() => {
		jest.clearAllMocks()

		mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: []
		}

		mockModule = {
			draftId: 'mockDraftId',
			title: 'mockDraftTitle',
			createdAt: new Date(0).toISOString(),
			updatedAt: new Date(0).toISOString()
		}
	})

	test('renders when given props - current user can copy and preview', () => {
		const component = create(
			<PageModule
				currentUser={mockCurrentUser}
				owner={mockCurrentUser}
				module={mockModule}
				canCopy={true}
				canPreview={true}
			/>
		)

		const previewButton = component.root.findAllByType(ButtonLink)
		expect(previewButton.length).toBe(1)

		const copyButtonArea = component.root.findAllByProps({ className: 'copy-button-container' })
		expect(copyButtonArea.length).toBe(1)

		// should only have one button in it
		const copyButtons = copyButtonArea[0].findAllByType(Button)
		expect(copyButtons.length).toBe(1)
		expect(copyButtons[0].props.children).toBe('Copy this module')

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('renders when given props - current user can not copy or preview', () => {
		const component = create(
			<PageModule
				currentUser={mockCurrentUser}
				owner={mockCurrentUser}
				module={mockModule}
				canCopy={false}
				canPreview={false}
			/>
		)

		const previewButton = component.root.findAllByType(ButtonLink)
		expect(previewButton.length).toBe(0)

		const copyButtonArea = component.root.findAllByProps({ className: 'copy-button-container' })
		expect(copyButtonArea.length).toBe(0)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Shows copy options when the initial copy button is clicked', () => {
		let component
		act(() => {
			component = create(
				<PageModule
					currentUser={mockCurrentUser}
					owner={mockCurrentUser}
					module={mockModule}
					canCopy={true}
					canPreview={true}
				/>
			)
		})

		const copyButtonArea = component.root.findByProps({ className: 'copy-button-container' })

		// should only have one button in it
		let copyButtons = copyButtonArea.findAllByType(Button)
		expect(copyButtons.length).toBe(1)
		expect(copyButtons[0].props.children).toBe('Copy this module')

		act(() => {
			copyButtons[0].props.onClick()
		})

		// single button should be replaced with three buttons
		copyButtons = copyButtonArea.findAllByType(Button)
		expect(copyButtons.length).toBe(3)

		expect(copyButtons[0].props.children).toBe('Normal Copy')
		expect(copyButtons[1].props.children).toBe('Read-Only Copy')
		expect(copyButtons[2].props.children).toBe('Cancel')
	})

	test('Runs correct functions when the "Normal Copy" button is clicked', () => {
		let component
		act(() => {
			component = create(
				<PageModule
					currentUser={mockCurrentUser}
					owner={mockCurrentUser}
					module={mockModule}
					canCopy={true}
					canPreview={true}
				/>
			)
		})

		const copyButtonArea = component.root.findByProps({ className: 'copy-button-container' })
		let copyButtons = copyButtonArea.findAllByType(Button)

		act(() => {
			copyButtons[0].props.onClick()
		})

		copyButtons = copyButtonArea.findAllByType(Button)

		act(() => {
			copyButtons[0].props.onClick()
		})

		expect(APIUtil.copyModule).toHaveBeenCalledTimes(1)
		expect(APIUtil.copyModule).toHaveBeenCalledWith('mockDraftId', false)
	})

	test('Runs correct functions when the "Read-Only Copy" button is clicked', () => {
		let component
		act(() => {
			component = create(
				<PageModule
					currentUser={mockCurrentUser}
					owner={mockCurrentUser}
					module={mockModule}
					canCopy={true}
					canPreview={true}
				/>
			)
		})

		const copyButtonArea = component.root.findByProps({ className: 'copy-button-container' })
		let copyButtons = copyButtonArea.findAllByType(Button)

		act(() => {
			copyButtons[0].props.onClick()
		})

		copyButtons = copyButtonArea.findAllByType(Button)

		act(() => {
			copyButtons[1].props.onClick()
		})

		expect(APIUtil.copyModule).toHaveBeenCalledTimes(1)
		expect(APIUtil.copyModule).toHaveBeenCalledWith('mockDraftId', true)
	})

	test('Runs correct functions when the "Cancel" button is clicked', () => {
		let component
		act(() => {
			component = create(
				<PageModule
					currentUser={mockCurrentUser}
					owner={mockCurrentUser}
					module={mockModule}
					canCopy={true}
					canPreview={true}
				/>
			)
		})

		const copyButtonArea = component.root.findByProps({ className: 'copy-button-container' })

		// should only have one button in it
		let copyButtons = copyButtonArea.findAllByType(Button)
		expect(copyButtons.length).toBe(1)
		expect(copyButtons[0].props.children).toBe('Copy this module')

		act(() => {
			copyButtons[0].props.onClick()
		})

		// single button should be replaced with three buttons
		copyButtons = copyButtonArea.findAllByType(Button)
		expect(copyButtons.length).toBe(3)

		expect(copyButtons[0].props.children).toBe('Normal Copy')
		expect(copyButtons[1].props.children).toBe('Read-Only Copy')
		expect(copyButtons[2].props.children).toBe('Cancel')

		act(() => {
			copyButtons[2].props.onClick()
		})

		copyButtons = copyButtonArea.findAllByType(Button)
		expect(copyButtons.length).toBe(1)
		expect(copyButtons[0].props.children).toBe('Copy this module')
	})
})
