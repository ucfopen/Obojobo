import './nav.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import FocusUtil from '../util/focus-util'
import Logo from './logo'
import NavUtil from '../util/nav-util'
import React from 'react'

const { Button } = Common.components
const { StyleableText, StyleableTextComponent } = Common.text
const { isOrNot } = Common.util
const { Dispatcher } = Common.flux
const TIMER_MOBILE_NAV_COLLAPSE = 900

const getLabelTextFromLabel = label => {
	if (!label) return ''
	return label instanceof StyleableText ? label.value : label
}

export default class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.selfRef = React.createRef()
		this.onWindowClick = this.onWindowClick.bind(this)
		this.hideOrShowOnResize = this.hideOrShowOnResize.bind(this)
	}

	isMobileSize() {
		return window.matchMedia('(max-width: 480px)').matches
	}

	onWindowClick(event) {
		if(this.isMobileSize() && !this.selfRef.current.contains(event.target)) {
			NavUtil.close()
		}
	}

	hideOrShowOnResize(){
		const isMobile = this.isMobileSize()

		if(window.innerWidth > this.prevWidth){ // window size is increasing
			if(!isMobile) NavUtil.open()
		} else if(isMobile) { // window size is decreasing
			NavUtil.close()
		}

		this.prevWidth = window.innerWidth
	}

	componentDidMount() {
		this.prevWidth = window.innerWidth
		window.addEventListener('mouseup', this.onWindowClick)
		window.addEventListener('pointerup', this.onWindowClick)
		window.addEventListener('resize', this.hideOrShowOnResize)

		if(this.isMobileSize()) {
			setTimeout(() => {
				NavUtil.close()
			}, TIMER_MOBILE_NAV_COLLAPSE)
		}
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.onWindowClick)
		window.removeEventListener('pointerup', this.onWindowClick)
		window.removeEventListener('resize', this.hideOrShowOnResize)
	}

	onClick(item) {
		switch (item.type) {
			case 'link': {
				if (!NavUtil.canNavigate(this.props.navState)) return

				const navTargetId = NavUtil.getNavTarget(this.props.navState).id

				// If clicking on the section link for a section you're already on then simply
				// scroll page to the top, otherwise navigate to that section
				if (navTargetId === item.id) {
					Dispatcher.trigger('viewer:scrollToTop', {
						value: { animateScroll: true }
					})
				} else {
					NavUtil.gotoPath(item.fullPath)
					FocusUtil.focusOnNavigation()
				}
				break
			}

			case 'sub-link': {
				FocusUtil.focusComponent(item.id, { animateScroll: true })
				break
			}
		}
	}

	focus() {
		Common.page.focus(this.selfRef)
	}

	onClickSkipNavigation() {
		FocusUtil.focusOnNavTarget()
	}

	renderLabel(label) {
		return label instanceof StyleableText ? <StyleableTextComponent text={label} /> : label
	}

	renderLinkButton(label, ariaLabel, isDisabled, refId = null) {
		return (
			<button ref={refId} aria-disabled={isDisabled} aria-label={ariaLabel}>
				{this.renderLabel(label)}
			</button>
		)
	}

	renderLink(index, isSelected, list, isItemDisabled, lockEl) {
		const item = list[index]
		const isFirstInList = !list[index - 1]
		const isLastInList = !list[index + 1]

		const className =
			'link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.complete, 'complete') +
			isOrNot(item.flags.correct, 'correct') +
			isOrNot(item.flags.assessment, 'assessment') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		const labelText = getLabelTextFromLabel(item.label)
		let ariaLabel = labelText
		if (item.contentType) {
			ariaLabel = item.contentType + ' ' + ariaLabel
		}
		if (isSelected) {
			ariaLabel = 'Currently on ' + ariaLabel
		} else {
			ariaLabel = 'Go to ' + ariaLabel
		}

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLinkButton(item.label, ariaLabel, isItemDisabled, item.id)}
				{lockEl}
			</li>
		)
	}

	renderSubLink(index, isSelected, list, isItemDisabled, lockEl) {
		const item = list[index]
		const isLastInList = !list[index + 1]

		const className =
			'sub-link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.correct, 'correct') +
			isOrNot(isLastInList, 'last-in-list')

		const labelText = getLabelTextFromLabel(item.label)
		let ariaLabel = labelText
		ariaLabel = 'Jump to ' + labelText
		if (item.parent && item.parent.type && item.parent.type === 'link') {
			ariaLabel += ' inside ' + getLabelTextFromLabel(item.parent.label)
		}

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLinkButton(item.label, ariaLabel, isItemDisabled)}
				{lockEl}
			</li>
		)
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
				{item.label}
			</li>
		)
	}

	getLockEl(isLocked) {
		if (!isLocked) return null
		return <div className="lock-icon" />
	}

	render() {
		const navState = this.props.navState
		const list = NavUtil.getOrderedList(navState)
		const lockEl = this.getLockEl(navState.locked)
		const isNavInaccessible = navState.disabled || !navState.open
		const className =
			'viewer--components--nav' +
			isOrNot(navState.locked, 'locked') +
			isOrNot(navState.open, 'open') +
			isOrNot(!navState.disabled, 'enabled')

		return (
			<nav
				className={className}
				tabIndex="-1"
				ref={this.selfRef}
				role="navigation"
				aria-label="Navigation"
			>
				<Button
					altAction
					className="skip-nav-button"
					disabled={isNavInaccessible}
					onClick={this.onClickSkipNavigation}
					aria-hidden={isNavInaccessible}
				>
					Skip Navigation
				</Button>
				<button className="toggle-button" onClick={NavUtil.toggle}>
					Toggle Navigation Menu
				</button>
				<ul aria-hidden={isNavInaccessible} tabIndex="-1">
					{list.map((item, index) => {
						switch (item.type) {
							case 'heading':
								return this.renderHeading(index, item)

							case 'link':
								return this.renderLink(
									index,
									navState.navTargetId === item.id,
									list,
									navState.locked || isNavInaccessible,
									lockEl
								)

							case 'sub-link':
								return this.renderSubLink(
									index,
									navState.navTargetIndex === index,
									list,
									isNavInaccessible,
									lockEl
								)
						}

						return null
					})}
				</ul>
				<Logo />
			</nav>
		)
	}
}
