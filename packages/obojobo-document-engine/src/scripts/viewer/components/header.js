import './header.scss'

import React from 'react'

import Logo from './logo'

const Header = props => {
	let logoPosition

	switch (props.logoPosition) {
		case 'left':
			logoPosition = 'left'
			break

		case 'right':
		default:
			logoPosition = 'right'
			break
	}

	return (
		<header className={'viewer--components--header is-logo-' + logoPosition}>
			<div className="wrapper">
				<span className="module-title">{props.moduleTitle}</span>
				<span className="location">{props.location}</span>
				<Logo />
			</div>
		</header>
	)
}

export default Header
