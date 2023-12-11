import React from 'react'
import { useState, useEffect } from 'react'
import '../../../obojobo-document-engine/src/scripts/viewer/components/notification.scss'

//notifications are stored through cookies
const Notification = () => {
	//stores array of notification objects as state variable
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

	//removes the notification by key from the list of those to be displayed and writes that list back into the cookie
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
						X
					</button>
				</div>
				<p>{text}</p>
			</div>
		)
	}

	if (notifications && notifications.length >= 1) {
		//rewrite to cookie to update the list of notifications to be displayed
		const jsonNotifications = JSON.stringify(notifications)
		const cookieString = `${encodeURIComponent(jsonNotifications)};`
		document.cookie = 'notifications= ' + cookieString

		return (
			<div className="notification-wrapper">
				{notifications.map((notifications, key) =>
					renderNotification(key, notifications.text, notifications.title)
				)}
			</div>
		)
	} else {
		//document.cookie = 'notifications= '  //clears the cookie //how is document not defined here? //fix for exit last notification
		return null
	}
}

export default Notification
