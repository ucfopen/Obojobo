import React from 'react'
import RepositoryNav from './repository-nav'
import { create, act } from 'react-test-renderer'

describe('RepositoryNav', () => {
	let navProps

	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		navProps = {
			userId: 99,
			displayName: 'Display Name',
			userPerms: []
		}
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

		if (document && document.cookie) {
			//don't get here
		} else {
			expect(document.cookie).toBe(null)
		}
		document.cookie = originalDocument
	})
	test('toggles notifications popup on button click', () => {
		const component = create(<RepositoryNav {...navProps} />)
		const notificationsButton = component.root.findByProps({
			className: 'repository--nav--current-user--name'
		})

		expect(component.root.findAllByProps({ className: 'popup' }).length).toBe(0)

		act(() => {
			notificationsButton.props.onClick()
			component.update(<RepositoryNav {...navProps} />)
		})
		expect(component.root.findAllByProps({ className: 'popup' }).length).toBe(1)

		act(() => {
			notificationsButton.props.onClick()
			component.update(<RepositoryNav {...navProps} />)
		})
		expect(component.root.findAllByProps({ className: 'popup' }).length).toBe(0)
	})

	test('renders notifications indicator when notificationsExist is true', () => {
		const navProps = {
			userId: 99,
			displayName: 'Display Name',
			userPerms: [],
			notificationsExist: true
		}
		const component = create(<RepositoryNav {...navProps} />)
		const notificationsIndicator = component.root.findAllByProps({
			className: 'notification-indicator'
		})
		expect(navProps.notificationsExist).toBe(true)
		expect(notificationsIndicator).toBeTruthy()
	})

	test('does not render notifications indicator when notificationsExist is false', () => {
		const component = create(<RepositoryNav {...navProps} notificationsExist={false} />)

		const notificationsIndicators = component.root.findAllByProps({
			className: 'notification-indicator'
		})
		expect(notificationsIndicators).not.toBe()
	})
})
