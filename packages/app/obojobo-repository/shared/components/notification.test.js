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
		const component = create(<Notification onDataFromNotification={() => {}} />) // Provide a mock function for onDataFromNotification
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
	test('renders nothing when document.cookie is null', () => {
		const onDataFromNotification = jest.fn()
		const originalDocument = document.cookie
		Object.defineProperty(document, 'cookie', { value: null, writable: true })

		const reusableComponent = <Notification onDataFromNotification={onDataFromNotification} />
		let component
		act(() => {
			component = create(reusableComponent)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		document.cookie = originalDocument
	})
	test('loads notifications from cookies on mount', () => {
		const onDataFromNotification = jest.fn()
		const notificationValue = [{ key: 1, text: 'Test Notification', title: 'Test Title' }]
		document.cookie = `notifications=${JSON.stringify(notificationValue)}`

		const component = create(<Notification onDataFromNotification={onDataFromNotification} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(document.cookie).toBe(`notifications=${JSON.stringify(notificationValue)}`)
	})

	test('handles click on exit button and updates state and cookie', () => {
		const onDataFromNotification = jest.fn()
		const notificationValue = [
			{ key: 1, text: 'Notification1', title: 'Title1' },
			{ key: 2, text: 'Notification2', title: 'Title2' }
		]
		document.cookie = `notifications=${JSON.stringify(notificationValue)}`

		const reusableComponent = <Notification onDataFromNotification={onDataFromNotification} />
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

			tree = component.toJSON()
			expect(tree).toMatchSnapshot()
			expect(document.cookie).toBe(
				`notifications=${encodeURIComponent(JSON.stringify(notificationValue))};`
			)
		}
	})

	test('hides the notification on exit button click', () => {
		const onDataFromNotification = jest.fn()
		document.cookie =
			'notifications=' +
			JSON.stringify([{ key: 1, text: 'Test Notification', title: 'Test Title' }])

		const elementToExit = document.getElementsByClassName('notification-exit-button')[0]
		const reusableComponent = <Notification onDataFromNotification={onDataFromNotification} />
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

		expect(elementToExit).toBe(undefined)
	})
	test('renders null when there are no notifications but document.cookie is not null', () => {
		const onDataFromNotification = jest.fn()
		const reusableComponent = <Notification onDataFromNotification={onDataFromNotification} />
		const originalDocument = document.cookie
		let component
		const cookieValue = 'otherrandomdata=otherrandomdata'
		document.cookie = cookieValue
		act(() => {
			component = create(reusableComponent)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		expect(document).not.toBeNull()
		expect(document.cookie).not.toBeNull()

		const cookiePropsRaw = decodeURIComponent(document.cookie).split(';')

		const parts = cookiePropsRaw[0].trim().split('=')

		expect(parts[1]).toBe('undefined')
		document.cookie = originalDocument
	})
	test('does not update cookie when there are no notifications', () => {
		const onDataFromNotification = jest.fn()
		const notificationValue = []
		document.cookie = `notifications=${JSON.stringify(notificationValue)}`

		const component = create(<Notification onDataFromNotification={onDataFromNotification} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(document.cookie).toBe(`notifications=${JSON.stringify(notificationValue)}`)
	})
})
