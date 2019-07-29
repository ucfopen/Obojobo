import './nav.scss'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Common from 'obojobo-document-engine/src/scripts/common'
import Logo from '../logo'
import NavHeader from './nav-header/nav-header'
import NavItem from './nav-item/nav-item'
import NavSubItem from './nav-sub-item/nav-sub-item'

const { Button } = Common.components
const { StyleableText, StyleableTextComponent } = Common.text
const { isOrNot } = Common.util

const Nav = () => {
	// Get states from Redux Store
	const {
		oboNodeList,
		adjList,
		navList,
		currNavIndex,
		currFocusNode,
		isNavEnabled,
		isNavLocked
	} = useSelector(state => state)

	// Get actions from Redux Store
	const dispatch = useDispatch()

	const rendererNavSubItem = () => {
		return adjList[navList[currNavIndex]].map(oboNodeIndex => {
			const currNode = oboNodeList[oboNodeIndex]
			if (
				currNode.attributes.type !== 'ObojoboDraft.Chunks.Heading' &&
				currNode.attributes.content.headingLevel !== 2
			) {
				return null
			}
			const { textGroup } = currNode.attributes.content
			const className = 'sub-link' + isOrNot(oboNodeIndex === currFocusNode, 'selected')
			// isOrNot(isLastInList, 'last-in-list')
			return (
				<NavSubItem
					key={oboNodeIndex}
					label={textGroup[0].text.value}
					onClick={() => dispatch({ type: 'ON_SET_CURR_FOCUS', payload: { index: oboNodeIndex } })}
					className={className}
				/>
			)
		})
	}

	const rendererNavItem = () => {
		return navList.map((navIndex, index) => {
			const lockEl = isNavLocked && index !== currNavIndex ? <div className="lock-icon" /> : null
			const currNode = oboNodeList[navList[index]]
			const className =
				'link' +
				isOrNot(index === currNavIndex, 'selected') +
				isOrNot(currNode.attributes.type === 'ObojoboDraft.Sections.Assessment', 'assessment') +
				isOrNot(index === 0, 'first-in-list') +
				isOrNot(index === navList.length - 1, 'last-in-list')
			return (
				<>
					<NavItem
						key={navIndex}
						index={navIndex}
						label={oboNodeList[navIndex].attributes.content.title}
						onClick={() => dispatch({ type: 'ON_SET_NAV', payload: { value: index } })}
						className={className}
						lockEl={lockEl}
					/>
					{index === currNavIndex ? rendererNavSubItem() : null}
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
			<button className="toggle-button" onClick={() => dispatch({ type: 'ON_SET_NAV_ENABLE' })}>
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

export default Nav
