import './nav.scss'

import React from 'react'
import { connect } from 'react-redux'

import Common from 'obojobo-document-engine/src/scripts/common'
import Logo from '../logo'
import NavHeader from './nav-header/nav-header'
import NavItem from './nav-item/nav-item'
import NavSubItem from './nav-sub-item/nav-sub-item'

const { Button } = Common.components
const { StyleableText, StyleableTextComponent } = Common.text
const { isOrNot } = Common.util

const Nav = props => {
	const {
		oboNodeList,
		adjList,
		navList,
		currentNavIndex,
		currFocusNode,
		isNavEnabled,
		isNavLocked
	} = props

	const rendererNavSubItem = () => {
		return adjList[navList[currentNavIndex]].map(childIndex => {
			const currNode = oboNodeList[childIndex]
			if (
				currNode.attributes.type !== 'ObojoboDraft.Chunks.Heading' &&
				currNode.attributes.content.headingLevel !== 2
			) {
				return null
			}
			const { textGroup } = currNode.attributes.content
			const className = 'sub-link' + isOrNot(childIndex === currFocusNode, 'selected')
			// isOrNot(isLastInList, 'last-in-list')
			return (
				<NavSubItem
					key={childIndex}
					label={textGroup[0].text.value}
					onClick={() => props.updateFocusNode(childIndex)}
					className={className}
				/>
			)
		})
	}

	const rendererNavItem = () => {
		return navList.map((navIndex, index) => {
			const lockEl = isNavLocked && index !== currentNavIndex ? <div className="lock-icon" /> : null
			const currNode = oboNodeList[navList[index]]
			const className =
				'link' +
				isOrNot(index === currentNavIndex, 'selected') +
				isOrNot(currNode.attributes.type === 'ObojoboDraft.Sections.Assessment', 'assessment') +
				isOrNot(index === 0, 'first-in-list') +
				isOrNot(index === navList.length - 1, 'last-in-list')
			return (
				<>
					<NavItem
						key={navIndex}
						index={navIndex}
						label={oboNodeList[navIndex].attributes.content.title}
						onClick={() => props.updateNavItem(index)}
						className={className}
						lockEl={lockEl}
					/>
					{index === currentNavIndex ? rendererNavSubItem() : null}
				</>
			)
		})
	}

	const className =
		'viewer--components--nav' + isOrNot(isNavLocked, 'locked') + isOrNot(isNavEnabled, 'open')
	return (
		<nav className={className} tabIndex="-1" role="navigation" aria-label="Navigation">
			<Button
				altAction
				className="skip-nav-button"
				disabled={!isNavEnabled}
				aria-hidden={!isNavEnabled}
			>
				Skip Navigation
			</Button>
			<button className="toggle-button" onClick={props.onNavToggle}>
				Toggle Navigation Menu
			</button>
			<ul aria-hidden={!isNavEnabled} tabIndex="-1">
				<NavHeader />
				{rendererNavItem()}
			</ul>
			<Logo />
		</nav>
	)
}

const mapStateToProps = ({
	oboNodeList,
	adjList,
	navList,
	currentNavIndex,
	isNavEnabled,
	isNavLocked,
	currFocusNode
}) => {
	return {
		oboNodeList,
		adjList,
		navList,
		currentNavIndex,
		isNavEnabled,
		isNavLocked,
		currFocusNode
	}
}

const mapDispatchToProops = dispatch => {
	return {
		updateNavItem: index => dispatch({ type: 'UPDATE_NAV', payload: { value: index } }),
		onNavToggle: () => dispatch({ type: 'ON_SET_NAV_ENABLE' }),
		updateFocusNode: index => dispatch({ type: 'ON_SET_CURR_FOCUS', payload: { index } })
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProops
)(Nav)
