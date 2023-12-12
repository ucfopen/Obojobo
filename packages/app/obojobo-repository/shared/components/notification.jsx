import React from 'react'
import { useState, useEffect } from 'react'
import './notification.scss'

const Notification = () => {
	const [notifications, setNotifications] = useState([])
	const [hiddenNotifications, setHiddenNotifications] = useState([])

	useEffect(() => {
		if (document && document.cookie) {
			const cookiePropsRaw = decodeURIComponent(document.cookie).split(';')

			let parsedValue
			cookiePropsRaw.forEach(c => {
				const parts = c.trim().split('=')
				if (parts[0] === 'notifications') {
					parsedValue = JSON.parse(parts[1])
				}
			})

			const parsedNotifications = parsedValue
			setNotifications(parsedNotifications)
		} else {
			//there is nothing to render
		}
	}, [])

	//when user clicks exit button, remove notification from state and add to hidden notifications
	function onClickExitNotification(key) {
		setHiddenNotifications(prevHiddenNotifications => [...prevHiddenNotifications, key])
		setNotifications(prevNotifications => prevNotifications.filter((_, index) => index !== key))
	}

	const renderNotification = (key, text, title) => {
		return (
			<div className={`notification-banner`} key={key}>
				<div className="notification-header">
					<h1>{title}</h1>
					<button onClick={() => onClickExitNotification(key)} className="notification-exit-button">
						x
					</button>
				</div>
				<p>{text}</p>
			</div>
		)
	}

	//rewrite to cookie to remove notifications that have been hidden
	if (hiddenNotifications && hiddenNotifications.length >= 1) {
		const jsonNotifications = JSON.stringify(notifications)
		const cookieString = `${encodeURIComponent(jsonNotifications)};`
		document.cookie = 'notifications=' + cookieString
	}
	if (notifications && notifications.length >= 1) {
		return (
			<div className="notification-wrapper">
				{notifications.map((notifications, key) =>
					renderNotification(key, notifications.text, notifications.title)
				)}
			</div>
		)
	} else {
		return null
	}
}

export default Notification
