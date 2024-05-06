jest.mock('./notification', () => props => {
	return <mock-Notification>{props.children}</mock-Notification>
})
jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})

import React from 'react'
import RepositoryNav from './repository-nav'
import { create, act } from 'react-test-renderer'
import Notification from './notification'
import ReactModal from 'react-modal'

describe('RepositoryNav', () => {
	let navProps

	beforeAll(() => {
		ReactModal.setAppElement = jest.fn()
	})
	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		navProps = {
			userId: 99,
			displayName: 'Display Name',
			userPerms: []
		}
		Object.defineProperty(document, 'cookie', {
			value: '',
			writable: true
		})
	})
	afterEach(() => {
		jest.resetAllMocks()
	})
	const expectMenuToBeOpen = component => {
		expect(
			component.root.findAllByProps({ className: 'repository--nav--current-user--menu is-open' })
				.length
		).toBe(1)
	}
	const expectMenuToBeClosed = component => {
		expect(
			component.root.findAllByProps({
				className: 'repository--nav--current-user--menu is-not-open'
			}).length
		).toBe(1)
	}
	const expectNotificationsPopupToBeOpen = component => {
		const modalInstances = component.root.findAllByType(ReactModal)

		const modalInstance = modalInstances.find(instance =>
			instance.findByProps({ contentLabel: 'Notifications' })
		)
		expect(modalInstance.props.isOpen).toBe(true)
	}
	const expectNotificationsPopupToBeClosed = component => {
		const modalInstances = component.root.findAllByType(ReactModal)

		const modalInstance = modalInstances.find(instance =>
			instance.findByProps({ contentLabel: 'Notifications' })
		)
		expect(modalInstance.props.isOpen).toBe(false)
	}

	// default props.userId = 0 means there is no user logged in
	test('renders correctly with standard expected props but no logged in user', () => {
		navProps.userId = 0
		navProps.displayName = ''
		const component = create(<RepositoryNav {...navProps} />)

		expect(
			component.root.findAllByProps({ className: 'repository--nav--current-user' }).length
		).toBe(0)
		expect(component.root.findAllByProps({ href: '/login' }).length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with standard expected props', () => {
		const component = create(<RepositoryNav {...navProps} />)

		expect(
			component.root.findAllByProps({ className: 'repository--nav--current-user' }).length
		).toBe(1)
		expect(
			component.root.findByProps({ className: 'repository--nav--current-user--name' }).children[0]
		).toBe(navProps.displayName)
		expect(component.root.findAllByProps({ href: '/login' }).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders stats section with canViewStatsPage', () => {
		const component = create(<RepositoryNav {...navProps} userPerms={['canViewStatsPage']} />)

		expect(
			component.root.findAllByProps({ className: 'repository--nav--current-user' }).length
		).toBe(1)
		expect(
			component.root.findByProps({ className: 'repository--nav--current-user--name' }).children[0]
		).toBe(navProps.displayName)
		expect(component.root.findAllByProps({ href: '/login' }).length).toBe(0)
		expect(component.root.findAllByProps({ href: '/stats' }).length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('does not render stats section with just canViewSystemStats', () => {
		const component = create(<RepositoryNav {...navProps} userPerms={['canViewSystemStats']} />)

		expect(
			component.root.findAllByProps({ className: 'repository--nav--current-user' }).length
		).toBe(1)
		expect(
			component.root.findByProps({ className: 'repository--nav--current-user--name' }).children[0]
		).toBe(navProps.displayName)
		expect(component.root.findAllByProps({ href: '/login' }).length).toBe(0)
		expect(component.root.findAllByProps({ href: '/stats' }).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('clicking current user button toggles a class on a menu element', () => {
		const reusableComponent = <RepositoryNav {...navProps} />
		const component = create(reusableComponent)

		expectMenuToBeClosed(component)

		const mockClickEvent = { preventDefault: jest.fn() }
		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user' })
				.children[0].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
		mockClickEvent.preventDefault.mockReset()
		expectMenuToBeOpen(component)

		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user' })
				.children[0].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expectMenuToBeClosed(component)
		expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
	})

	test('keyboard focus and blur adjust a class on a menu component as necessary', () => {
		const reusableComponent = <RepositoryNav {...navProps} />
		const component = create(reusableComponent)

		expectMenuToBeClosed(component)

		act(() => {
			component.root.children[0].props.onFocus()
		})
		expect(window.clearTimeout).toHaveBeenCalledTimes(1)

		expectMenuToBeClosed(component)

		const mockClickEvent = { preventDefault: jest.fn() }
		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user' })
				.children[0].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expectMenuToBeOpen(component)

		act(() => {
			component.root.children[0].props.onBlur()

			expect(window.setTimeout).toHaveBeenCalledTimes(1)
			jest.runAllTimers()

			component.update(reusableComponent)
		})
		expectMenuToBeClosed(component)
	})

	test('the menu is closed after onMouseLeave is called', () => {
		const reusableComponent = <RepositoryNav {...navProps} />
		const component = create(reusableComponent)

		expectMenuToBeClosed(component)

		const mockClickEvent = { preventDefault: jest.fn() }
		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user' })
				.children[0].props.onClick(mockClickEvent)
			component.update(reusableComponent)
		})
		expectMenuToBeOpen(component)

		act(() => {
			component.root.children[0].props.onMouseLeave()
			component.update(reusableComponent)
		})
		expectMenuToBeClosed(component)
	})

	test('loads notifications from cookies on mount', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([{ key: 1, text: 'Test Notification', title: 'Test Title' }])

		const component = create(<RepositoryNav {...navProps} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(document.cookie).toBe(
			'notifications=[{"key":1,"text":"Test Notification","title":"Test Title"}]'
		)
	})

	test('renders null when document.cookie is null', () => {
		const originalDocument = document.cookie
		document.cookie = null

		const reusableComponent = <RepositoryNav {...navProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		expect(document).not.toBeNull()
		expect(document.cookie).toBe(null)

		document.cookie = originalDocument
	})

	test('toggles notifications popup on button click', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([
				{ key: 1, text: 'Notification1', title: 'Title1' },
				{ key: 2, text: 'Notification2', title: 'Title2' }
			])

		const component = create(<RepositoryNav {...navProps} />)
		act(() => {
			component.update(<RepositoryNav {...navProps} />)
		})

		const mockClickEvent = { preventDefault: jest.fn() }

		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user--name' })
				.children[1].props.onClick(mockClickEvent)
			component.update(<RepositoryNav {...navProps} />)
		})
		expectNotificationsPopupToBeOpen(component)

		act(() => {
			component.root.findByProps({ className: 'exit-button' }).props.onClick()
			component.update(<RepositoryNav {...navProps} />)
		})
		expectNotificationsPopupToBeClosed(component)
	})

	test('handles notification data from Notification component', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([
				{ key: 1, text: 'Notification1', title: 'Title1' },
				{ key: 2, text: 'Notification2', title: 'Title2' }
			])

		const component = create(<RepositoryNav {...navProps} />)
		act(() => {
			component.update(<RepositoryNav {...navProps} />)
		})

		const mockClickEvent = { preventDefault: jest.fn() }

		act(() => {
			component.root
				.findByProps({ className: 'repository--nav--current-user--name' })
				.children[1].props.onClick(mockClickEvent)
			component.update(<RepositoryNav {...navProps} />)
		})

		const notificationComponentInstance = component.root.findByType(Notification)

		// Manually call the onDataFromNotification prop with some test data, this normally happens notificationIsOpen is true and Notifications are rendered
		act(() => {
			notificationComponentInstance.props.onDataFromNotification(5)
		})

		expect(
			component.root.findByProps({ className: 'repository--nav--current-user--name' }).children[1]
				.props.children[0]
		).toBe(5)
	})
	test('renders null when there are no notifications but document.cookie is not null', () => {
		const reusableComponent = <RepositoryNav {...navProps} />
		let component
		let parsedValue
		const notificationValue = 'otherrandomdata=otherrandomdata'
		document.cookie = notificationValue
		act(() => {
			component = create(reusableComponent)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		expect(document).not.toBeNull()
		expect(document.cookie).not.toBeNull()

		const cookiePropsRaw = decodeURIComponent(document.cookie).split(';')

		cookiePropsRaw.forEach(c => {
			const parts = c.trim().split('=')

			expect(parts[0]).not.toBe('notifications')
			expect(parts[0] === 'notifications').toBe(false)
		})
		expect(document.cookie).toBe(notificationValue)
		expect(parsedValue).toBe(undefined)
	})
})
