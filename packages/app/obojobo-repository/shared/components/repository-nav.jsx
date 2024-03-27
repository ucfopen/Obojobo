require('./repository-nav.scss')

const React = require('react')
const Avatar = require('./avatar')
const Notification = require('./notification')

const RepositoryNav = props => {
	let timeOutId
	const [isMenuOpen, setMenuOpen] = React.useState(false)
	const [isNotificationsOpen, setNotificationsOpen] = React.useState(false)
	const [numberNotifications, setNumberNotifications] = React.useState(0)

	const handleNotificationsData = numberOfNotificationsData => {
		// Handle the data received from the Notification component
		setNumberNotifications(numberOfNotificationsData)
	}

	const onCloseMenu = () => setMenuOpen(false)
	const onToggleMenu = e => {
		setMenuOpen(!isMenuOpen)
		e.preventDefault() // block the event from bubbling out to the parent href
	}
	// Handle keyboard focus removal
	const onBlurHandler = () => {
		timeOutId = setTimeout(() => {
			setMenuOpen(false)
		})
	}
	const onFocusHandler = () => {
		clearTimeout(timeOutId)
	}
	const onToggleNotifications = e => {
		setNotificationsOpen(!isNotificationsOpen)
		e.preventDefault() // block the event from bubbling out to the parent href
	}
	function onClickExitPopup() {
		setNotificationsOpen(false)
	}

	React.useEffect(() => {
		//to set the number of notifications initially
		if (document && document.cookie) {
			const cookiePropsRaw = decodeURIComponent(document.cookie).split(';')

			let parsedValue
			cookiePropsRaw.forEach(c => {
				const parts = c.trim().split('=')
				if (parts[0] === 'notifications') {
					parsedValue = JSON.parse(parts[1])
				}
			})

			if (parsedValue && parsedValue.length >= 1) {
				setNumberNotifications(parsedValue.length)
			}
		} else {
			// there is nothing to update
		}
	}, [])

	return (
		<div
			className="repository--section-wrapper repository--stick-to-top"
			onMouseLeave={onCloseMenu}
			onFocus={onFocusHandler}
			onBlur={onBlurHandler}
		>
			<nav className="repository--nav">
				<a href="/">
					<div className="repository--nav--logo">Obojobo</div>
				</a>
				<div className="repository--nav--links--link">
					<a href="/library">Module Library</a>
				</div>
				{props.userId !== 0 ? (
					<div className="repository--nav--links--link">
						<a href="/dashboard">Dashboard</a>
					</div>
				) : null}
				{props.userPerms.indexOf('canViewStatsPage') > -1 ? (
					<div className="repository--nav--links--link">
						<a href="/stats">Stats</a>
					</div>
				) : null}
				{props.userId !== 0 ? (
					<div className="repository--nav--current-user">
						<button onClick={onToggleMenu}>
							<div className="repository--nav--current-user--name">
								{props.displayName}

								{numberNotifications > 0 && (
									<button className="notification-indicator" onClick={onToggleNotifications}>
										{numberNotifications} Notifications
									</button>
								)}
							</div>
							<Avatar
								id={props.userId}
								avatarUrl={props.avatarUrl}
								notice={props.noticeCount}
								className="repository--nav--current-user--avatar"
							/>
						</button>
						<div
							className={
								'repository--nav--current-user--menu ' + (isMenuOpen ? 'is-open' : 'is-not-open')
							}
						>
							<div className="repository--nav--current-user--link">
								<a href="/profile/logout">Log Out</a>
							</div>
						</div>
					</div>
				) : (
					<div className="repository--nav--links--link">
						<a href="/login">Log in</a>
					</div>
				)}
			</nav>
			{isNotificationsOpen && (
				<div>
					<div className="popup active">
						<div className="exit-container">
							<button className="exit-button" onClick={onClickExitPopup}>
								X
							</button>
						</div>
						<div className="notification-container">
							<Notification onDataFromNotification={handleNotificationsData} />
						</div>
					</div>
					<div className="overlay active"></div>
				</div>
			)}
		</div>
	)
}

module.exports = RepositoryNav
