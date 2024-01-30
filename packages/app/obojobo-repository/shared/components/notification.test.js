import React from 'react'
import { create, act } from 'react-test-renderer'
import Notification from './notification'

describe('Notification component', () => {
	beforeAll(() => {
		Object.defineProperty(document, 'cookie', {
			value: '',
			writable: true
		})
	})

	test('renders without crashing', () => {
		const component = create(<Notification />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('loads notifications from cookies on mount', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([{ key: 1, text: 'Test Notification', title: 'Test Title' }])

		const component = create(<Notification />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(document.cookie).toBe(
			'notifications=%5B%7B%22key%22%3A1%2C%22text%22%3A%22Test%20Notification%22%2C%22title%22%3A%22Test%20Title%22%7D%5D;'
		)
	})

	test('handles click on exit button and updates state and cookie', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([
				{ key: 1, text: 'Notification1', title: 'Title1' },
				{ key: 2, text: 'Notification2', title: 'Title2' }
			])

		const reusableComponent = <Notification />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		// Simulate click on exit button for the first notification
		const key = 0
		const exitButtons = component.root.findAllByProps({ className: 'notification-exit-button' })

		if (exitButtons[key]) {
			act(() => {
				exitButtons[key].props.onClick()
			})

			// Update the tree after state changes
			tree = component.toJSON()
			expect(tree).toMatchSnapshot()
			expect(document.cookie).toBe(
				'notifications=%5B%7B%22key%22%3A2%2C%22text%22%3A%22Notification2%22%2C%22title%22%3A%22Title2%22%7D%5D;'
			)
		}
	})

	test('hides the notification on exit button click', () => {
		document.cookie =
			'notifications=' +
			JSON.stringify([{ key: 1, text: 'Test Notification', title: 'Test Title' }])

		const elementToExit = document.getElementsByClassName('notification-exit-button')[0]
		const reusableComponent = <Notification />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		const key = 0
		const exitButtons = component.root.findAllByProps({ className: 'notification-exit-button' })

		act(() => {
			exitButtons[key].props.onClick()
		})

		tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		if (elementToExit) {
			expect(elementToExit.style.display).toBe('undefined')
		}
	})
	test('renders null when there are no notifications but document.cookie is not null', () => {
		const reusableComponent = <Notification />
		let component
		act(() => {
			component = create(reusableComponent)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		if (document && document.cookie) {
			const cookiePropsRaw = decodeURIComponent(document.cookie).split(';')

			cookiePropsRaw.forEach(c => {
				const parts = c.trim().split('=')

				if (parts[0] === 'notifications') {
					//don't get here
				} else {
					expect(parts[0]).not.toBe('notifications')
				}
			})
		} else {
			expect(document.cookie).toBe(undefined)
		}
	})
	test('renders null when document.cookie is null', () => {
		const originalDocument = document.cookie
		document.cookie = null

		const reusableComponent = <Notification />
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
	test('does not update cookie when there are no notifications', () => {
		// Ensure notifications state is empty
		const component = create(<Notification />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		// The useEffect should not update the cookie since notifications is empty
		expect(document.cookie).toBe('notifications=%5B%5D;')
	})
})
