import './inline-nav-button.scss'

import React from 'react'
import { connect } from 'react-redux'

import NavUtil from '../../viewer/util/nav-util'

const InlineNavButton = (props) => {

	let navIndex
	switch (props.type) {
		case 'prev':
			navIndex = props.navItem - 1;
			break;

		case 'next':
			navIndex = props.navItem + 1;
			break;
	}
	const disabled = navIndex < 0 || navIndex >= props.navList.length

	return (
		<button
			className={`viewer--components--inline-nav-button is-${props.type}${
				disabled ? ' is-not-enabled' : ' is-enabled'
			}`}
			onClick={() => props.updateNavItem(navIndex)}
			// aria-label={this.props.ariaLabel}
			// aria-disabled={this.props.disabled}
		>
			{"test"}
		</button>
	)
}

const mapStateToProps = ({ oboNodeList, adjList, navList, navItem }) => {
	return {
		oboNodeList,
		adjList,
		navList,
		navItem
	}
}

const mapDispatchToProops = dispatch => {
	return {
		updateNavItem: index => dispatch({ type: 'UPDATE_NAV', payload: { value: index } })
	}
}

export default connect(mapStateToProps, mapDispatchToProops)(InlineNavButton)
