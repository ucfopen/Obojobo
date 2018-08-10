import './nav.scss'

import React from 'react'

import NavUtil from '../../viewer/util/nav-util'
import Logo from '../../viewer/components/logo'
import isOrNot from '../../common/isornot'
import Common from 'Common'

const { OboModel } = Common.models
const { StyleableText } = Common.text
const { StyleableTextComponent } = Common.text

export default class Nav extends React.Component {
	onClick(item) {
		switch (item.type) {
			case 'link':
				if (!NavUtil.canNavigate(this.props.navState)) return
				NavUtil.gotoPath(item.fullPath)
				break

			case 'sub-link':
				OboModel.models[item.id].getDomEl().scrollIntoView({ behavior: 'smooth', block: 'start' })
				break
		}
	}

	renderLabel(label) {
		if (label instanceof StyleableText) {
			return <StyleableTextComponent text={label} />
		}

		return <a>{label}</a>
	}

	renderLink(index, isSelected, list, lockEl) {
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
				{this.renderLabel(item.label)}
				{lockEl}
			</li>
		)
	}

	renderSubLink(index, isSelected, list, lockEl) {
		const item = list[index]
		const isLastInList = !list[index + 1]

		const className =
			'sub-link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.correct, 'correct') +
			isOrNot(isLastInList, 'last-in-list')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
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
		if (isLocked) {
			return <div className="lock-icon" />
		}
	}

	render() {
		const navState = this.props.navState
		const lockEl = this.getLockEl(navState.locked)

		const list = NavUtil.getOrderedList(navState)

		const className =
			'viewer--components--nav' +
			isOrNot(navState.locked, 'locked') +
			isOrNot(navState.open, 'open') +
			isOrNot(!navState.disabled, 'enabled')

		return (
			<div className={className}>
				<button className="toggle-button" onClick={NavUtil.toggle}>
					Toggle Navigation Menu
				</button>
				<ul>
					{list.map((item, index) => {
						switch (item.type) {
							case 'heading':
								return this.renderHeading(index, item)

							case 'link':
								return this.renderLink(index, navState.navTargetId === item.id, list, lockEl)

							case 'sub-link':
								return this.renderSubLink(index, navState.navTargetIndex === index, list, lockEl)
						}

						return null
					})}
				</ul>
				<Logo />
			</div>
		)
	}
}
