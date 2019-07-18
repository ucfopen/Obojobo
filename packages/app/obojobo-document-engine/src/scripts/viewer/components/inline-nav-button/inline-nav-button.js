import './inline-nav-button.scss'

import React from 'react'
import { connect } from 'react-redux'


const inlineNavButton = (props) => {

    let navIndex
    let content
    let disabled
	switch (props.type) {
		case 'prev':
            navIndex = props.currentNavIndex - 1;
            content = 'Prev: '
            disabled = navIndex < 0
            content = disabled ? 'Start of Obojobo Example Document' : `Prev: ${props.oboNodeList[props.navList[navIndex]].attributes.content.title}`
			break
		case 'next':
            navIndex = props.currentNavIndex + 1;
            content = 'Next: '
            disabled = navIndex >= props.navList.length
            content = disabled ? 'End of Obojobo Example Document' : `Next: ${props.oboNodeList[props.navList[navIndex]].attributes.content.title}`
			break
	}
	return (
		<button
			className={`viewer--components--inline-nav-button is-${props.type}${
				disabled ? ' is-not-enabled' : ' is-enabled'
			}`}
			onClick={() => props.updateNavItem(navIndex)}
			// aria-label={this.props.ariaLabel}
			// aria-disabled={this.props.disabled}
		>
			{content}
		</button>
	)
}

const mapStateToProps = ({ oboNodeList, adjList, navList, currentNavIndex }) => {
	return {
		oboNodeList,
		adjList,
		navList,
		currentNavIndex
	}
}

const mapDispatchToProops = dispatch => {
	return {
		updateNavItem: index => dispatch({ type: 'UPDATE_NAV', payload: { value: index } })
	}
}

export default connect(mapStateToProps, mapDispatchToProops)(inlineNavButton)
