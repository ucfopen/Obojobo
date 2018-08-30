import './nav.scss'

import React from 'react'

import NavUtil from '../../viewer/util/nav-util'
import Logo from '../../viewer/components/logo'
import isOrNot from '../../common/isornot'
import Common from 'Common'

const { OboModel } = Common.models
const { StyleableText } = Common.text
const { StyleableTextComponent } = Common.text
const { Button } = Common.components
const { Dispatcher } = Common.flux

export default class Nav extends React.Component {
	onClick(item) {
		switch (item.type) {
			case 'link':
				if (!NavUtil.canNavigate(this.props.navState)) return
				this.shouldFocusOnContentAfterUpdate = true
				NavUtil.gotoPath(item.fullPath)
				break

			case 'sub-link':
				OboModel.models[item.id].getDomEl().scrollIntoView({ behavior: 'smooth', block: 'start' })
				break
		}
	}

	onClickSkipNavigation() {
		Dispatcher.trigger('viewer:focusOnContent')
	}

	renderLabel(label) {
		if (label instanceof StyleableText) {
			return <StyleableTextComponent text={label} />
		}

		return label
	}

	renderLinkButton(label, isDisabled, refId = null) {
		return (
			<button ref={refId} disabled={isDisabled}>
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
			isOrNot(item.flags.visited, 'visited') +
			isOrNot(item.flags.complete, 'complete') +
			isOrNot(item.flags.correct, 'correct') +
			isOrNot(item.flags.assessment, 'assessment') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLinkButton(item.label, isItemDisabled, item.id)}
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

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLinkButton(item.label, isItemDisabled)}
				{lockEl}
			</li>
		)
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	getLockEl(isLocked) {
		if (!isLocked) return null
		return <div className="lock-icon" />
	}

	componentDidUpdate() {
		if (this.shouldFocusOnContentAfterUpdate) {
			Dispatcher.trigger('viewer:focusOnContent')
			delete this.shouldFocusOnContentAfterUpdate
		}
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
			<nav className={className}>
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
				<ul aria-hidden={isNavInaccessible}>
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
