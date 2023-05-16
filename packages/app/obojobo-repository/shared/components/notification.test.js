import React from 'react'
import Notification from './Notification'
import { mount } from 'enzyme'

describe('Notification component', () => {
	const onClickExitNotification = jest.fn()

	test('renders nothing if there is no notification cookie', () => {
		Object.defineProperty(document, 'cookie', { value: '', writable: true })
		const wrapper = mount(<Notification onClickExitNotification={onClickExitNotification} />)
		expect(wrapper.html()).toEqual('<div class="notification-wrapper"></div>')
	})

	test('renders a notification banner for each notification in the cookie', () => {
		const cookie =
			'notifications=[{"title":"Title 1","text":"Text 1"},{"title":"Title 2","text":"Text 2"}]'
		Object.defineProperty(document, 'cookie', { value: cookie, writable: true })
		const wrapper = mount(<Notification onClickExitNotification={onClickExitNotification} />)
		expect(wrapper.find('.notification-banner')).toHaveLength(2)
		expect(
			wrapper
				.find('.notification-header h1')
				.at(0)
				.text()
		).toEqual('Title 1')
		expect(
			wrapper
				.find('.notification-header h1')
				.at(1)
				.text()
		).toEqual('Title 2')
		expect(
			wrapper
				.find('.notification-header button')
				.at(0)
				.text()
		).toEqual('X')
		expect(
			wrapper
				.find('.notification-header button')
				.at(1)
				.text()
		).toEqual('X')
		expect(wrapper.find('.notification-exit-button')).toHaveLength(2)
		expect(
			wrapper
				.find('.notification-exit-button')
				.at(0)
				.prop('onClick')
		).toBeInstanceOf(onClickExitNotification)
		expect(
			wrapper
				.find('.notification-exit-button')
				.at(1)
				.prop('onClick')
		).toBeInstanceOf(onClickExitNotification)
		expect(
			wrapper
				.find('.notification-banner p')
				.at(0)
				.text()
		).toEqual('Text 1')
		expect(
			wrapper
				.find('.notification-banner p')
				.at(1)
				.text()
		).toEqual('Text 2')
	})
})
