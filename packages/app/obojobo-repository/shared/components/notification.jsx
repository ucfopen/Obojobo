import React from 'react'
import { useState, useEffect } from 'react'
import '../../../obojobo-document-engine/src/scripts/viewer/components/notification.scss'

const Notification = () => {
	var [notification, setNotification] = useState([])
	useEffect(() => {
		if (document && document.cookie) {
			setNotification(getNotification(document.cookie))
		}
	}, [])

	const getNotification = cookie => {
		const cookiePropsRaw = decodeURIComponent(cookie).split(';')
		let parsedValue
		cookiePropsRaw.forEach(c => {
			const parts = c.trim().split('=')
			if (parts[0] === 'notifications') {
				parsedValue = JSON.parse(parts[1])
			}
		})
		//array of objects
		return parsedValue
	}

	function onClickExitNotification(event, key) {
		//remove that notification from cookie... or just reset last login and reload
		var notificationList = notification
		if (key == 0) {
			notificationList.splice(key, 1)
		} else {
			notificationList.splice(key, 1)
		}
		setNotification(notificationList)
		//setCookie('notifications', notificationList);
	}

	const renderNotifications = (text, title, key) => {
		return (
			<div className="notification-banner">
				<div className="notification-header">
					<h1>{title}</h1>
					<button
						onClick={event => onClickExitNotification(event, key)}
						className="notification-exit-button"
					>
						X
					</button>
				</div>
				<p>{text}</p>
			</div>
		)
	}

	if (notification) {
		return (
			<div className="notification-wrapper">
				{notification.map((notification, key) =>
					renderNotifications(notification.text, notification.title, key)
				)}
			</div>
		)
	} else {
		return null
	}
}

export default Notification
