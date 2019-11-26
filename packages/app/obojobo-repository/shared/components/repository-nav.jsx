require('./repository-nav.scss')

const React = require('react')
const { useState } = require('react')
const Avatar = require('./avatar')

const RepositoryNav = (props) => {
	let timeOutId
	const [isMenuOpen, setMenuOpen] = useState(false)
	const onCloseMenu = () => setMenuOpen(false)
	const onToggleMenu = (e) => {
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
		clearTimeout(timeOutId);
	}

	return(
		<div 
			className="repository--section-wrapper repository--stick-to-top"
			onMouseLeave={onCloseMenu}
			onFocus={onFocusHandler}
			onBlur={onBlurHandler}>
			<nav className="repository--nav">
				<a href="/"><div className="repository--nav--logo">Obojobo</div></a>
				<div className="repository--nav--links--link"><a href="/library">Module Library</a></div>
				<div className="repository--nav--links--link"><a href="/dashboard">Dashboard</a></div>
				{ /* <Search /> */ }
				{ props.userId !== 0 ?
					<div className="repository--nav--current-user">
						<button onClick={onToggleMenu}>
							<div className="repository--nav--current-user--name">{props.displayName}</div>
							<Avatar id={props.userId} avatarUrl={props.avatarUrl} notice={props.noticeCount} className="repository--nav--current-user--avatar" />
						</button>
						<div className={"repository--nav--current-user--menu " + (isMenuOpen ? "is-open" : "is-not-open")}>
							<div className="repository--nav--current-user--link"><a href="/profile/logout">Log Out</a></div>
						</div>
					</div>
					: <div className="repository--nav--links--link"><a href="/login">Log in</a></div>
				}
			</nav>
		</div>
	)
}

module.exports = RepositoryNav
