jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})
jest.mock('react-transition-group', () => ({
	// eslint-disable-next-line react/display-name
	CSSTransition: props => <mock-CSSTransition {...props}>{props.children}</mock-CSSTransition>
}))

import React from 'react'
import { create, act } from 'react-test-renderer'

import ReactModal from 'react-modal'
import VersionHistoryDialog from './version-history-dialog'
import VersionHistoryListItem from './version-history-list-item'
import Loading from './loading'

describe('VersionHistoryDialog', () => {
	let defaultProps

	const commonVersionHistory = [
		{
			id: 'mockRevisionId1',
			createdAtDisplay: 'mockCreatedAtDisplay1',
			username: 'mockRevisionUsername',
			versionNumber: 3,
			isRestored: false
		},
		{
			id: 'mockRevisionId2',
			createdAtDisplay: 'mockCreatedAtDisplay2',
			username: 'mockRevisionUsername',
			versionNumber: 2,
			isRestored: false
		},
		{
			id: 'mockRevisionId3',
			createdAtDisplay: 'mockCreatedAtDisplay3',
			username: 'mockRevisionUsername',
			versionNumber: 1,
			isRestored: false
		}
	]

	beforeEach(() => {
		defaultProps = {
			title: 'mockVersionHistoryDialogTitle',
			draftId: 'mockDraftId',
			isHistoryLoading: false,
			hasHistoryLoaded: false,
			versionHistory: [],
			restoreVersion: jest.fn(),
			onClose: jest.fn()
		}
	})

	test('renders with default props', () => {
		let component
		act(() => {
			component = create(<VersionHistoryDialog {...defaultProps} />)
		})

		expect(component.root.findAllByType(VersionHistoryListItem).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with history items', () => {
		defaultProps.versionHistory = commonVersionHistory

		let component
		act(() => {
			component = create(<VersionHistoryDialog {...defaultProps} />)
		})

		expect(component.root.findAllByType(VersionHistoryListItem).length).toBe(3)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('opens and closes confirmation dialog correctly', () => {
		defaultProps.versionHistory = commonVersionHistory

		const reusableComponent = <VersionHistoryDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// confirmation dialog should not be rendered yet
		expect(component.root.findAllByType(ReactModal).length).toBe(0)

		act(() => {
			// click the 'Restore this version' button
			component.root.findByProps({ className: 'restore-button' }).props.onClick()
			component.update(reusableComponent)
		})

		// confirmation dialog should be rendered now
		expect(component.root.findAllByType(ReactModal).length).toBe(1)

		act(() => {
			// click the 'Cancel' button in the confirmation dialog
			component.root
				.findByType(ReactModal)
				.findByProps({ className: 'secondary-button' })
				.props.onClick()
			component.update(reusableComponent)
		})

		// confirmation dialog should no longer be rendered
		expect(component.root.findAllByType(ReactModal).length).toBe(0)
	})

	test('selects revisions correctly', () => {
		defaultProps.versionHistory = commonVersionHistory

		const reusableComponent = <VersionHistoryDialog {...defaultProps} />

		let component
		act(() => {
			component = create(reusableComponent)
		})

		const revisionListItems = component.root.findAllByType(VersionHistoryListItem)
		const currentTitleElement = component.root.findByProps({ className: 'editor-preview--header' })
			.children[1]

		expect(revisionListItems.length).toBe(3)

		// latest version should be selected by default
		expect(currentTitleElement.children[1]).toBe('Latest Version')
		expect(revisionListItems[0].props.isSelected).toBe(true)
		// just making sure
		expect(revisionListItems[1].props.isSelected).toBe(false)
		expect(revisionListItems[2].props.isSelected).toBe(false)

		act(() => {
			// click the second revision item
			// this is relying a bit much on VersionHistoryListItem's behavior, which
			//  uses the callback provided and gives it the item's 'index' prop
			revisionListItems[1].children[0].props.onClick()
			component.update(reusableComponent)
		})

		// second version from the top should be selected now
		expect(currentTitleElement.children[1]).toBe(
			`Version ${commonVersionHistory[1].versionNumber} from ${commonVersionHistory[1].createdAtDisplay}`
		)
		// still just making sure
		expect(revisionListItems[0].props.isSelected).toBe(false)
		expect(revisionListItems[1].props.isSelected).toBe(true)
		expect(revisionListItems[2].props.isSelected).toBe(false)

		act(() => {
			// same as before, but third version instead of second
			revisionListItems[2].children[0].props.onClick()
			component.update(reusableComponent)
		})

		expect(currentTitleElement.children[1]).toBe(
			`Version ${commonVersionHistory[2].versionNumber} from ${commonVersionHistory[2].createdAtDisplay}`
		)
		expect(revisionListItems[0].props.isSelected).toBe(false)
		expect(revisionListItems[1].props.isSelected).toBe(false)
		expect(revisionListItems[2].props.isSelected).toBe(true)
	})

	test('updates version history when fetching is complete correctly', () => {
		let component
		act(() => {
			component = create(<VersionHistoryDialog versionHistory={[]} />)
		})

		expect(component.root.findAllByType(VersionHistoryListItem).length).toBe(0)

		act(() => {
			component.update(<VersionHistoryDialog versionHistory={commonVersionHistory} />)
		})

		expect(component.root.findAllByType(VersionHistoryListItem).length).toBe(3)
	})

	test('menu toggle functions correctly', () => {
		defaultProps.versionHistory = commonVersionHistory

		const reusableComponent = <VersionHistoryDialog {...defaultProps} />

		let component
		act(() => {
			component = create(reusableComponent)
		})

		// there doesn't appear to be a straightforward way of testing this
		//  this prop is tied to the state we're checking - it'll have to do
		// the menu starts out open
		expect(component.root.findByType(Loading).children[0].props.in).toBe(true)

		const toggleButtons = component.root.findAllByProps({ className: 'toggle-button' })

		act(() => {
			toggleButtons[0].props.onClick()
			component.update(reusableComponent)
		})
		expect(component.root.findByType(Loading).children[0].props.in).toBe(false)

		// may as well check both toggle buttons
		act(() => {
			toggleButtons[1].props.onClick()
			component.update(reusableComponent)
		})
		expect(component.root.findByType(Loading).children[0].props.in).toBe(true)
	})

	test('no revision restoration is attempted if the selected version is the current one', () => {
		defaultProps.versionHistory = commonVersionHistory

		const reusableComponent = <VersionHistoryDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// have to render the confirmation dialogue to reach the button we need to click
		act(() => {
			component.root.findByProps({ className: 'restore-button' }).props.onClick()
			component.update(reusableComponent)
		})

		expect(component.root.findAllByType(ReactModal).length).toBe(1)

		// since another revision wasn't selected, this should close the confirmation window and not call the callback
		act(() => {
			component.root.findByProps({ className: 'dialog-controls' }).children[1].props.onClick()
			component.update(reusableComponent)
		})
		expect(component.root.findAllByType(ReactModal).length).toBe(0)
		expect(defaultProps.restoreVersion).not.toHaveBeenCalled()
	})

	test('revision restoration functions correctly', () => {
		defaultProps.versionHistory = commonVersionHistory

		const reusableComponent = <VersionHistoryDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		act(() => {
			// click the second revision item
			component.root.findAllByType(VersionHistoryListItem)[1].children[0].props.onClick()
			component.update(reusableComponent)
		})

		// have to render the confirmation dialogue to reach the button we need to click
		act(() => {
			component.root.findByProps({ className: 'restore-button' }).props.onClick()
			component.update(reusableComponent)
		})

		expect(component.root.findAllByType(ReactModal).length).toBe(1)

		// since another revision was selected, this should close the confirmation window and call the callback
		act(() => {
			component.root.findByProps({ className: 'dialog-controls' }).children[1].props.onClick()
			component.update(reusableComponent)
		})
		expect(component.root.findAllByType(ReactModal).length).toBe(0)
		expect(defaultProps.restoreVersion).toHaveBeenCalledTimes(1)
		expect(defaultProps.restoreVersion).toHaveBeenCalledWith(
			'mockDraftId',
			commonVersionHistory[1].id
		)
	})

	test('clicking the "x" button calls onClose', () => {
		let component
		act(() => {
			component = create(<VersionHistoryDialog {...defaultProps} />)
		})

		component.root.findByProps({ className: 'close-button' }).props.onClick()
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
	})
})
